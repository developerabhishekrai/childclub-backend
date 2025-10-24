import { Repository } from 'typeorm';
import { Student } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Class } from '../classes/entities/class.entity';
import { Task } from '../tasks/entities/task.entity';
import { CalendarEvent } from '../calendar/entities/calendar-event.entity';
import { User } from '../users/entities/user.entity';
import { School } from '../schools/entities/school.entity';
export declare class DashboardService {
    private readonly studentsRepository;
    private readonly teachersRepository;
    private readonly classesRepository;
    private readonly tasksRepository;
    private readonly calendarEventsRepository;
    private readonly usersRepository;
    private readonly schoolsRepository;
    constructor(studentsRepository: Repository<Student>, teachersRepository: Repository<Teacher>, classesRepository: Repository<Class>, tasksRepository: Repository<Task>, calendarEventsRepository: Repository<CalendarEvent>, usersRepository: Repository<User>, schoolsRepository: Repository<School>);
    getDashboardStats(schoolId: number, userId?: number, userRole?: string): Promise<{
        totalStudents: number;
        totalTeachers: number;
        totalClasses: number;
        activeClasses: number;
        pendingTasks: number;
        upcomingEvents: number;
        attendanceRate: number;
        averageScore: number;
    }>;
    getTeacherDashboardStats(userId: number, schoolId: number): Promise<{
        totalStudents: number;
        totalTeachers: number;
        totalClasses: number;
        activeClasses: number;
        pendingTasks: number;
        upcomingEvents: number;
        attendanceRate: number;
        averageScore: number;
    }>;
    getRecentActivities(schoolId: number): Promise<{
        id: number;
        type: string;
        message: string;
        timestamp: Date;
        details: string;
    }[]>;
    getSuperAdminStats(): Promise<{
        totalSchools: number;
        pendingSchools: number;
        approvedSchools: number;
        totalAdmins: number;
        totalTeachers: number;
        totalStudents: number;
        activeUsers: number;
        systemHealth: string;
    }>;
}
