import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TeacherSubjectsService } from './teacher-subjects.service';
import { AssignTeacherSubjectDto } from './dto/assign-teacher-subject.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('teacher-subjects')
@UseGuards(JwtAuthGuard)
export class TeacherSubjectsController {
  constructor(private readonly teacherSubjectsService: TeacherSubjectsService) {}

  @Post('assign')
  async assignSubjectsToTeacher(
    @Body() assignTeacherSubjectDto: AssignTeacherSubjectDto,
  ) {
    return this.teacherSubjectsService.assignSubjectsToTeacher(assignTeacherSubjectDto);
  }

  @Get('teacher/:teacherId')
  async getTeacherSubjects(@Param('teacherId') teacherId: string) {
    return this.teacherSubjectsService.getTeacherSubjects(parseInt(teacherId));
  }

  @Get('subject/:subjectId')
  async getSubjectTeachers(@Param('subjectId') subjectId: string) {
    return this.teacherSubjectsService.getSubjectTeachers(parseInt(subjectId));
  }

  @Get('class/:classId')
  async getClassTeachers(@Param('classId') classId: string) {
    return this.teacherSubjectsService.getClassTeachers(parseInt(classId));
  }

  @Delete('remove')
  async removeTeacherSubject(
    @Query('teacherId') teacherId: string,
    @Query('subjectId') subjectId: string,
    @Query('classId') classId?: string,
  ) {
    await this.teacherSubjectsService.removeTeacherSubject(
      parseInt(teacherId),
      parseInt(subjectId),
      classId ? parseInt(classId) : undefined,
    );
    return {
      success: true,
      message: 'Teacher-Subject assignment removed successfully',
    };
  }

  @Delete('teacher/:teacherId/all')
  async removeAllTeacherSubjects(@Param('teacherId') teacherId: string) {
    await this.teacherSubjectsService.removeAllTeacherSubjects(parseInt(teacherId));
    return {
      success: true,
      message: 'All teacher-subject assignments removed successfully',
    };
  }
}

