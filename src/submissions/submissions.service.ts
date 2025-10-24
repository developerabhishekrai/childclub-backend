import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission, SubmissionStatus } from './entities/submission.entity';
import { Assignment } from '../assignments/entities/assignment.entity';
import { User } from '../users/entities/user.entity';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private submissionsRepository: Repository<Submission>,
    @InjectRepository(Assignment)
    private assignmentsRepository: Repository<Assignment>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createSubmission(createSubmissionDto: CreateSubmissionDto): Promise<Submission> {
    console.log('[Submissions Service] Creating submission:', createSubmissionDto);
    
    // Check if assignment exists
    const assignment = await this.assignmentsRepository.findOne({ 
      where: { id: createSubmissionDto.taskId } 
    });
    
    console.log('[Submissions Service] Assignment found:', assignment ? `ID: ${assignment.id}, Title: ${assignment.title}` : 'NULL');
    
    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${createSubmissionDto.taskId} not found`);
    }

    // Check if student exists
    const student = await this.usersRepository.findOne({ 
      where: { id: createSubmissionDto.studentId } 
    });
    
    console.log('[Submissions Service] Student found:', student ? `ID: ${student.id}, Name: ${student.firstName} ${student.lastName}` : 'NULL');
    
    if (!student) {
      throw new NotFoundException(`Student with ID ${createSubmissionDto.studentId} not found`);
    }

    // Check if submission already exists
    const existingSubmission = await this.submissionsRepository.findOne({
      where: {
        taskId: createSubmissionDto.taskId,
        studentId: createSubmissionDto.studentId,
      },
    });

    // Check if submission is late
    const isLate = assignment.dueDate && new Date() > new Date(assignment.dueDate) ? 1 : 0;

    if (existingSubmission) {
      // Update existing submission (resubmission)
      existingSubmission.content = createSubmissionDto.content;
      existingSubmission.attachments = createSubmissionDto.attachments;
      existingSubmission.lateReason = createSubmissionDto.lateReason;
      existingSubmission.status = createSubmissionDto.status || SubmissionStatus.SUBMITTED;
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
      status: createSubmissionDto.status || SubmissionStatus.SUBMITTED,
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
    } catch (error) {
      console.error('[Submissions Service] Error saving submission:', error);
      throw new BadRequestException(`Failed to save submission: ${error.message}`);
    }
  }

  async findSubmissionsByTask(taskId: number): Promise<Submission[]> {
    return this.submissionsRepository.find({
      where: { taskId },
      relations: ['student', 'reviewer'],
      order: { submittedAt: 'DESC' },
    });
  }

  async findSubmissionsByStudent(studentId: number): Promise<Submission[]> {
    return this.submissionsRepository.find({
      where: { studentId },
      relations: ['task', 'student'],
      order: { submittedAt: 'DESC' },
    });
  }

  async findSubmissionsByClass(classId: number): Promise<Submission[]> {
    // Get all students in this class
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

  async findSubmissionsBySchool(schoolId: number): Promise<Submission[]> {
    // Get all students in this school
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

    // Add class name to each submission's student
    return submissions.map(submission => {
      const studentInfo = students.find(s => s.user_id === submission.studentId);
      if (studentInfo && submission.student) {
        (submission.student as any).className = studentInfo.className;
      }
      return submission;
    });
  }

  async findSubmissionById(id: number): Promise<Submission> {
    const submission = await this.submissionsRepository.findOne({
      where: { id },
      relations: ['task', 'student', 'reviewer'],
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    return submission;
  }

  async updateSubmission(id: number, updateSubmissionDto: UpdateSubmissionDto): Promise<Submission> {
    const submission = await this.findSubmissionById(id);

    Object.assign(submission, updateSubmissionDto);

    if (updateSubmissionDto.status === SubmissionStatus.SUBMITTED) {
      submission.submittedAt = new Date();
    }

    return this.submissionsRepository.save(submission);
  }

  async reviewSubmission(id: number, reviewSubmissionDto: ReviewSubmissionDto, reviewerId: number): Promise<Submission> {
    const submission = await this.findSubmissionById(id);

    submission.status = reviewSubmissionDto.status;
    submission.grade = reviewSubmissionDto.grade;
    submission.feedback = reviewSubmissionDto.feedback;
    submission.teacherNotes = reviewSubmissionDto.teacherNotes;
    submission.reviewedById = reviewerId;
    submission.reviewedAt = new Date();

    return this.submissionsRepository.save(submission);
  }

  async findSubmissionsByTeacher(teacherId: number): Promise<Submission[]> {
    console.log('[Submissions Service] Finding submissions for teacher userId:', teacherId);
    console.log('[Submissions Service] Query will be: assignment.createdBy = ', teacherId);
    
    // Find all assignments created by this teacher
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

    // Get all submissions for these assignments
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

  async deleteSubmission(id: number): Promise<void> {
    const submission = await this.findSubmissionById(id);
    await this.submissionsRepository.remove(submission);
  }

  async getSubmissionStats(classId: number): Promise<{
    total: number;
    submitted: number;
    reviewed: number;
    approved: number;
    pending: number;
  }> {
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
      if (submission.status === SubmissionStatus.SUBMITTED) {
        result.submitted++;
        result.pending++;
      } else if (submission.status === SubmissionStatus.REVIEWED) {
        result.reviewed++;
      } else if (submission.status === SubmissionStatus.APPROVED) {
        result.approved++;
      }
    });

    return result;
  }
}

