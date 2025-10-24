import { StudentStatus, Gender } from '../entities/student.entity';
export declare class UpdateStudentDto {
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
    classId?: string;
    status?: StudentStatus;
    gender?: Gender;
    parentName?: string;
    parentPhone?: string;
    parentEmail?: string;
    emergencyContact?: string;
    previousSchool?: string;
    enrollNumber?: string;
}
