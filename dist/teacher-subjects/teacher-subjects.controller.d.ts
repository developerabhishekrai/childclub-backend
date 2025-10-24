import { TeacherSubjectsService } from './teacher-subjects.service';
import { AssignTeacherSubjectDto } from './dto/assign-teacher-subject.dto';
export declare class TeacherSubjectsController {
    private readonly teacherSubjectsService;
    constructor(teacherSubjectsService: TeacherSubjectsService);
    assignSubjectsToTeacher(assignTeacherSubjectDto: AssignTeacherSubjectDto): Promise<import("./entities/teacher-subject.entity").TeacherSubject[]>;
    getTeacherSubjects(teacherId: string): Promise<import("./entities/teacher-subject.entity").TeacherSubject[]>;
    getSubjectTeachers(subjectId: string): Promise<import("./entities/teacher-subject.entity").TeacherSubject[]>;
    getClassTeachers(classId: string): Promise<import("./entities/teacher-subject.entity").TeacherSubject[]>;
    removeTeacherSubject(teacherId: string, subjectId: string, classId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    removeAllTeacherSubjects(teacherId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
