import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { TeachersService, CreateTeacherDto } from './teachers.service';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('teachers')
@UseGuards(JwtAuthGuard)
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  async createTeacher(
    @Body() createTeacherDto: CreateTeacherDto,
    @Request() req,
  ) {
    // Use user's ID as createdBy (for school admin, this is their user ID)
    const createdBy = req.user.id;
    console.log('Creating teacher with createdBy:', {
      userId: req.user.id,
      userRole: req.user.role,
      schoolId: req.user.schoolId,
      createdBy
    });
    return this.teachersService.createTeacher(createTeacherDto, createdBy.toString());
  }

  @Get()
  async findAllTeachers(
    @Request() req,
    @Query('schoolId') schoolId?: string,
  ) {
    // For school admin, use their user ID (since createdById stores admin's user ID)
    // For other roles, use schoolId from query or token
    const id = schoolId || req.user.id;
    console.log('Finding teachers for user/school:', {
      userId: req.user.id,
      userRole: req.user.role,
      schoolId: req.user.schoolId,
      querySchoolId: schoolId,
      finalId: id
    });
    return this.teachersService.findAllTeachers(id);
  }

  @Get('stats')
  async getTeacherStats(@Request() req) {
    // Use user's ID to fetch stats (teachers are linked via createdById)
    const userId = req.user.id;
    console.log('Fetching teacher stats for user:', userId);
    return this.teachersService.getTeacherStats(userId.toString());
  }

  @Get(':id')
  async findTeacherById(@Param('id') id: string) {
    return this.teachersService.findTeacherById(id);
  }

  @Get(':id/classes')
  async getTeacherClasses(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new Error('Invalid teacher ID');
    }
    return this.teachersService.getTeacherClasses(userId);
  }

  @Get('class/:classId')
  async getTeachersByClass(@Param('classId') classId: string) {
    return this.teachersService.getTeachersByClass(classId);
  }

  @Put(':id')
  async updateTeacher(
    @Param('id') id: string,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ) {
    return this.teachersService.updateTeacher(id, updateTeacherDto);
  }

  @Delete(':id')
  async deleteTeacher(@Param('id') id: string) {
    try {
      await this.teachersService.deleteTeacher(id);
      return {
        success: true,
        message: 'Teacher deleted successfully',
      };
    } catch (error) {
      console.error('Error in deleteTeacher controller:', error);
      throw error;
    }
  }

  @Post(':id/assign-class/:classId')
  async assignTeacherToClass(
    @Param('id') teacherId: string,
    @Param('classId') classId: string,
  ) {
    return this.teachersService.assignTeacherToClass(teacherId, classId);
  }

  @Delete(':id/remove-class/:classId')
  async removeTeacherFromClass(
    @Param('id') teacherId: string,
    @Param('classId') classId: string,
  ) {
    return this.teachersService.removeTeacherFromClass(teacherId, classId);
  }

  @Post(':id/reset-password')
  async resetPassword(
    @Param('id') teacherId: string,
    @Body('newPassword') newPassword: string,
    @Request() req,
  ) {
    console.log('Reset password request for teacher:', teacherId);
    return this.teachersService.resetPassword(teacherId, newPassword);
  }

  @Get('my/students')
  async getMyStudents(@Request() req) {
    console.log('Getting students for teacher:', req.user.id);
    return this.teachersService.getMyStudents(req.user.id);
  }

  @Get('test-restart')
  async testRestart() {
    return {
      message: 'Backend restarted successfully!',
      timestamp: new Date().toISOString(),
      version: 'v2.0-fixed'
    };
  }

  @Get('my-classes')
  async getMyClasses(@Request() req) {
    try {
      console.log('==================== MY-CLASSES ENDPOINT ====================');
      console.log('[Controller] Request received at:', new Date().toISOString());
      console.log('[Controller] req.user exists:', !!req.user);
      
      if (!req.user) {
        console.error('[Controller] ERROR: req.user is undefined or null');
        throw new Error('Authentication failed - no user object in request');
      }
      
      console.log('[Controller] Full request user:', JSON.stringify(req.user, null, 2));
      console.log('[Controller] req.user.id value:', req.user.id);
      console.log('[Controller] req.user.id type:', typeof req.user.id);
      
      if (req.user.id === undefined || req.user.id === null) {
        console.error('[Controller] ERROR: req.user.id is undefined or null');
        throw new Error('Authentication failed - no user ID in request');
      }
      
      const userId = req.user.id;
      console.log('[Controller] Original userId from token:', userId);
      console.log('[Controller] userId type:', typeof userId);
      
      // Better validation for userId
      if (userId === null || userId === undefined || Number.isNaN(userId)) {
        console.error('[Controller] ERROR: userId is null/undefined/NaN:', userId);
        console.log('[Controller] Returning empty array due to invalid userId');
        return [];
      }
      
      const userIdNum = typeof userId === 'number' ? userId : parseInt(String(userId));
      console.log('[Controller] Parsed userId:', userIdNum);
      
      // Final validation
      if (isNaN(userIdNum) || userIdNum <= 0) {
        console.error('[Controller] ERROR: Invalid userId after parsing:', userIdNum);
        console.log('[Controller] Returning empty array due to invalid parsed userId');
        return [];
      }
      
      console.log('[Controller] Calling getTeacherClasses with userId:', userIdNum);
      const result = await this.teachersService.getTeacherClasses(userIdNum);
      console.log('[Controller] Successfully retrieved classes:', result.length);
      console.log('==================== END MY-CLASSES ENDPOINT ====================');
      
      return result;
    } catch (error) {
      console.error('==================== MY-CLASSES ERROR ====================');
      console.error('[Controller] Error in getMyClasses:', error.message);
      console.error('[Controller] Error stack:', error.stack);
      console.error('==================== END ERROR ====================');
      throw error;
    }
  }
}