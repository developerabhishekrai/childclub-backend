import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
            role: import("../users/entities/user-role.enum").UserRole;
            status: import("../users/entities/user-status.enum").UserStatus;
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
    generateOtp(body: {
        email: string;
    }): Promise<string>;
    verifyOtp(body: {
        email: string;
        otp: string;
    }): Promise<boolean>;
    getProfile(req: any): any;
    refreshToken(req: any): Promise<{
        access_token: string;
    }>;
    updateProfile(req: any, updateData: {
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
        role: import("../users/entities/user-role.enum").UserRole;
        status: import("../users/entities/user-status.enum").UserStatus;
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
