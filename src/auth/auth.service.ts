import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcryptjs';

import { User, UserRole, UserStatus } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { School, SchoolStatus, SchoolType } from '../schools/entities/school.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(School)
    private readonly schoolRepository: Repository<School>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'status', 'role', 'firstName', 'lastName'],
    });

    if (user && await user.validatePassword(password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const { email, password, role } = loginDto;
    console.log('Login attempt:', { email, role });
    
    const user = await this.validateUser(email, password);
    console.log('User found:', { id: user?.id, email: user?.email, role: user?.role, status: user?.status });
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check school approval for SCHOOL_ADMIN
    if (user.role === UserRole.SCHOOL_ADMIN) {
      // Check if school admin's school is approved
      const school = await this.userRepository.manager
        .createQueryBuilder()
        .select('s.status', 'status')
        .addSelect('s.id', 'id')
        .from('schools', 's')
        .where('s.user_id = :userId', { userId: user.id })
        .getRawOne();
      
      console.log('DEBUG - School Admin Login Check:', {
        userId: user.id,
        userEmail: user.email,
        schoolRawData: school,
        schoolStatus: school?.status,
        statusType: typeof school?.status,
        comparison: school?.status === 'approved',
        statusTrimmed: school?.status?.trim()
      });
      
      if (!school) {
        throw new UnauthorizedException('No school associated with this account.');
      }
      
      // Trim and compare status
      const schoolStatus = String(school.status || '').trim().toLowerCase();
      if (schoolStatus !== 'approved') {
        console.log('DEBUG - Status check failed:', {
          schoolStatus,
          expected: 'approved',
          comparison: schoolStatus === 'approved'
        });
        throw new UnauthorizedException('Your school is not approved yet. Please wait for super admin approval.');
      }
      
      console.log('DEBUG - School approval check PASSED');
    } else {
      // For other roles (non school admin), check user status
      if (user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException('Account is not active');
      }
    }

    // Note: Teachers and students can login regardless of school approval status
    // School approval only affects school admin login

    // Validate role if provided in request
    if (role && user.role !== role) {
      throw new UnauthorizedException('Invalid role for this user');
    }

    // Get schoolId for the user based on their role
    let schoolId: number | undefined;
    
    if (user.role === UserRole.SCHOOL_ADMIN) {
      // Find school created by this admin from schools table
      console.log('🔍 Fetching school for user ID:', user.id);
      console.log('🔍 Query: SELECT s.id as schoolId FROM schools s WHERE s.user_id =', user.id);
      
      const school = await this.userRepository.manager
        .createQueryBuilder()
        .select('s.id', 'schoolId')  // Use alias to get {schoolId: 6}
        .from('schools', 's')
        .where('s.user_id = :userId', { userId: user.id })
        .getRawOne();
      
      console.log('🔍 School query result:', school);
      console.log('🔍 School query result type:', typeof school);
      console.log('🔍 School keys:', school ? Object.keys(school) : 'null');
      console.log('🔍 school.schoolId:', school?.schoolId);
      console.log('🔍 school.s_id:', school?.s_id);
      console.log('🔍 school.id:', school?.id);
      
      // Extract schoolId using the alias or fallback to s_id or id
      schoolId = school?.schoolId || school?.s_id || school?.id;
      console.log('🔍 Extracted schoolId:', schoolId);
      console.log('🔍 schoolId type:', typeof schoolId);
      
      // Additional verification
      if (!schoolId) {
        console.error('❌ WARNING: Could not fetch school ID for user', user.id);
        console.error('❌ User might not have a school or school is inactive');
      }
    } else if (user.role === UserRole.TEACHER || user.role === UserRole.STUDENT) {
      // Find school for teacher/student
      console.log('🔍 Fetching schoolId for', user.role, 'with userId:', user.id);
      
      const schoolQuery = user.role === UserRole.TEACHER 
        ? this.userRepository.manager
            .createQueryBuilder()
            .select('t.schoolId', 'schoolId')
            .from('teachers', 't')
            .where('t.userId = :userId', { userId: user.id })
        : this.userRepository.manager
            .createQueryBuilder()
            .select('s.schoolId', 'schoolId')
            .from('students', 's')
            .where('s.userId = :userId', { userId: user.id });
      
      const result = await schoolQuery.getRawOne();
      console.log('🔍 Query result:', result);
      console.log('🔍 Result keys:', result ? Object.keys(result) : 'null');
      
      schoolId = result?.schoolId || result?.t_schoolId || result?.s_schoolId;
      console.log('🔍 Extracted schoolId:', schoolId);
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      schoolId,
    };

    const token = this.jwtService.sign(payload);

    // Update last login
    await this.userRepository.update(user.id, {
      lastLoginAt: new Date(),
    });

    const response = {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
        schoolId,
      },
    };
    
    console.log('Auth Service - Login Response:', {
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      schoolId: schoolId,
      schoolIdType: typeof schoolId,
      responseUser: response.user
    });
    
    return response;
  }

  async register(createUserDto: CreateUserDto) {
    const { email, password, role, mobile } = createUserDto;

    console.log('=== Registration Request ===');
    console.log('Email:', email);
    console.log('Role:', role);
    console.log('Mobile:', mobile);

    // Check if user already exists by email
    const existingUserByEmail = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUserByEmail) {
      throw new BadRequestException('User with this email already exists');
    }

    // Check if user already exists by mobile (if provided)
    if (mobile) {
      const existingUserByMobile = await this.userRepository.findOne({
        where: { mobile },
      });

      if (existingUserByMobile) {
        throw new BadRequestException('User with this mobile number already exists');
      }
    }

    // Extract only the fields that exist in the database
    const userData = {
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      mobile: createUserDto.mobile,
      password: password,
      role: createUserDto.role,
      status: UserStatus.PENDING,
      dateOfBirth: createUserDto.dateOfBirth,
      address: createUserDto.address,
      city: createUserDto.city,
      state: createUserDto.state,
      country: createUserDto.country,
      postalCode: createUserDto.postalCode,
      // Admin specific fields
      adminPosition: createUserDto.adminPosition,
      yearsOfExperience: createUserDto.yearsOfExperience,
      educationLevel: createUserDto.educationLevel,
      certifications: createUserDto.certifications,
    };

    // Create new user
    console.log('Creating user with data:', {
      ...userData,
      password: '***hidden***'
    });

    try {
      const user = this.userRepository.create(userData);
      const savedUser = await this.userRepository.save(user);
      
      console.log('✅ User created successfully, ID:', savedUser.id);

      // If user is school_admin and school details are provided, create school
      let school = null;
      if (createUserDto.role === UserRole.SCHOOL_ADMIN && createUserDto.schoolName) {
        try {
          console.log('Creating school for user:', savedUser.id);
          
          const schoolData = {
            name: createUserDto.schoolName,
            type: createUserDto.schoolType as SchoolType,
            address: createUserDto.schoolAddress || '',
            city: createUserDto.schoolCity || '',
            state: createUserDto.schoolState || '',
            country: createUserDto.schoolCountry || '',
            postalCode: createUserDto.schoolPostalCode || '',
            phone: createUserDto.schoolPhone,
            email: createUserDto.schoolEmail,
            website: createUserDto.schoolWebsite,
            status: SchoolStatus.PENDING,
            isActive: 1,
            userId: savedUser.id,
          };

          console.log('School data:', schoolData);

          school = this.schoolRepository.create(schoolData);
          await this.schoolRepository.save(school);
          
          console.log('✅ School created successfully, ID:', school.id);
        } catch (error) {
          console.error('❌ Failed to create school:', error.message);
          console.error('School creation error details:', error);
          // Don't throw error, just log it - user is already created
        }
      }

      // Send welcome email
      try {
        await this.sendWelcomeEmail(savedUser.email, savedUser.firstName);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError.message);
        // Don't throw - email failure shouldn't block registration
      }

      const { password: _, ...result } = savedUser;
      console.log('✅ Registration completed successfully');
      return { user: result, school };
    } catch (error) {
      console.error('❌ User creation failed:', error.message);
      console.error('Full error:', error);
      throw error;
    }
  }

  async generateOtp(email: string): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in user entity (you might want to create a separate OTP entity)
    await this.userRepository.update(user.id, {
      // Add OTP field to user entity if needed
    });

    // Send OTP via email
    await this.sendOtpEmail(email, otp);

    return otp;
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    // Implement OTP verification logic
    // This is a simplified version
    return true;
  }

  async refreshToken(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Get schoolId for the user based on their role
    let schoolId: number | undefined;
    
    if (user.role === UserRole.SCHOOL_ADMIN) {
      const school = await this.userRepository.manager
        .createQueryBuilder()
        .select('s.id')
        .from('schools', 's')
        .where('s.user_id = :userId', { userId: user.id })
        .getRawOne();
      schoolId = school?.id;
    } else if (user.role === UserRole.TEACHER) {
      const result = await this.userRepository.manager
        .createQueryBuilder()
        .select('t.schoolId', 'schoolId')
        .from('teachers', 't')
        .where('t.userId = :userId', { userId: user.id })
        .getRawOne();
      schoolId = result?.schoolId || result?.t_schoolId;
    } else if (user.role === UserRole.STUDENT) {
      const result = await this.userRepository.manager
        .createQueryBuilder()
        .select('s.schoolId', 'schoolId')
        .from('students', 's')
        .where('s.userId = :userId', { userId: user.id })
        .getRawOne();
      schoolId = result?.schoolId || result?.s_schoolId;
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      schoolId,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  private async sendWelcomeEmail(email: string, firstName: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome to ChildClub Management System',
        template: 'welcome',
        context: {
          firstName,
          loginUrl: `${process.env.FRONTEND_URL}/login`,
        },
      });
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }
  }

  private async sendOtpEmail(email: string, otp: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Your OTP for ChildClub',
        template: 'otp',
        context: {
          otp,
          expiryTime: '10 minutes',
        },
      });
    } catch (error) {
      console.error('Failed to send OTP email:', error);
    }
  }

  async updateProfile(userId: number, updateData: {
    firstName?: string;
    lastName?: string;
    mobile?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  }) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Update user fields
    if (updateData.firstName !== undefined) user.firstName = updateData.firstName;
    if (updateData.lastName !== undefined) user.lastName = updateData.lastName;
    if (updateData.mobile !== undefined) user.mobile = updateData.mobile;
    if (updateData.address !== undefined) user.address = updateData.address;
    if (updateData.city !== undefined) user.city = updateData.city;
    if (updateData.state !== undefined) user.state = updateData.state;
    if (updateData.country !== undefined) user.country = updateData.country;
    if (updateData.postalCode !== undefined) user.postalCode = updateData.postalCode;

    await this.userRepository.save(user);

    // Return user without password
    const { password, ...result } = user;
    return result;
  }
}
