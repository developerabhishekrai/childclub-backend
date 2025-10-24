import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { Class } from '../classes/entities/class.entity';
import { User } from '../users/entities/user.entity';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
export declare class AttendanceService {
    private attendanceRepository;
    private classesRepository;
    private usersRepository;
    constructor(attendanceRepository: Repository<Attendance>, classesRepository: Repository<Class>, usersRepository: Repository<User>);
    markAttendance(markAttendanceDto: MarkAttendanceDto, teacherId: number): Promise<Attendance[]>;
    getAttendanceByClass(classId: number, date?: string): Promise<any[]>;
    getAttendanceByStudent(studentId: number, startDate?: string, endDate?: string): Promise<Attendance[]>;
    updateAttendance(id: number, updateAttendanceDto: UpdateAttendanceDto): Promise<Attendance>;
    deleteAttendance(id: number): Promise<void>;
    getAttendanceStats(classId: number, startDate?: string, endDate?: string): Promise<{
        totalDays: number;
        present: number;
        absent: number;
        late: number;
        excused: number;
        attendancePercentage: number;
    }>;
    getStudentAttendanceStats(studentId: number, startDate?: string, endDate?: string): Promise<{
        totalDays: number;
        present: number;
        absent: number;
        late: number;
        excused: number;
        attendancePercentage: number;
    }>;
}
