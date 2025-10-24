import { User } from '../../users/entities/user.entity';
import { Class } from '../../classes/entities/class.entity';
export declare enum TaskType {
    HOMEWORK = "homework",
    PROJECT = "project",
    QUIZ = "quiz",
    ASSIGNMENT = "assignment",
    ACTIVITY = "activity",
    EXAM = "exam"
}
export declare enum TaskPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent"
}
export declare enum TaskStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    OVERDUE = "overdue",
    CANCELLED = "cancelled"
}
export declare class Task {
    id: number;
    title: string;
    description: string;
    type: TaskType;
    priority: TaskPriority;
    status: TaskStatus;
    assignedDate: Date;
    completedDate: Date;
    maxScore: number;
    passingScore: number;
    instructions: string;
    rubric: string;
    isActive: number;
    isRecurring: number;
    recurringPattern: string;
    classId: number;
    createdById: number;
    dueDate: Date;
    attachments: any;
    tags: any;
    createdAt: Date;
    updatedAt: Date;
    class: Class;
    createdBy: User;
}
