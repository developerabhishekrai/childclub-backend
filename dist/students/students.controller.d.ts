import { Response } from 'express';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    registerStudent(createStudentDto: CreateStudentDto): Promise<import("./entities/student.entity").Student>;
    createStudent(createStudentDto: CreateStudentDto, req: any): Promise<import("./entities/student.entity").Student>;
    findAll(req: any): Promise<any[]>;
    findByUserId(userId: string): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateStudentDto: UpdateStudentDto): Promise<any>;
    updatePut(id: string, updateStudentDto: UpdateStudentDto): Promise<any>;
    remove(id: string): Promise<void>;
    updateStatus(id: string, body: {
        status: string;
    }): Promise<import("./entities/student.entity").Student>;
    findBySchool(schoolId: string): Promise<any[]>;
    findByClass(classId: string): Promise<any[]>;
    resetPassword(studentId: string, newPassword: string, req: any): Promise<any>;
    exportToCSV(req: any, res: Response): Promise<void>;
}
