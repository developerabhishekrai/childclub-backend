import { Repository } from 'typeorm';
import { TeacherSubject } from './entities/teacher-subject.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Subject } from '../subjects/entities/subject.entity';
import { Class } from '../classes/entities/class.entity';
import { AssignTeacherSubjectDto } from './dto/assign-teacher-subject.dto';
export declare class TeacherSubjectsService {
    private teacherSubjectsRepository;
    private teachersRepository;
    private subjectsRepository;
    private classesRepository;
    constructor(teacherSubjectsRepository: Repository<TeacherSubject>, teachersRepository: Repository<Teacher>, subjectsRepository: Repository<Subject>, classesRepository: Repository<Class>);
    assignSubjectsToTeacher(assignTeacherSubjectDto: AssignTeacherSubjectDto): Promise<TeacherSubject[]>;
    getTeacherSubjects(teacherId: number): Promise<TeacherSubject[]>;
    getSubjectTeachers(subjectId: number): Promise<TeacherSubject[]>;
    getClassTeachers(classId: number): Promise<TeacherSubject[]>;
    removeTeacherSubject(teacherId: number, subjectId: number, classId?: number): Promise<void>;
    removeAllTeacherSubjects(teacherId: number): Promise<void>;
}
