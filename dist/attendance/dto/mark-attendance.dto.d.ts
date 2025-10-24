import { AttendanceStatus } from '../entities/attendance.entity';
export declare class StudentAttendanceDto {
    studentId: number;
    status: AttendanceStatus;
    remarks?: string;
    checkInTime?: string;
    mood?: string;
    temperature?: number;
}
export declare class MarkAttendanceDto {
    classId: number;
    date: string;
    attendance: StudentAttendanceDto[];
}
