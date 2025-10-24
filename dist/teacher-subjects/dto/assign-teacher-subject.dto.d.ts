export declare class SubjectAssignmentDto {
    subjectId: number;
    classId?: number;
}
export declare class AssignTeacherSubjectDto {
    teacherId: number;
    subjects: SubjectAssignmentDto[];
}
