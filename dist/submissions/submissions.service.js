"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const submission_entity_1 = require("./entities/submission.entity");
const assignment_entity_1 = require("../assignments/entities/assignment.entity");
const user_entity_1 = require("../users/entities/user.entity");
let SubmissionsService = class SubmissionsService {
    constructor(submissionsRepository, assignmentsRepository, usersRepository) {
        this.submissionsRepository = submissionsRepository;
        this.assignmentsRepository = assignmentsRepository;
        this.usersRepository = usersRepository;
    }
    async createSubmission(createSubmissionDto) {
        console.log('[Submissions Service] Creating submission:', createSubmissionDto);
        const assignment = await this.assignmentsRepository.findOne({
            where: { id: createSubmissionDto.taskId }
        });
        console.log('[Submissions Service] Assignment found:', assignment ? `ID: ${assignment.id}, Title: ${assignment.title}` : 'NULL');
        if (!assignment) {
            throw new common_1.NotFoundException(`Assignment with ID ${createSubmissionDto.taskId} not found`);
        }
        const student = await this.usersRepository.findOne({
            where: { id: createSubmissionDto.studentId }
        });
        console.log('[Submissions Service] Student found:', student ? `ID: ${student.id}, Name: ${student.firstName} ${student.lastName}` : 'NULL');
        if (!student) {
            throw new common_1.NotFoundException(`Student with ID ${createSubmissionDto.studentId} not found`);
        }
        const existingSubmission = await this.submissionsRepository.findOne({
            where: {
                taskId: createSubmissionDto.taskId,
                studentId: createSubmissionDto.studentId,
            },
        });
        const isLate = assignment.dueDate && new Date() > new Date(assignment.dueDate) ? 1 : 0;
        if (existingSubmission) {
            existingSubmission.content = createSubmissionDto.content;
            existingSubmission.attachments = createSubmissionDto.attachments;
            existingSubmission.lateReason = createSubmissionDto.lateReason;
            existingSubmission.status = createSubmissionDto.status || submission_entity_1.SubmissionStatus.SUBMITTED;
            existingSubmission.submittedAt = new Date();
            existingSubmission.attempts += 1;
            existingSubmission.isLate = isLate;
            return this.submissionsRepository.save(existingSubmission);
        }
        const submission = this.submissionsRepository.create({
            taskId: createSubmissionDto.taskId,
            studentId: createSubmissionDto.studentId,
            content: createSubmissionDto.content,
            attachments: createSubmissionDto.attachments || [],
            status: createSubmissionDto.status || submission_entity_1.SubmissionStatus.SUBMITTED,
            submittedAt: new Date(),
            attempts: 1,
            isLate,
            lateReason: createSubmissionDto.lateReason,
        });
        console.log('[Submissions Service] Saving submission:', submission);
        try {
            const savedSubmission = await this.submissionsRepository.save(submission);
            console.log('[Submissions Service] Submission saved successfully:', savedSubmission.id);
            return savedSubmission;
        }
        catch (error) {
            console.error('[Submissions Service] Error saving submission:', error);
            throw new common_1.BadRequestException(`Failed to save submission: ${error.message}`);
        }
    }
    async findSubmissionsByTask(taskId) {
        return this.submissionsRepository.find({
            where: { taskId },
            relations: ['student', 'reviewer'],
            order: { submittedAt: 'DESC' },
        });
    }
    async findSubmissionsByStudent(studentId) {
        return this.submissionsRepository.find({
            where: { studentId },
            relations: ['task', 'student'],
            order: { submittedAt: 'DESC' },
        });
    }
    async findSubmissionsByClass(classId) {
        const students = await this.usersRepository
            .createQueryBuilder('user')
            .leftJoin('students', 'student', 'student.userId = user.id')
            .where('student.currentClassId = :classId', { classId })
            .select(['user.id'])
            .getRawMany();
        const studentIds = students.map(s => s.user_id);
        if (studentIds.length === 0) {
            return [];
        }
        return this.submissionsRepository
            .createQueryBuilder('submission')
            .leftJoinAndSelect('submission.student', 'student')
            .leftJoinAndSelect('submission.task', 'task')
            .where('submission.studentId IN (:...studentIds)', { studentIds })
            .orderBy('submission.submittedAt', 'DESC')
            .getMany();
    }
    async findSubmissionsBySchool(schoolId) {
        const students = await this.usersRepository
            .createQueryBuilder('user')
            .leftJoin('students', 'student', 'student.userId = user.id')
            .leftJoin('classes', 'class', 'class.id = student.currentClassId')
            .where('student.schoolId = :schoolId', { schoolId })
            .select(['user.id', 'user.firstName', 'user.lastName', 'user.email', 'class.name as className'])
            .getRawMany();
        const studentIds = students.map(s => s.user_id);
        if (studentIds.length === 0) {
            return [];
        }
        const submissions = await this.submissionsRepository
            .createQueryBuilder('submission')
            .leftJoinAndSelect('submission.student', 'student')
            .leftJoinAndSelect('submission.task', 'task')
            .where('submission.studentId IN (:...studentIds)', { studentIds })
            .orderBy('submission.submittedAt', 'DESC')
            .getMany();
        return submissions.map(submission => {
            const studentInfo = students.find(s => s.user_id === submission.studentId);
            if (studentInfo && submission.student) {
                submission.student.className = studentInfo.className;
            }
            return submission;
        });
    }
    async findSubmissionById(id) {
        const submission = await this.submissionsRepository.findOne({
            where: { id },
            relations: ['task', 'student', 'reviewer'],
        });
        if (!submission) {
            throw new common_1.NotFoundException('Submission not found');
        }
        return submission;
    }
    async updateSubmission(id, updateSubmissionDto) {
        const submission = await this.findSubmissionById(id);
        Object.assign(submission, updateSubmissionDto);
        if (updateSubmissionDto.status === submission_entity_1.SubmissionStatus.SUBMITTED) {
            submission.submittedAt = new Date();
        }
        return this.submissionsRepository.save(submission);
    }
    async reviewSubmission(id, reviewSubmissionDto, reviewerId) {
        const submission = await this.findSubmissionById(id);
        submission.status = reviewSubmissionDto.status;
        submission.grade = reviewSubmissionDto.grade;
        submission.feedback = reviewSubmissionDto.feedback;
        submission.teacherNotes = reviewSubmissionDto.teacherNotes;
        submission.reviewedById = reviewerId;
        submission.reviewedAt = new Date();
        return this.submissionsRepository.save(submission);
    }
    async findSubmissionsByTeacher(teacherId) {
        console.log('[Submissions Service] Finding submissions for teacher userId:', teacherId);
        console.log('[Submissions Service] Query will be: assignment.createdBy = ', teacherId);
        const assignments = await this.assignmentsRepository
            .createQueryBuilder('assignment')
            .where('assignment.createdBy = :teacherId', { teacherId })
            .getMany();
        console.log('[Submissions Service] Found', assignments.length, 'assignments by teacher');
        if (assignments.length > 0) {
            console.log('[Submissions Service] Assignment IDs:', assignments.map(a => a.id));
            console.log('[Submissions Service] Assignment Titles:', assignments.map(a => a.title));
        }
        if (assignments.length === 0) {
            console.log('[Submissions Service] No assignments found - returning empty array');
            return [];
        }
        const assignmentIds = assignments.map(a => a.id);
        console.log('[Submissions Service] Looking for submissions with taskId IN:', assignmentIds);
        const submissions = await this.submissionsRepository
            .createQueryBuilder('submission')
            .leftJoinAndSelect('submission.student', 'student')
            .leftJoinAndSelect('submission.task', 'task')
            .where('submission.taskId IN (:...assignmentIds)', { assignmentIds })
            .orderBy('submission.submittedAt', 'DESC')
            .getMany();
        console.log('[Submissions Service] Found', submissions.length, 'submissions');
        if (submissions.length > 0) {
            console.log('[Submissions Service] Sample submission:', {
                id: submissions[0].id,
                taskId: submissions[0].taskId,
                studentId: submissions[0].studentId,
                status: submissions[0].status
            });
        }
        return submissions;
    }
    async deleteSubmission(id) {
        const submission = await this.findSubmissionById(id);
        await this.submissionsRepository.remove(submission);
    }
    async getSubmissionStats(classId) {
        const submissions = await this.submissionsRepository
            .createQueryBuilder('submission')
            .leftJoin('submission.task', 'task')
            .where('task.classId = :classId', { classId })
            .getMany();
        const result = {
            total: submissions.length,
            submitted: 0,
            reviewed: 0,
            approved: 0,
            pending: 0,
        };
        submissions.forEach((submission) => {
            if (submission.status === submission_entity_1.SubmissionStatus.SUBMITTED) {
                result.submitted++;
                result.pending++;
            }
            else if (submission.status === submission_entity_1.SubmissionStatus.REVIEWED) {
                result.reviewed++;
            }
            else if (submission.status === submission_entity_1.SubmissionStatus.APPROVED) {
                result.approved++;
            }
        });
        return result;
    }
};
exports.SubmissionsService = SubmissionsService;
exports.SubmissionsService = SubmissionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(submission_entity_1.Submission)),
    __param(1, (0, typeorm_1.InjectRepository)(assignment_entity_1.Assignment)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SubmissionsService);
//# sourceMappingURL=submissions.service.js.map