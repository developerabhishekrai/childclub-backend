import { TeacherStatus } from '../entities/teacher.entity';
export declare class UpdateTeacherDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    mobile?: string;
    dateOfBirth?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    qualification?: string;
    specialization?: string;
    experienceYears?: string;
    department?: string;
    designation?: string;
    emergencyContact?: string;
    subjects?: string[];
    classId?: string | null;
    classIds?: number[];
    joiningDate?: string;
    salary?: string | number;
    status?: TeacherStatus;
}
