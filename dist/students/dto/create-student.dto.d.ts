import { Gender, BloodGroup } from '../entities/student.entity';
export declare class CreateStudentDto {
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
    schoolId: number;
    classId?: number;
    gender?: Gender;
    bloodGroup?: BloodGroup;
    parentName?: string;
    parentPhone?: string;
    parentEmail?: string;
    emergencyContact?: string;
    previousSchool?: string;
    enrollNumber: string;
}
