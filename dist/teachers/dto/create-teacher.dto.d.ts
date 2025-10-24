import { TeacherStatus } from '../entities/teacher.entity';
export declare class CreateTeacherDto {
    firstName: string;
    lastName: string;
    email: string;
    mobile?: string;
    password: string;
    dateOfBirth?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    qualification: string;
    experience: string;
    subjects?: string[];
    classId?: string;
    classIds?: number[];
    joiningDate?: string;
    salary?: string;
    schoolId: number;
    status?: TeacherStatus;
}
