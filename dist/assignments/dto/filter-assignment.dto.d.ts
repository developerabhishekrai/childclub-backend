export declare enum FilterByTarget {
    CLASS = "class",
    STUDENT = "student",
    TEACHER = "teacher"
}
export declare class FilterAssignmentDto {
    schoolId?: number;
    type?: string;
    priority?: string;
    targetType?: FilterByTarget;
    targetId?: number;
}
