import { SubjectStatus } from '../entities/subject.entity';
export declare class UpdateSubjectDto {
    name?: string;
    code?: string;
    description?: string;
    gradeLevel?: string;
    totalMarks?: number;
    passingMarks?: number;
    isElective?: boolean;
    color?: string;
    icon?: string;
    status?: SubjectStatus;
}
