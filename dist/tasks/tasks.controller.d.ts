import { TasksService, CreateTaskDto, UpdateTaskDto } from './tasks.service';
import { TaskStatus } from './entities/task.entity';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    createTask(createTaskDto: CreateTaskDto, req: any): Promise<import("./entities/task.entity").Task>;
    findAllTasks(req: any, schoolId?: string): Promise<import("./entities/task.entity").Task[]>;
    getTaskStats(req: any): Promise<{
        total: number;
        pending: number;
        inProgress: number;
        completed: number;
        overdue: number;
    }>;
    getOverdueTasks(req: any): Promise<import("./entities/task.entity").Task[]>;
    getTasksByClass(classId: string): Promise<import("./entities/task.entity").Task[]>;
    getTasksByStudent(studentId: string): Promise<import("./entities/task.entity").Task[]>;
    getTasksByTeacher(teacherId: string): Promise<import("./entities/task.entity").Task[]>;
    findTaskById(id: string): Promise<import("./entities/task.entity").Task>;
    updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<import("./entities/task.entity").Task>;
    updateTaskStatus(id: string, status: TaskStatus): Promise<import("./entities/task.entity").Task>;
    deleteTask(id: string): Promise<void>;
}
