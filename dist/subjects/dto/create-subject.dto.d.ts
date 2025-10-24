import { SubjectStatus } from '../entities/subject.entity';
export declare class CreateSubjectDto {
    name: string;
    code: string;
    description?: string;
    schoolId?: string;
    gradeLevel?: string;
    totalMarks?: number;
    passingMarks?: number;
    isElective?: boolean;
    color?: string;
    icon?: string;
    status?: SubjectStatus;
}
