import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Student } from './entities/student.entity';
import { Class } from '../classes/entities/class.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
export declare class StudentsService {
    private readonly studentsRepository;
    private readonly usersRepository;
    private readonly classesRepository;
    constructor(studentsRepository: Repository<Student>, usersRepository: Repository<User>, classesRepository: Repository<Class>);
    createStudent(createStudentDto: CreateStudentDto, createdBy: number): Promise<Student>;
    findAll(): Promise<Student[]>;
    findBySchoolId(schoolId: number): Promise<any[]>;
    findByUserId(userId: number): Promise<any>;
    findOne(id: number): Promise<any>;
    update(id: number, updateStudentDto: UpdateStudentDto): Promise<any>;
    remove(id: number): Promise<void>;
    updateStatus(id: number, status: string): Promise<Student>;
    findBySchool(schoolId: number): Promise<any[]>;
    findByClass(classId: number): Promise<any[]>;
    resetPassword(studentId: string, newPassword: string): Promise<any>;
    exportToCSV(schoolId: number): Promise<string>;
    private escapeCSV;
}
