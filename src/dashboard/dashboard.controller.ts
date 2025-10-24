import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getDashboardStats(@Request() req) {
    const schoolId = req.user.schoolId;
    const userId = req.user.sub || req.user.id;
    const userRole = req.user.role;
    console.log('Dashboard Stats Request:', {
      userId,
      userRole,
      schoolId
    });
    return this.dashboardService.getDashboardStats(schoolId, userId, userRole);
  }

  @Get('activities')
  async getRecentActivities(@Request() req) {
    const schoolId = req.user.schoolId;
    return this.dashboardService.getRecentActivities(schoolId);
  }

  @Get('super-admin/stats')
  async getSuperAdminStats(@Request() req) {
    // Only super admins should access this endpoint
    if (req.user.role !== 'super_admin') {
      return { error: 'Unauthorized access' };
    }
    return this.dashboardService.getSuperAdminStats();
  }
}

