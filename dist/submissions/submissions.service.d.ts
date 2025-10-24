import { Repository } from 'typeorm';
import { Submission } from './entities/submission.entity';
import { Assignment } from '../assignments/entities/assignment.entity';
import { User } from '../users/entities/user.entity';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';
export declare class SubmissionsService {
    private submissionsRepository;
    private assignmentsRepository;
    private usersRepository;
    constructor(submissionsRepository: Repository<Submission>, assignmentsRepository: Repository<Assignment>, usersRepository: Repository<User>);
    createSubmission(createSubmissionDto: CreateSubmissionDto): Promise<Submission>;
    findSubmissionsByTask(taskId: number): Promise<Submission[]>;
    findSubmissionsByStudent(studentId: number): Promise<Submission[]>;
    findSubmissionsByClass(classId: number): Promise<Submission[]>;
    findSubmissionsBySchool(schoolId: number): Promise<Submission[]>;
    findSubmissionById(id: number): Promise<Submission>;
    updateSubmission(id: number, updateSubmissionDto: UpdateSubmissionDto): Promise<Submission>;
    reviewSubmission(id: number, reviewSubmissionDto: ReviewSubmissionDto, reviewerId: number): Promise<Submission>;
    findSubmissionsByTeacher(teacherId: number): Promise<Submission[]>;
    deleteSubmission(id: number): Promise<void>;
    getSubmissionStats(classId: number): Promise<{
        total: number;
        submitted: number;
        reviewed: number;
        approved: number;
        pending: number;
    }>;
}
