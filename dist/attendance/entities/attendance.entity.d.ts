import { User } from '../../users/entities/user.entity';
import { Class } from '../../classes/entities/class.entity';
export declare enum AttendanceStatus {
    PRESENT = "present",
    ABSENT = "absent",
    LATE = "late",
    EXCUSED = "excused",
    HALF_DAY = "half_day"
}
export declare class Attendance {
    id: number;
    studentId: number;
    classId: number;
    teacherId: number;
    date: Date;
    status: AttendanceStatus;
    remarks: string;
    checkInTime: string;
    checkOutTime: string;
    temperature: number;
    mood: string;
    parentNotified: number;
    notificationSentAt: Date;
    createdAt: Date;
    updatedAt: Date;
    student: User;
    class: Class;
    teacher: User;
}
