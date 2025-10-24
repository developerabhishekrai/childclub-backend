import { User } from '../../users/entities/user.entity';
import { School } from '../../schools/entities/school.entity';
export declare enum ClassStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    COMPLETED = "completed"
}
export declare class Class {
    id: number;
    name: string;
    grade: string;
    section: string;
    description: string;
    status: ClassStatus;
    academicYear: string;
    startDate: Date;
    endDate: Date;
    maxStudents: number;
    currentStudents: number;
    syllabus: string;
    rules: string;
    isActive: number;
    schoolId: number;
    classTeacherId: number;
    schedule: any;
    subjects: any;
    createdAt: Date;
    updatedAt: Date;
    school: School;
    classTeacher: User;
}
