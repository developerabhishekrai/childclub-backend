import { School } from '../../schools/entities/school.entity';
export declare enum SubjectStatus {
    ACTIVE = "active",
    INACTIVE = "inactive"
}
export declare class Subject {
    id: number;
    name: string;
    code: string;
    description: string;
    status: SubjectStatus;
    schoolId: number;
    gradeLevel: string;
    totalMarks: number;
    passingMarks: number;
    isElective: number;
    color: string;
    icon: string;
    isActive: number;
    createdAt: Date;
    updatedAt: Date;
    school: School;
}
