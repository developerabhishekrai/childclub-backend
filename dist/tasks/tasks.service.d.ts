import { Repository } from 'typeorm';
import { Task, TaskStatus, TaskPriority, TaskType } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
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
export declare class TasksService {
    private tasksRepository;
    private usersRepository;
    private classesRepository;
    constructor(tasksRepository: Repository<Task>, usersRepository: Repository<User>, classesRepository: Repository<Class>);
    createTask(createTaskDto: CreateTaskDto, createdBy: string): Promise<Task>;
    findAllTasks(schoolId: string): Promise<Task[]>;
    findTaskById(id: string): Promise<Task>;
    updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task>;
    deleteTask(id: string): Promise<void>;
    getTasksByClass(classId: string): Promise<Task[]>;
    getTasksByStudent(studentId: string): Promise<Task[]>;
    getTasksByTeacher(teacherId: string): Promise<Task[]>;
    getTaskStats(schoolId: string): Promise<{
        total: number;
        pending: number;
        inProgress: number;
        completed: number;
        overdue: number;
    }>;
    updateTaskStatus(id: string, status: TaskStatus): Promise<Task>;
    getOverdueTasks(schoolId: string): Promise<Task[]>;
}
