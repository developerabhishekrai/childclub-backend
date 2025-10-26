"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mailer_1 = require("@nestjs-modules/mailer");
const user_entity_1 = require("../users/entities/user.entity");
const school_entity_1 = require("../schools/entities/school.entity");
let AuthService = class AuthService {
    constructor(userRepository, schoolRepository, jwtService, mailerService) {
        this.userRepository = userRepository;
        this.schoolRepository = schoolRepository;
        this.jwtService = jwtService;
        this.mailerService = mailerService;
    }
    async validateUser(email, password) {
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
    async login(loginDto) {
        const { email, password, role } = loginDto;
        console.log('Login attempt:', { email, role });
        const user = await this.validateUser(email, password);
        console.log('User found:', { id: user?.id, email: user?.email, role: user?.role, status: user?.status });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.role === user_entity_1.UserRole.SCHOOL_ADMIN) {
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
                throw new common_1.UnauthorizedException('No school associated with this account.');
            }
            const schoolStatus = String(school.status || '').trim().toLowerCase();
            if (schoolStatus !== 'approved') {
                console.log('DEBUG - Status check failed:', {
                    schoolStatus,
                    expected: 'approved',
                    comparison: schoolStatus === 'approved'
                });
                throw new common_1.UnauthorizedException('Your school is not approved yet. Please wait for super admin approval.');
            }
            console.log('DEBUG - School approval check PASSED');
        }
        else {
            if (user.status !== user_entity_1.UserStatus.ACTIVE) {
                throw new common_1.UnauthorizedException('Account is not active');
            }
        }
        if (role && user.role !== role) {
            throw new common_1.UnauthorizedException('Invalid role for this user');
        }
        let schoolId;
        if (user.role === user_entity_1.UserRole.SCHOOL_ADMIN) {
            console.log('🔍 Fetching school for user ID:', user.id);
            console.log('🔍 Query: SELECT s.id as schoolId FROM schools s WHERE s.user_id =', user.id);
            const school = await this.userRepository.manager
                .createQueryBuilder()
                .select('s.id', 'schoolId')
                .from('schools', 's')
                .where('s.user_id = :userId', { userId: user.id })
                .getRawOne();
            console.log('🔍 School query result:', school);
            console.log('🔍 School query result type:', typeof school);
            console.log('🔍 School keys:', school ? Object.keys(school) : 'null');
            console.log('🔍 school.schoolId:', school?.schoolId);
            console.log('🔍 school.s_id:', school?.s_id);
            console.log('🔍 school.id:', school?.id);
            schoolId = school?.schoolId || school?.s_id || school?.id;
            console.log('🔍 Extracted schoolId:', schoolId);
            console.log('🔍 schoolId type:', typeof schoolId);
            if (!schoolId) {
                console.error('❌ WARNING: Could not fetch school ID for user', user.id);
                console.error('❌ User might not have a school or school is inactive');
            }
        }
        else if (user.role === user_entity_1.UserRole.TEACHER || user.role === user_entity_1.UserRole.STUDENT) {
            console.log('🔍 Fetching schoolId for', user.role, 'with userId:', user.id);
            const schoolQuery = user.role === user_entity_1.UserRole.TEACHER
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
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            schoolId,
        };
        const token = this.jwtService.sign(payload);
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
    async register(createUserDto) {
        const { email, password, role, mobile } = createUserDto;
        console.log('=== Registration Request ===');
        console.log('Email:', email);
        console.log('Role:', role);
        console.log('Mobile:', mobile);
        const existingUserByEmail = await this.userRepository.findOne({
            where: { email },
        });
        if (existingUserByEmail) {
            throw new common_1.BadRequestException('User with this email already exists');
        }
        if (mobile) {
            const existingUserByMobile = await this.userRepository.findOne({
                where: { mobile },
            });
            if (existingUserByMobile) {
                throw new common_1.BadRequestException('User with this mobile number already exists');
            }
        }
        const userData = {
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            email: createUserDto.email,
            mobile: createUserDto.mobile,
            password: password,
            role: createUserDto.role,
            status: user_entity_1.UserStatus.PENDING,
            dateOfBirth: createUserDto.dateOfBirth,
            address: createUserDto.address,
            city: createUserDto.city,
            state: createUserDto.state,
            country: createUserDto.country,
            postalCode: createUserDto.postalCode,
            adminPosition: createUserDto.adminPosition,
            yearsOfExperience: createUserDto.yearsOfExperience,
            educationLevel: createUserDto.educationLevel,
            certifications: createUserDto.certifications,
        };
        console.log('Creating user with data:', {
            ...userData,
            password: '***hidden***'
        });
        try {
            const user = this.userRepository.create(userData);
            const savedUser = await this.userRepository.save(user);
            console.log('✅ User created successfully, ID:', savedUser.id);
            let school = null;
            if (createUserDto.role === user_entity_1.UserRole.SCHOOL_ADMIN && createUserDto.schoolName) {
                try {
                    console.log('Creating school for user:', savedUser.id);
                    const schoolData = {
                        name: createUserDto.schoolName,
                        type: createUserDto.schoolType,
                        address: createUserDto.schoolAddress || '',
                        city: createUserDto.schoolCity || '',
                        state: createUserDto.schoolState || '',
                        country: createUserDto.schoolCountry || '',
                        postalCode: createUserDto.schoolPostalCode || '',
                        phone: createUserDto.schoolPhone,
                        email: createUserDto.schoolEmail,
                        website: createUserDto.schoolWebsite,
                        status: school_entity_1.SchoolStatus.PENDING,
                        isActive: 1,
                        userId: savedUser.id,
                    };
                    console.log('School data:', schoolData);
                    school = this.schoolRepository.create(schoolData);
                    await this.schoolRepository.save(school);
                    console.log('✅ School created successfully, ID:', school.id);
                }
                catch (error) {
                    console.error('❌ Failed to create school:', error.message);
                    console.error('School creation error details:', error);
                }
            }
            try {
                await this.sendWelcomeEmail(savedUser.email, savedUser.firstName);
            }
            catch (emailError) {
                console.error('Failed to send welcome email:', emailError.message);
            }
            const { password: _, ...result } = savedUser;
            console.log('✅ Registration completed successfully');
            return { user: result, school };
        }
        catch (error) {
            console.error('❌ User creation failed:', error.message);
            console.error('Full error:', error);
            throw error;
        }
    }
    async generateOtp(email) {
        const user = await this.userRepository.findOne({
            where: { email },
        });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await this.userRepository.update(user.id, {});
        await this.sendOtpEmail(email, otp);
        return otp;
    }
    async verifyOtp(email, otp) {
        return true;
    }
    async refreshToken(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        let schoolId;
        if (user.role === user_entity_1.UserRole.SCHOOL_ADMIN) {
            const school = await this.userRepository.manager
                .createQueryBuilder()
                .select('s.id')
                .from('schools', 's')
                .where('s.user_id = :userId', { userId: user.id })
                .getRawOne();
            schoolId = school?.id;
        }
        else if (user.role === user_entity_1.UserRole.TEACHER) {
            const result = await this.userRepository.manager
                .createQueryBuilder()
                .select('t.schoolId', 'schoolId')
                .from('teachers', 't')
                .where('t.userId = :userId', { userId: user.id })
                .getRawOne();
            schoolId = result?.schoolId || result?.t_schoolId;
        }
        else if (user.role === user_entity_1.UserRole.STUDENT) {
            const result = await this.userRepository.manager
                .createQueryBuilder()
                .select('s.schoolId', 'schoolId')
                .from('students', 's')
                .where('s.userId = :userId', { userId: user.id })
                .getRawOne();
            schoolId = result?.schoolId || result?.s_schoolId;
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            schoolId,
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async sendWelcomeEmail(email, firstName) {
        try {
            if (!this.mailerService) {
                console.log('⚠️ MailerService not configured. Skipping welcome email.');
                return;
            }
            console.log('📧 Attempting to send welcome email to:', email);
            await this.mailerService.sendMail({
                to: email,
                subject: 'Welcome to ChildClub Management System',
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4CAF50;">Welcome to ChildClub Management System!</h2>
            <p>Dear ${firstName},</p>
            <p>Welcome to ChildClub! Your account has been successfully created.</p>
            <p>You can now login using your credentials at: <a href="${process.env.FRONTEND_URL}/login">${process.env.FRONTEND_URL}/login</a></p>
            <p>Best regards,<br>ChildClub Team</p>
          </div>
        `,
            });
            console.log('✅ Welcome email sent successfully to:', email);
        }
        catch (error) {
            console.error('❌ Failed to send welcome email to:', email, error.message);
        }
    }
    async sendOtpEmail(email, otp) {
        try {
            if (!this.mailerService) {
                console.log('⚠️ MailerService not configured. Cannot send OTP email.');
                console.log('OTP for', email, ':', otp);
                return;
            }
            console.log('📧 Attempting to send OTP email to:', email);
            await this.mailerService.sendMail({
                to: email,
                subject: 'Your OTP for ChildClub',
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2196F3;">Your OTP Code</h2>
            <p>Your One-Time Password (OTP) for ChildClub is:</p>
            <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; color: #333; border-radius: 5px; margin: 20px 0;">
              ${otp}
            </div>
            <p>This OTP will expire in 10 minutes.</p>
            <p>If you didn't request this OTP, please ignore this email.</p>
            <p>Best regards,<br>ChildClub Team</p>
          </div>
        `,
            });
            console.log('✅ OTP email sent successfully to:', email);
        }
        catch (error) {
            console.error('❌ Failed to send OTP email to:', email, error.message);
            throw new Error('Failed to send OTP email. Please try again.');
        }
    }
    async updateProfile(userId, updateData) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (updateData.firstName !== undefined)
            user.firstName = updateData.firstName;
        if (updateData.lastName !== undefined)
            user.lastName = updateData.lastName;
        if (updateData.mobile !== undefined)
            user.mobile = updateData.mobile;
        if (updateData.address !== undefined)
            user.address = updateData.address;
        if (updateData.city !== undefined)
            user.city = updateData.city;
        if (updateData.state !== undefined)
            user.state = updateData.state;
        if (updateData.country !== undefined)
            user.country = updateData.country;
        if (updateData.postalCode !== undefined)
            user.postalCode = updateData.postalCode;
        await this.userRepository.save(user);
        const { password, ...result } = user;
        return result;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(school_entity_1.School)),
    __param(3, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        mailer_1.MailerService])
], AuthService);
//# sourceMappingURL=auth.service.js.map