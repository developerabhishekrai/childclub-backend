import { SubmissionStatus } from '../entities/submission.entity';
export declare class UpdateSubmissionDto {
    content?: string;
    attachments?: any[];
    status?: SubmissionStatus;
    lateReason?: string;
}
