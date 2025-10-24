import { AttendanceService } from './attendance.service';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    markAttendance(markAttendanceDto: MarkAttendanceDto, req: any): Promise<import("./entities/attendance.entity").Attendance[]>;
    getAttendanceByClass(classId: string, date?: string): Promise<any[]>;
    getAttendanceByStudent(studentId: string, startDate?: string, endDate?: string): Promise<import("./entities/attendance.entity").Attendance[]>;
    getAttendanceStats(classId: string, startDate?: string, endDate?: string): Promise<{
        totalDays: number;
        present: number;
        absent: number;
        late: number;
        excused: number;
        attendancePercentage: number;
    }>;
    getStudentAttendanceStats(studentId: string, startDate?: string, endDate?: string): Promise<{
        totalDays: number;
        present: number;
        absent: number;
        late: number;
        excused: number;
        attendancePercentage: number;
    }>;
    updateAttendance(id: string, updateAttendanceDto: UpdateAttendanceDto): Promise<import("./entities/attendance.entity").Attendance>;
    deleteAttendance(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
