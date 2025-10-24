import { Assignment } from './assignment.entity';
export declare enum TargetType {
    CLASS = "class",
    STUDENT = "student",
    TEACHER = "teacher"
}
export declare class AssignmentTarget {
    id: number;
    assignmentId: number;
    targetType: TargetType;
    targetId: number;
    createdAt: Date;
    assignment: Assignment;
}
