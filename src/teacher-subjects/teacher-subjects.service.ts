import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeacherSubject } from './entities/teacher-subject.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Subject } from '../subjects/entities/subject.entity';
import { Class } from '../classes/entities/class.entity';
import { AssignTeacherSubjectDto } from './dto/assign-teacher-subject.dto';

@Injectable()
export class TeacherSubjectsService {
  constructor(
    @InjectRepository(TeacherSubject)
    private teacherSubjectsRepository: Repository<TeacherSubject>,
    @InjectRepository(Teacher)
    private teachersRepository: Repository<Teacher>,
    @InjectRepository(Subject)
    private subjectsRepository: Repository<Subject>,
    @InjectRepository(Class)
    private classesRepository: Repository<Class>,
  ) {}

  async assignSubjectsToTeacher(assignTeacherSubjectDto: AssignTeacherSubjectDto): Promise<TeacherSubject[]> {
    // Check if teacher exists
    const teacher = await this.teachersRepository.findOne({ 
      where: { id: assignTeacherSubjectDto.teacherId } 
    });
    
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    const assignedSubjects: TeacherSubject[] = [];

    for (const subjectAssignment of assignTeacherSubjectDto.subjects) {
      // Check if subject exists
      const subject = await this.subjectsRepository.findOne({ 
        where: { id: subjectAssignment.subjectId } 
      });
      
      if (!subject) {
        console.warn(`Subject with id ${subjectAssignment.subjectId} not found, skipping...`);
        continue;
      }

      // Check if class exists (if provided)
      if (subjectAssignment.classId) {
        const classEntity = await this.classesRepository.findOne({ 
          where: { id: subjectAssignment.classId } 
        });
        
        if (!classEntity) {
          console.warn(`Class with id ${subjectAssignment.classId} not found, skipping...`);
          continue;
        }
      }

      // Check if assignment already exists
      const existingAssignment = await this.teacherSubjectsRepository.findOne({
        where: {
          teacherId: assignTeacherSubjectDto.teacherId,
          subjectId: subjectAssignment.subjectId,
          classId: subjectAssignment.classId || null,
        },
      });

      if (existingAssignment) {
        // Reactivate if exists
        existingAssignment.isActive = 1;
        assignedSubjects.push(await this.teacherSubjectsRepository.save(existingAssignment));
      } else {
        // Create new assignment
        const teacherSubject = this.teacherSubjectsRepository.create({
          teacherId: assignTeacherSubjectDto.teacherId,
          subjectId: subjectAssignment.subjectId,
          classId: subjectAssignment.classId || null,
          isActive: 1,
        });

        assignedSubjects.push(await this.teacherSubjectsRepository.save(teacherSubject));
      }
    }

    return assignedSubjects;
  }

  async getTeacherSubjects(teacherId: number): Promise<TeacherSubject[]> {
    return this.teacherSubjectsRepository.find({
      where: { teacherId, isActive: 1 },
      relations: ['subject', 'class'],
      order: { createdAt: 'DESC' },
    });
  }

  async getSubjectTeachers(subjectId: number): Promise<TeacherSubject[]> {
    return this.teacherSubjectsRepository.find({
      where: { subjectId, isActive: 1 },
      relations: ['teacher', 'class'],
      order: { createdAt: 'DESC' },
    });
  }

  async getClassTeachers(classId: number): Promise<TeacherSubject[]> {
    return this.teacherSubjectsRepository.find({
      where: { classId, isActive: 1 },
      relations: ['teacher', 'subject'],
      order: { createdAt: 'DESC' },
    });
  }

  async removeTeacherSubject(teacherId: number, subjectId: number, classId?: number): Promise<void> {
    const whereClause: any = {
      teacherId,
      subjectId,
    };

    if (classId) {
      whereClause.classId = classId;
    }

    const assignment = await this.teacherSubjectsRepository.findOne({
      where: whereClause,
    });

    if (!assignment) {
      throw new NotFoundException('Teacher-Subject assignment not found');
    }

    // Soft delete
    assignment.isActive = 0;
    await this.teacherSubjectsRepository.save(assignment);
  }

  async removeAllTeacherSubjects(teacherId: number): Promise<void> {
    await this.teacherSubjectsRepository.update(
      { teacherId },
      { isActive: 0 }
    );
  }
}

