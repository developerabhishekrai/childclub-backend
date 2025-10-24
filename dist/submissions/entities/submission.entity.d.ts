import { User } from '../../users/entities/user.entity';
import { Assignment } from '../../assignments/entities/assignment.entity';
export declare enum SubmissionStatus {
    DRAFT = "draft",
    SUBMITTED = "submitted",
    REVIEWED = "reviewed",
    APPROVED = "approved",
    REJECTED = "rejected",
    RESUBMIT = "resubmit"
}
export declare class Submission {
    id: number;
    taskId: number;
    studentId: number;
    status: SubmissionStatus;
    content: string;
    attachments: any;
    submittedAt: Date;
    reviewedAt: Date;
    reviewedById: number;
    grade: number;
    feedback: string;
    teacherNotes: string;
    attempts: number;
    isLate: number;
    lateReason: string;
    createdAt: Date;
    updatedAt: Date;
    task: Assignment;
    student: User;
    reviewer: User;
}
