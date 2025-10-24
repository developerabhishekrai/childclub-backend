import { User } from '../../users/entities/user.entity';
import { School } from '../../schools/entities/school.entity';
import { Class } from '../../classes/entities/class.entity';
export declare enum StudentStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    GRADUATED = "graduated",
    TRANSFERRED = "transferred",
    SUSPENDED = "suspended"
}
export declare enum Gender {
    MALE = "male",
    FEMALE = "female",
    OTHER = "other"
}
export declare enum BloodGroup {
    A_POSITIVE = "A+",
    A_NEGATIVE = "A-",
    B_POSITIVE = "B+",
    B_NEGATIVE = "B-",
    AB_POSITIVE = "AB+",
    AB_NEGATIVE = "AB-",
    O_POSITIVE = "O+",
    O_NEGATIVE = "O-"
}
export declare class Student {
    id: number;
    userId: number;
    schoolId: number;
    studentId: string;
    rollNumber: string;
    admissionNumber: string;
    enrollNumber: string;
    dateOfBirth: Date;
    gender: Gender;
    bloodGroup: BloodGroup;
    parentName: string;
    parentPhone: string;
    parentEmail: string;
    emergencyContact: string;
    enrollmentDate: Date;
    currentClassId: number;
    previousSchool: string;
    academicYear: string;
    status: StudentStatus;
    isActive: number;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    school: School;
    currentClass: Class;
}
