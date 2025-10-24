import { Controller, Get, Post, Body, Patch, Put, Param, Delete, UseGuards, Request, Res } from '@nestjs/common';
import { Response } from 'express';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post('register')
  async registerStudent(@Body() createStudentDto: CreateStudentDto) {
    // Public endpoint for student registration
    return this.studentsService.createStudent(createStudentDto, null);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createStudent(@Body() createStudentDto: CreateStudentDto, @Request() req) {
    // Ensure schoolId is set
    if (!createStudentDto.schoolId) {
      createStudentDto.schoolId = req.user.schoolId || 1; // Default to school ID 1 if not set
    }
    
    return this.studentsService.createStudent(createStudentDto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req) {
    try {
      // Get school ID from JWT token
      const schoolId = req.user.schoolId || req.user.id;
      console.log('[Students Controller] JWT User:', {
        userId: req.user.id,
        schoolId: req.user.schoolId,
        role: req.user.role,
        finalSchoolId: schoolId
      });
      
      return this.studentsService.findBySchoolId(schoolId);
    } catch (error) {
      console.error('[Students Controller] Error in findAll:', error);
      throw error;
    }
  }

  @Get('by-user/:userId')
  @UseGuards(JwtAuthGuard)
  async findByUserId(@Param('userId') userId: string) {
    return this.studentsService.findByUserId(parseInt(userId));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.studentsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(+id, updateStudentDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updatePut(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(+id, updateStudentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return this.studentsService.remove(+id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.studentsService.updateStatus(+id, body.status);
  }

  @Get('school/:schoolId')
  @UseGuards(JwtAuthGuard)
  async findBySchool(@Param('schoolId') schoolId: string) {
    return this.studentsService.findBySchool(+schoolId);
  }

  @Get('class/:classId')
  @UseGuards(JwtAuthGuard)
  async findByClass(@Param('classId') classId: string) {
    return this.studentsService.findByClass(+classId);
  }

  @Post(':id/reset-password')
  @UseGuards(JwtAuthGuard)
  async resetPassword(
    @Param('id') studentId: string,
    @Body('newPassword') newPassword: string,
    @Request() req,
  ) {
    console.log('Reset password request for student:', studentId);
    return this.studentsService.resetPassword(studentId, newPassword);
  }

  @Get('export/csv')
  @UseGuards(JwtAuthGuard)
  async exportToCSV(@Request() req, @Res() res: Response) {
    try {
      const schoolId = req.user.schoolId || req.user.id;
      console.log('[Students Controller] Exporting students for schoolId:', schoolId);
      
      const csv = await this.studentsService.exportToCSV(schoolId);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=students-${Date.now()}.csv`);
      res.send(csv);
    } catch (error) {
      console.error('[Students Controller] Error in exportToCSV:', error);
      res.status(500).json({ message: 'Failed to export students', error: error.message });
    }
  }
}
