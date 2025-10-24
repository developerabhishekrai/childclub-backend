import { SchoolType } from '../entities/school.entity';
export declare class UpdateSchoolDto {
    name?: string;
    description?: string;
    type?: SchoolType;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    phone?: string;
    website?: string;
    email?: string;
    establishedYear?: number;
    totalStudents?: number;
    totalTeachers?: number;
    totalClasses?: number;
    facilities?: string;
    achievements?: string;
    vision?: string;
    mission?: string;
}
