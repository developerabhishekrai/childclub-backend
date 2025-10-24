import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';
export declare class SubmissionsController {
    private readonly submissionsService;
    constructor(submissionsService: SubmissionsService);
    createSubmission(createSubmissionDto: CreateSubmissionDto, req: any): Promise<import("./entities/submission.entity").Submission>;
    findMySubmissions(req: any): Promise<import("./entities/submission.entity").Submission[]>;
    findSubmissionsByTask(taskId: string): Promise<import("./entities/submission.entity").Submission[]>;
    findSubmissionsByStudent(studentId: string): Promise<import("./entities/submission.entity").Submission[]>;
    findSubmissionsByClass(classId: string): Promise<import("./entities/submission.entity").Submission[]>;
    findSubmissionsBySchool(schoolId: string): Promise<import("./entities/submission.entity").Submission[]>;
    getSubmissionStats(classId: string): Promise<{
        total: number;
        submitted: number;
        reviewed: number;
        approved: number;
        pending: number;
    }>;
    findSubmissionById(id: string): Promise<import("./entities/submission.entity").Submission>;
    updateSubmission(id: string, updateSubmissionDto: UpdateSubmissionDto): Promise<import("./entities/submission.entity").Submission>;
    reviewSubmission(id: string, reviewSubmissionDto: ReviewSubmissionDto, req: any): Promise<import("./entities/submission.entity").Submission>;
    deleteSubmission(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
