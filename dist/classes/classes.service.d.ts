import { Repository } from 'typeorm';
import { Class, ClassStatus } from './entities/class.entity';
import { School } from '../schools/entities/school.entity';
import { User } from '../users/entities/user.entity';
export interface CreateClassDto {
    name: string;
    grade: string;
    section?: string;
    description?: string;
    academicYear?: string;
    startDate?: Date;
    endDate?: Date;
    maxStudents?: number;
    subjects?: object;
    syllabus?: string;
    rules?: string;
    schoolId: string;
    classTeacherId?: string;
}
export interface UpdateClassDto {
    name?: string;
    grade?: string;
    section?: string;
    description?: string;
    academicYear?: string;
    startDate?: Date;
    endDate?: Date;
    maxStudents?: number;
    subjects?: object;
    syllabus?: string;
    rules?: string;
    status?: ClassStatus;
    classTeacherId?: string;
}
export declare class ClassesService {
    private classesRepository;
    private schoolsRepository;
    private usersRepository;
    constructor(classesRepository: Repository<Class>, schoolsRepository: Repository<School>, usersRepository: Repository<User>);
    createClass(createClassDto: CreateClassDto, createdBy: number): Promise<Class>;
    findAllClasses(schoolId: number): Promise<Class[]>;
    findClassById(id: number): Promise<Class>;
    updateClass(id: number, updateClassDto: UpdateClassDto): Promise<Class>;
    deleteClass(id: number): Promise<void>;
    getClassStats(schoolId: number): Promise<{
        total: number;
        active: number;
        inactive: number;
        completed: number;
    }>;
    addStudentToClass(classId: number, studentId: number): Promise<void>;
    removeStudentFromClass(classId: number, studentId: number): Promise<void>;
    getClassesByGrade(schoolId: number, grade: string): Promise<Class[]>;
}
