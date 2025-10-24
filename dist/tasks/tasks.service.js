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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_entity_1 = require("./entities/task.entity");
const user_entity_1 = require("../users/entities/user.entity");
const class_entity_1 = require("../classes/entities/class.entity");
let TasksService = class TasksService {
    constructor(tasksRepository, usersRepository, classesRepository) {
        this.tasksRepository = tasksRepository;
        this.usersRepository = usersRepository;
        this.classesRepository = classesRepository;
    }
    async createTask(createTaskDto, createdBy) {
        if (createTaskDto.classId) {
            const classEntity = createTaskDto.classId
                ? await this.classesRepository.findOne({ where: { id: parseInt(createTaskDto.classId) } })
                : null;
            if (!classEntity) {
                throw new common_1.NotFoundException('Class not found');
            }
        }
        if (createTaskDto.assignedStudentIds && createTaskDto.assignedStudentIds.length > 0) {
            const students = await this.usersRepository.find({
                where: createTaskDto.assignedStudentIds.map(id => ({ id: parseInt(id), role: user_entity_1.UserRole.STUDENT }))
            });
            if (students.length !== createTaskDto.assignedStudentIds.length) {
                throw new common_1.BadRequestException('Some assigned students not found');
            }
        }
        if (createTaskDto.assignedTeacherIds && createTaskDto.assignedTeacherIds.length > 0) {
            const teachers = await this.usersRepository.find({
                where: createTaskDto.assignedTeacherIds.map(id => ({ id: parseInt(id), role: user_entity_1.UserRole.TEACHER }))
            });
            if (teachers.length !== createTaskDto.assignedTeacherIds.length) {
                throw new common_1.BadRequestException('Some assigned teachers not found');
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
            status: task_entity_1.TaskStatus.PENDING,
        });
        return this.tasksRepository.save(task);
    }
    async findAllTasks(schoolId) {
        return this.tasksRepository.find({
            where: { createdById: parseInt(schoolId) },
            relations: ['createdBy', 'class'],
            order: { createdAt: 'DESC' },
        });
    }
    async findTaskById(id) {
        const task = await this.tasksRepository.findOne({
            where: { id: parseInt(id) },
            relations: ['createdBy', 'class'],
        });
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        return task;
    }
    async updateTask(id, updateTaskDto) {
        const task = await this.findTaskById(id);
        if (updateTaskDto.classId) {
            const classEntity = await this.classesRepository.findOne({ where: { id: parseInt(updateTaskDto.classId) } });
            if (!classEntity) {
                throw new common_1.NotFoundException('Class not found');
            }
        }
        if (updateTaskDto.assignedStudentIds) {
            const students = await this.usersRepository.find({
                where: updateTaskDto.assignedStudentIds.map(id => ({ id: parseInt(id), role: user_entity_1.UserRole.STUDENT }))
            });
            if (students.length !== updateTaskDto.assignedStudentIds.length) {
                throw new common_1.BadRequestException('Some assigned students not found');
            }
        }
        if (updateTaskDto.assignedTeacherIds) {
            const teachers = await this.usersRepository.find({
                where: updateTaskDto.assignedTeacherIds.map(id => ({ id: parseInt(id), role: user_entity_1.UserRole.TEACHER }))
            });
            if (teachers.length !== updateTaskDto.assignedTeacherIds.length) {
                throw new common_1.BadRequestException('Some assigned teachers not found');
            }
        }
        Object.assign(task, updateTaskDto);
        return this.tasksRepository.save(task);
    }
    async deleteTask(id) {
        const task = await this.findTaskById(id);
        await this.tasksRepository.remove(task);
    }
    async getTasksByClass(classId) {
        return this.tasksRepository.find({
            where: { classId: parseInt(classId) },
            relations: ['createdBy', 'class'],
            order: { dueDate: 'ASC' },
        });
    }
    async getTasksByStudent(studentId) {
        return this.tasksRepository
            .createQueryBuilder('task')
            .innerJoin('task_students', 'ts', 'ts.taskId = task.id')
            .where('ts.studentId = :studentId', { studentId })
            .leftJoinAndSelect('task.createdBy', 'createdBy')
            .leftJoinAndSelect('task.class', 'class')
            .orderBy('task.dueDate', 'ASC')
            .getMany();
    }
    async getTasksByTeacher(teacherId) {
        return this.tasksRepository
            .createQueryBuilder('task')
            .innerJoin('task_teachers', 'tt', 'tt.taskId = task.id')
            .where('tt.teacherId = :teacherId', { teacherId })
            .leftJoinAndSelect('task.createdBy', 'createdBy')
            .leftJoinAndSelect('task.class', 'class')
            .orderBy('task.dueDate', 'ASC')
            .getMany();
    }
    async getTaskStats(schoolId) {
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
    async updateTaskStatus(id, status) {
        const task = await this.findTaskById(id);
        task.status = status;
        if (status === task_entity_1.TaskStatus.COMPLETED) {
            task.completedDate = new Date();
        }
        return this.tasksRepository.save(task);
    }
    async getOverdueTasks(schoolId) {
        return this.tasksRepository
            .createQueryBuilder('task')
            .where('task.createdBy = :schoolId', { schoolId })
            .andWhere('task.dueDate < :now', { now: new Date() })
            .andWhere('task.status != :completed', { completed: task_entity_1.TaskStatus.COMPLETED })
            .leftJoinAndSelect('task.class', 'class')
            .leftJoinAndSelect('task.assignedStudents', 'assignedStudents')
            .orderBy('task.dueDate', 'ASC')
            .getMany();
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(class_entity_1.Class)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TasksService);
//# sourceMappingURL=tasks.service.js.map