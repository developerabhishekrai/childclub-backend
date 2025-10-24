import { SubmissionStatus } from '../entities/submission.entity';
export declare class CreateSubmissionDto {
    taskId: number;
    studentId: number;
    content?: string;
    attachments?: any[];
    status?: SubmissionStatus;
    lateReason?: string;
}
