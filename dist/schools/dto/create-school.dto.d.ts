import { SchoolType } from '../entities/school.entity';
export declare class CreateSchoolDto {
    name: string;
    description?: string;
    type: SchoolType;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    phone?: string;
    email?: string;
    website?: string;
    establishedYear?: number;
    totalStudents?: number;
    totalTeachers?: number;
    totalClasses?: number;
    facilities?: string;
    vision?: string;
    mission?: string;
}
