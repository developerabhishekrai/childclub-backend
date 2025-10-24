import { SubmissionStatus } from '../entities/submission.entity';
export declare class ReviewSubmissionDto {
    status: SubmissionStatus;
    grade?: number;
    feedback?: string;
    teacherNotes?: string;
}
