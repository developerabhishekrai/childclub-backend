export declare class Assignment {
    id: number;
    schoolId: number;
    title: string;
    description: string;
    type: string;
    priority: string;
    status: string;
    dueDate: Date;
    maxScore: number;
    instructions: string;
    rubric: string;
    tags: string[];
    isRecurring: boolean;
    recurringPattern: string;
    createdBy: number;
    createdAt: Date;
    updatedAt: Date;
}
