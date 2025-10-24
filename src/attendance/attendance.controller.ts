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
import { AttendanceService } from './attendance.service';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  async markAttendance(
    @Body() markAttendanceDto: MarkAttendanceDto,
    @Request() req,
  ) {
    return this.attendanceService.markAttendance(markAttendanceDto, req.user.id);
  }

  @Get('class/:classId')
  async getAttendanceByClass(
    @Param('classId') classId: string,
    @Query('date') date?: string,
  ) {
    return this.attendanceService.getAttendanceByClass(parseInt(classId), date);
  }

  @Get('student/:studentId')
  async getAttendanceByStudent(
    @Param('studentId') studentId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.attendanceService.getAttendanceByStudent(parseInt(studentId), startDate, endDate);
  }

  @Get('stats/class/:classId')
  async getAttendanceStats(
    @Param('classId') classId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.attendanceService.getAttendanceStats(parseInt(classId), startDate, endDate);
  }

  @Get('stats/student/:studentId')
  async getStudentAttendanceStats(
    @Param('studentId') studentId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.attendanceService.getStudentAttendanceStats(parseInt(studentId), startDate, endDate);
  }

  @Put(':id')
  async updateAttendance(
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    return this.attendanceService.updateAttendance(parseInt(id), updateAttendanceDto);
  }

  @Delete(':id')
  async deleteAttendance(@Param('id') id: string) {
    await this.attendanceService.deleteAttendance(parseInt(id));
    return {
      success: true,
      message: 'Attendance record deleted successfully',
    };
  }
}

