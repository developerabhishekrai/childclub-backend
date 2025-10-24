import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class, ClassStatus } from './entities/class.entity';
import { School } from '../schools/entities/school.entity';
import { User, UserRole } from '../users/entities/user.entity';

export interface CreateClassDto {
  name: string;
  grade: string;
  section?: string;
  description?: string;
  academicYear?: string;
  startDate?: Date;
  endDate?: Date;
  maxStudents?: number;
  subjects?: object;
  syllabus?: string;
  rules?: string;
  schoolId: string;
  classTeacherId?: string;
}

export interface UpdateClassDto {
  name?: string;
  grade?: string;
  section?: string;
  description?: string;
  academicYear?: string;
  startDate?: Date;
  endDate?: Date;
  maxStudents?: number;
  subjects?: object;
  syllabus?: string;
  rules?: string;
  status?: ClassStatus;
  classTeacherId?: string;
}

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private classesRepository: Repository<Class>,
    @InjectRepository(School)
    private schoolsRepository: Repository<School>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createClass(createClassDto: CreateClassDto, createdBy: number): Promise<Class> {
    // Check if school exists
    const school = await this.schoolsRepository.findOne({ where: { id: parseInt(createClassDto.schoolId) } });
    if (!school) {
      throw new NotFoundException('School not found');
    }

    // Check if class teacher exists if provided
    if (createClassDto.classTeacherId) {
      const teacher = await this.usersRepository.findOne({ 
        where: { id: parseInt(createClassDto.classTeacherId), role: UserRole.TEACHER } 
      });
      if (!teacher) {
        throw new NotFoundException('Class teacher not found');
      }
    }

    // Check if class name already exists in the same school
    const existingClass = await this.classesRepository.findOne({
      where: {
        name: createClassDto.name,
        grade: createClassDto.grade,
        section: createClassDto.section,
        school: { id: parseInt(createClassDto.schoolId) },
      },
    });

    if (existingClass) {
      throw new BadRequestException('Class with this name already exists');
    }

    const classEntity = this.classesRepository.create({
      name: createClassDto.name,
      grade: createClassDto.grade,
      section: createClassDto.section,
      description: createClassDto.description,
      academicYear: createClassDto.academicYear,
      maxStudents: parseInt(createClassDto.maxStudents.toString()),
      subjects: createClassDto.subjects,
      syllabus: createClassDto.syllabus,
      rules: createClassDto.rules,
      startDate: createClassDto.startDate ? new Date(createClassDto.startDate) : null,
      endDate: createClassDto.endDate ? new Date(createClassDto.endDate) : null,
      schoolId: parseInt(createClassDto.schoolId),
      classTeacherId: createClassDto.classTeacherId ? parseInt(createClassDto.classTeacherId.toString()) : null,
      currentStudents: 0,
      status: ClassStatus.ACTIVE,
    });

    return this.classesRepository.save(classEntity);
  }

  async findAllClasses(schoolId: number): Promise<Class[]> {
    return this.classesRepository.find({
      where: { schoolId: schoolId, isActive: 1 },
      relations: ['classTeacher'],
      order: { grade: 'ASC', name: 'ASC' },
    });
  }

  async findClassById(id: number): Promise<Class> {
    const classEntity = await this.classesRepository.findOne({
      where: { id, isActive: 1 }
    });

    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }

    return classEntity;
  }

  async updateClass(id: number, updateClassDto: UpdateClassDto): Promise<Class> {
    const classEntity = await this.findClassById(id);

    if (updateClassDto.classTeacherId) {
      const teacher = await this.usersRepository.findOne({ 
        where: { id: parseInt(updateClassDto.classTeacherId), role: UserRole.TEACHER } 
      });
      if (!teacher) {
        throw new NotFoundException('Class teacher not found');
      }
    }

    Object.assign(classEntity, updateClassDto);
    return this.classesRepository.save(classEntity);
  }

  async deleteClass(id: number): Promise<void> {
    const classEntity = await this.findClassById(id);
    
    // Check if class has students
    if (classEntity.currentStudents > 0) {
      throw new BadRequestException('Cannot delete class with students');
    }

    await this.classesRepository.remove(classEntity);
  }

  async getClassStats(schoolId: number): Promise<{
    total: number;
    active: number;
    inactive: number;
    completed: number;
  }> {
    const stats = await this.classesRepository
      .createQueryBuilder('class')
      .select('class.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('class.school = :schoolId', { schoolId })
      .groupBy('class.status')
      .getRawMany();

    const result = {
      total: 0,
      active: 0,
      inactive: 0,
      completed: 0,
    };

    stats.forEach((stat) => {
      const count = parseInt(stat.count);
      result.total += count;
      result[stat.status] = count;
    });

    return result;
  }

  async addStudentToClass(classId: number, studentId: number): Promise<void> {
    const classEntity = await this.findClassById(classId);
    const student = await this.usersRepository.findOne({ 
      where: { id: studentId, role: UserRole.STUDENT } 
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (classEntity.maxStudents && classEntity.currentStudents >= classEntity.maxStudents) {
      throw new BadRequestException('Class is full');
    }

    // Add student to class_students table
    await this.classesRepository
      .createQueryBuilder()
      .insert()
      .into('class_students')
      .values({ classId, studentId })
      .execute();

    // Update current students count
    classEntity.currentStudents += 1;
    await this.classesRepository.save(classEntity);
  }

  async removeStudentFromClass(classId: number, studentId: number): Promise<void> {
    const classEntity = await this.findClassById(classId);

    // Remove student from class_students table
    await this.classesRepository
      .createQueryBuilder()
      .delete()
      .from('class_students')
      .where('classId = :classId AND studentId = :studentId', { classId, studentId })
      .execute();

    // Update current students count
    if (classEntity.currentStudents > 0) {
      classEntity.currentStudents -= 1;
      await this.classesRepository.save(classEntity);
    }
  }

  async getClassesByGrade(schoolId: number, grade: string): Promise<Class[]> {
    return this.classesRepository.find({
      where: { school: { id: schoolId }, grade },
      relations: ['school', 'classTeacher'],
      order: { name: 'ASC' },
    });
  }
}
