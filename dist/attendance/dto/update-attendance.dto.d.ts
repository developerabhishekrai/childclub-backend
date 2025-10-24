import { AttendanceStatus } from '../entities/attendance.entity';
export declare class UpdateAttendanceDto {
    status?: AttendanceStatus;
    remarks?: string;
    checkInTime?: string;
    checkOutTime?: string;
    temperature?: number;
    mood?: string;
}
