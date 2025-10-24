import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject, SubjectStatus } from './entities/subject.entity';
import { School } from '../schools/entities/school.entity';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private subjectsRepository: Repository<Subject>,
    @InjectRepository(School)
    private schoolsRepository: Repository<School>,
  ) {}

  async createSubject(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    // Check if school exists
    const school = await this.schoolsRepository.findOne({ 
      where: { id: parseInt(createSubjectDto.schoolId) } 
    });
    
    if (!school) {
      throw new NotFoundException('School not found');
    }

    // Check if subject code already exists in the school
    const existingSubject = await this.subjectsRepository.findOne({
      where: {
        code: createSubjectDto.code,
        schoolId: parseInt(createSubjectDto.schoolId),
        isActive: 1
      },
    });

    if (existingSubject) {
      throw new BadRequestException('Subject code already exists in this school');
    }

    const subject = this.subjectsRepository.create({
      name: createSubjectDto.name,
      code: createSubjectDto.code,
      description: createSubjectDto.description,
      schoolId: parseInt(createSubjectDto.schoolId),
      gradeLevel: createSubjectDto.gradeLevel,
      totalMarks: createSubjectDto.totalMarks,
      passingMarks: createSubjectDto.passingMarks,
      isElective: createSubjectDto.isElective ? 1 : 0,
      color: createSubjectDto.color || '#3B82F6',
      icon: createSubjectDto.icon || '📚',
      status: createSubjectDto.status || SubjectStatus.ACTIVE,
      isActive: 1,
    });

    return this.subjectsRepository.save(subject);
  }

  async findAllSubjects(schoolId: number): Promise<Subject[]> {
    return this.subjectsRepository.find({
      where: { schoolId, isActive: 1 },
      order: { name: 'ASC' },
    });
  }

  async findSubjectById(id: number): Promise<Subject> {
    const subject = await this.subjectsRepository.findOne({
      where: { id, isActive: 1 }
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    return subject;
  }

  async findSubjectsByGrade(schoolId: number, gradeLevel: string): Promise<Subject[]> {
    return this.subjectsRepository.find({
      where: { schoolId, gradeLevel, isActive: 1 },
      order: { name: 'ASC' },
    });
  }

  async updateSubject(id: number, updateSubjectDto: UpdateSubjectDto): Promise<Subject> {
    const subject = await this.findSubjectById(id);

    // If code is being updated, check if it already exists
    if (updateSubjectDto.code && updateSubjectDto.code !== subject.code) {
      const existingSubject = await this.subjectsRepository.findOne({
        where: {
          code: updateSubjectDto.code,
          schoolId: subject.schoolId,
          isActive: 1
        },
      });

      if (existingSubject && existingSubject.id !== id) {
        throw new BadRequestException('Subject code already exists in this school');
      }
    }

    Object.assign(subject, updateSubjectDto);
    
    if (updateSubjectDto.isElective !== undefined) {
      subject.isElective = updateSubjectDto.isElective ? 1 : 0;
    }

    return this.subjectsRepository.save(subject);
  }

  async deleteSubject(id: number): Promise<void> {
    const subject = await this.findSubjectById(id);
    
    // Soft delete
    subject.isActive = 0;
    await this.subjectsRepository.save(subject);
  }

  async getSubjectStats(schoolId: number): Promise<{
    total: number;
    active: number;
    inactive: number;
    elective: number;
    core: number;
  }> {
    const subjects = await this.subjectsRepository.find({
      where: { schoolId, isActive: 1 }
    });

    const result = {
      total: subjects.length,
      active: 0,
      inactive: 0,
      elective: 0,
      core: 0,
    };

    subjects.forEach((subject) => {
      if (subject.status === SubjectStatus.ACTIVE) {
        result.active++;
      } else {
        result.inactive++;
      }

      if (subject.isElective) {
        result.elective++;
      } else {
        result.core++;
      }
    });

    return result;
  }
}

