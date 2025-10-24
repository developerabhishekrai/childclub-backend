import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { School } from '../schools/entities/school.entity';
import { Class } from '../classes/entities/class.entity';
import { Teacher } from './entities/teacher.entity';
import { TeacherClass } from './entities/teacher-class.entity';
import { Subject } from '../subjects/entities/subject.entity';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
export interface CreateTeacherDto {
    firstName: string;
    lastName: string;
    email: string;
    mobile?: string;
    password: string;
    dateOfBirth?: Date;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    schoolId: string;
    subjects?: string[];
    qualification?: string;
    specialization?: string;
    experienceYears?: number;
    department?: string;
    designation?: string;
    joiningDate?: Date;
    salary?: number;
    emergencyContact?: string;
    classIds?: number[];
}
export declare class TeachersService {
    private usersRepository;
    private schoolsRepository;
    private classesRepository;
    private teachersRepository;
    private teacherClassesRepository;
    private subjectsRepository;
    constructor(usersRepository: Repository<User>, schoolsRepository: Repository<School>, classesRepository: Repository<Class>, teachersRepository: Repository<Teacher>, teacherClassesRepository: Repository<TeacherClass>, subjectsRepository: Repository<Subject>);
    createTeacher(createTeacherDto: CreateTeacherDto, createdBy: string): Promise<any>;
    findAllTeachers(userId: string): Promise<any[]>;
    findTeacherById(id: string): Promise<any>;
    updateTeacher(id: string, updateTeacherDto: UpdateTeacherDto): Promise<any>;
    deleteTeacher(id: string): Promise<void>;
    getTeachersByClass(classId: string): Promise<User[]>;
    getTeacherStats(userId: string): Promise<{
        total: number;
        active: number;
        inactive: number;
        pending: number;
    }>;
    assignTeacherToClass(teacherId: string, classId: string): Promise<void>;
    removeTeacherFromClass(teacherId: string, classId: string): Promise<void>;
    resetPassword(teacherId: string, newPassword: string): Promise<any>;
    getTeacherClasses(userId: number): Promise<any[]>;
    getMyStudents(userId: number): Promise<any>;
}
