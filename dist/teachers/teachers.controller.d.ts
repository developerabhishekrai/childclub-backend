import { TeachersService, CreateTeacherDto } from './teachers.service';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
export declare class TeachersController {
    private readonly teachersService;
    constructor(teachersService: TeachersService);
    createTeacher(createTeacherDto: CreateTeacherDto, req: any): Promise<any>;
    findAllTeachers(req: any, schoolId?: string): Promise<any[]>;
    getTeacherStats(req: any): Promise<{
        total: number;
        active: number;
        inactive: number;
        pending: number;
    }>;
    findTeacherById(id: string): Promise<any>;
    getTeacherClasses(id: string): Promise<any[]>;
    getTeachersByClass(classId: string): Promise<import("../users/entities/user.entity").User[]>;
    updateTeacher(id: string, updateTeacherDto: UpdateTeacherDto): Promise<any>;
    deleteTeacher(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    assignTeacherToClass(teacherId: string, classId: string): Promise<void>;
    removeTeacherFromClass(teacherId: string, classId: string): Promise<void>;
    resetPassword(teacherId: string, newPassword: string, req: any): Promise<any>;
    getMyStudents(req: any): Promise<any>;
    testRestart(): Promise<{
        message: string;
        timestamp: string;
        version: string;
    }>;
    getMyClasses(req: any): Promise<any[]>;
}
