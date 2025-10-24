import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { User, UserRole, UserStatus } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { School } from '../schools/entities/school.entity';
export declare class AuthService {
    private readonly userRepository;
    private readonly schoolRepository;
    private readonly jwtService;
    private readonly mailerService;
    constructor(userRepository: Repository<User>, schoolRepository: Repository<School>, jwtService: JwtService, mailerService: MailerService);
    validateUser(email: string, password: string): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
            status: any;
            schoolId: number;
        };
    }>;
    register(createUserDto: CreateUserDto): Promise<{
        user: {
            id: number;
            firstName: string;
            lastName: string;
            email: string;
            mobile: string;
            role: UserRole;
            status: UserStatus;
            profilePicture: string;
            city: string;
            state: string;
            country: string;
            postalCode: string;
            emailVerified: number;
            mobileVerified: number;
            lastLoginAt: Date;
            lastLoginIp: string;
            dateOfBirth: Date;
            address: string;
            adminPosition: string;
            yearsOfExperience: string;
            educationLevel: string;
            certifications: string;
            createdAt: Date;
            updatedAt: Date;
        };
        school: any;
    }>;
    generateOtp(email: string): Promise<string>;
    verifyOtp(email: string, otp: string): Promise<boolean>;
    refreshToken(userId: number): Promise<{
        access_token: string;
    }>;
    private sendWelcomeEmail;
    private sendOtpEmail;
    updateProfile(userId: number, updateData: {
        firstName?: string;
        lastName?: string;
        mobile?: string;
        address?: string;
        city?: string;
        state?: string;
        country?: string;
        postalCode?: string;
    }): Promise<{
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        mobile: string;
        role: UserRole;
        status: UserStatus;
        profilePicture: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
        emailVerified: number;
        mobileVerified: number;
        lastLoginAt: Date;
        lastLoginIp: string;
        dateOfBirth: Date;
        address: string;
        adminPosition: string;
        yearsOfExperience: string;
        educationLevel: string;
        certifications: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
