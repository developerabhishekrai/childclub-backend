import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus, TaskPriority, TaskType } from './entities/task.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { Class } from '../classes/entities/class.entity';

export interface CreateTaskDto {
  title: string;
  description: string;
  type: TaskType;
  priority?: TaskPriority;
  dueDate: Date;
  maxScore?: number;
  passingScore?: number;
  instructions?: string;
  rubric?: string;
  tags?: object;
  isRecurring?: boolean;
  recurringPattern?: string;
  schoolId: string;
  classId?: string;
  assignedStudentIds?: string[];
  assignedTeacherIds?: string[];
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  type?: TaskType;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: Date;
  maxScore?: number;
  passingScore?: number;
  instructions?: string;
  rubric?: string;
  tags?: object;
  isRecurring?: boolean;
  recurringPattern?: string;
  classId?: string;
  assignedStudentIds?: string[];
  assignedTeacherIds?: string[];
}

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Class)
    private classesRepository: Repository<Class>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto, createdBy: string): Promise<Task> {
    // Check if class exists if provided
    if (createTaskDto.classId) {
      const classEntity = createTaskDto.classId 
        ? await this.classesRepository.findOne({ where: { id: parseInt(createTaskDto.classId) } })
        : null;
      if (!classEntity) {
        throw new NotFoundException('Class not found');
      }
    }

    // Check if assigned students exist
    if (createTaskDto.assignedStudentIds && createTaskDto.assignedStudentIds.length > 0) {
      const students = await this.usersRepository.find({
        where: createTaskDto.assignedStudentIds.map(id => ({ id: parseInt(id), role: UserRole.STUDENT }))
      });
      if (students.length !== createTaskDto.assignedStudentIds.length) {
        throw new BadRequestException('Some assigned students not found');
      }
    }

    // Check if assigned teachers exist
    if (createTaskDto.assignedTeacherIds && createTaskDto.assignedTeacherIds.length > 0) {
      const teachers = await this.usersRepository.find({
        where: createTaskDto.assignedTeacherIds.map(id => ({ id: parseInt(id), role: UserRole.TEACHER }))
      });
      if (teachers.length !== createTaskDto.assignedTeacherIds.length) {
        throw new BadRequestException('Some assigned teachers not found');
      }
    }

    const task = this.tasksRepository.create({
      title: createTaskDto.title,
      description: createTaskDto.description,
      type: createTaskDto.type,
      priority: createTaskDto.priority,
      dueDate: new Date(createTaskDto.dueDate),
      maxScore: createTaskDto.maxScore ? parseInt(createTaskDto.maxScore.toString()) : null,
      passingScore: createTaskDto.passingScore ? parseInt(createTaskDto.passingScore.toString()) : null,
      instructions: createTaskDto.instructions,
      rubric: createTaskDto.rubric,
      tags: createTaskDto.tags,
      isRecurring: createTaskDto.isRecurring ? 1 : 0,
      recurringPattern: createTaskDto.recurringPattern,
      classId: parseInt(createTaskDto.classId),
      createdById: parseInt(createdBy),
      assignedDate: new Date(),
      status: TaskStatus.PENDING,
    });

    return this.tasksRepository.save(task);
  }

  async findAllTasks(schoolId: string): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { createdById: parseInt(schoolId) },
      relations: ['createdBy', 'class'],
      order: { createdAt: 'DESC' },
    });
  }

  async findTaskById(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['createdBy', 'class'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findTaskById(id);

    if (updateTaskDto.classId) {
      const classEntity = await this.classesRepository.findOne({ where: { id: parseInt(updateTaskDto.classId) } });
      if (!classEntity) {
        throw new NotFoundException('Class not found');
      }
    }

    if (updateTaskDto.assignedStudentIds) {
      const students = await this.usersRepository.find({
        where: updateTaskDto.assignedStudentIds.map(id => ({ id: parseInt(id), role: UserRole.STUDENT }))
      });
      if (students.length !== updateTaskDto.assignedStudentIds.length) {
        throw new BadRequestException('Some assigned students not found');
      }
      // Note: Task entity doesn't have assignedStudents property in current schema
    }

    if (updateTaskDto.assignedTeacherIds) {
      const teachers = await this.usersRepository.find({
        where: updateTaskDto.assignedTeacherIds.map(id => ({ id: parseInt(id), role: UserRole.TEACHER }))
      });
      if (teachers.length !== updateTaskDto.assignedTeacherIds.length) {
        throw new BadRequestException('Some assigned teachers not found');
      }
      // Note: Task entity doesn't have assignedTeachers property in current schema
    }

    Object.assign(task, updateTaskDto);
    return this.tasksRepository.save(task);
  }

  async deleteTask(id: string): Promise<void> {
    const task = await this.findTaskById(id);
    await this.tasksRepository.remove(task);
  }

  async getTasksByClass(classId: string): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { classId: parseInt(classId) },
      relations: ['createdBy', 'class'],
      order: { dueDate: 'ASC' },
    });
  }

  async getTasksByStudent(studentId: string): Promise<Task[]> {
    return this.tasksRepository
      .createQueryBuilder('task')
      .innerJoin('task_students', 'ts', 'ts.taskId = task.id')
      .where('ts.studentId = :studentId', { studentId })
      .leftJoinAndSelect('task.createdBy', 'createdBy')
      .leftJoinAndSelect('task.class', 'class')
      .orderBy('task.dueDate', 'ASC')
      .getMany();
  }

  async getTasksByTeacher(teacherId: string): Promise<Task[]> {
    return this.tasksRepository
      .createQueryBuilder('task')
      .innerJoin('task_teachers', 'tt', 'tt.taskId = task.id')
      .where('tt.teacherId = :teacherId', { teacherId })
      .leftJoinAndSelect('task.createdBy', 'createdBy')
      .leftJoinAndSelect('task.class', 'class')
      .orderBy('task.dueDate', 'ASC')
      .getMany();
  }

  async getTaskStats(schoolId: string): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    overdue: number;
  }> {
    const stats = await this.tasksRepository
      .createQueryBuilder('task')
      .select('task.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('task.createdBy = :schoolId', { schoolId })
      .groupBy('task.status')
      .getRawMany();

    const result = {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      overdue: 0,
    };

    stats.forEach((stat) => {
      const count = parseInt(stat.count);
      result.total += count;
      result[stat.status] = count;
    });

    return result;
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.findTaskById(id);
    task.status = status;
    
    if (status === TaskStatus.COMPLETED) {
      task.completedDate = new Date();
    }
    
    return this.tasksRepository.save(task);
  }

  async getOverdueTasks(schoolId: string): Promise<Task[]> {
    return this.tasksRepository
      .createQueryBuilder('task')
      .where('task.createdBy = :schoolId', { schoolId })
      .andWhere('task.dueDate < :now', { now: new Date() })
      .andWhere('task.status != :completed', { completed: TaskStatus.COMPLETED })
      .leftJoinAndSelect('task.class', 'class')
      .leftJoinAndSelect('task.assignedStudents', 'assignedStudents')
      .orderBy('task.dueDate', 'ASC')
      .getMany();
  }
}

