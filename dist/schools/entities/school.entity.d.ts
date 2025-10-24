import { User } from '../../users/entities/user.entity';
export declare enum SchoolType {
    PRIMARY = "primary",
    SECONDARY = "secondary",
    HIGHER_SECONDARY = "higher_secondary",
    INTERNATIONAL = "international",
    SPECIAL_NEEDS = "special_needs"
}
export declare enum SchoolStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    SUSPENDED = "suspended"
}
export declare class School {
    id: number;
    name: string;
    description: string;
    type: SchoolType;
    status: SchoolStatus;
    logo: string;
    banner: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    phone: string;
    website: string;
    email: string;
    establishedYear: number;
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
    facilities: string;
    achievements: string;
    vision: string;
    mission: string;
    isActive: number;
    approvedAt: Date;
    approvedBy: number;
    rejectionReason: string;
    userId: number;
    address: string;
    workingHours: any;
    holidays: any;
    createdAt: Date;
    updatedAt: Date;
    user: User;
}
