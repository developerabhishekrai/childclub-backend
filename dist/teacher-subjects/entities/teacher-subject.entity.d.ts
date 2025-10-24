import { Teacher } from '../../teachers/entities/teacher.entity';
import { Subject } from '../../subjects/entities/subject.entity';
import { Class } from '../../classes/entities/class.entity';
export declare class TeacherSubject {
    id: number;
    teacherId: number;
    subjectId: number;
    classId: number;
    isActive: number;
    createdAt: Date;
    updatedAt: Date;
    teacher: Teacher;
    subject: Subject;
    class: Class;
}
