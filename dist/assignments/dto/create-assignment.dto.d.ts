export declare class CreateAssignmentDto {
    title: string;
    description: string;
    type: string;
    priority: string;
    status?: string;
    dueDate: string;
    maxScore: number;
    instructions?: string;
    rubric?: string;
    tags?: string[];
    isRecurring?: boolean;
    recurringPattern?: string;
    assignedClasses?: number[];
    assignedStudents?: number[];
    assignedTeachers?: number[];
}
