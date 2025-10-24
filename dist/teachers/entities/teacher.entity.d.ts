import { User } from '../../users/entities/user.entity';
import { School } from '../../schools/entities/school.entity';
export declare enum TeacherStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    RESIGNED = "resigned",
    RETIRED = "retired",
    SUSPENDED = "suspended"
}
export declare class Teacher {
    id: number;
    userId: number;
    schoolId: number;
    classId: number;
    employeeId: string;
    qualification: string;
    specialization: string;
    experienceYears: number;
    joiningDate: Date;
    salary: number;
    department: string;
    designation: string;
    emergencyContact: string;
    status: TeacherStatus;
    subjects: string[];
    isActive: number;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    school: School;
}
