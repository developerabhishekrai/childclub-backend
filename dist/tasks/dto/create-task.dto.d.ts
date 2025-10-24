import { TaskType, TaskPriority, TaskStatus } from '../entities/task.entity';
export declare class CreateTaskDto {
    title: string;
    description: string;
    type: TaskType;
    priority: TaskPriority;
    dueDate: string;
    maxScore?: string;
    passingScore?: string;
    instructions?: string;
    rubric?: string;
    tags?: string[];
    isRecurring?: boolean;
    recurringPattern?: string;
    classId?: number;
    assignedClasses?: string[];
    assignedStudents?: string[];
    assignedTeachers?: string[];
    schoolId: number;
    status?: TaskStatus;
}
