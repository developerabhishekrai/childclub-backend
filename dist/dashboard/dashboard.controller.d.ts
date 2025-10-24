import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getDashboardStats(req: any): Promise<{
        totalStudents: number;
        totalTeachers: number;
        totalClasses: number;
        activeClasses: number;
        pendingTasks: number;
        upcomingEvents: number;
        attendanceRate: number;
        averageScore: number;
    }>;
    getRecentActivities(req: any): Promise<{
        id: number;
        type: string;
        message: string;
        timestamp: Date;
        details: string;
    }[]>;
    getSuperAdminStats(req: any): Promise<{
        totalSchools: number;
        pendingSchools: number;
        approvedSchools: number;
        totalAdmins: number;
        totalTeachers: number;
        totalStudents: number;
        activeUsers: number;
        systemHealth: string;
    } | {
        error: string;
    }>;
}
