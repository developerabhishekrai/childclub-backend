import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { FilterAssignmentDto } from './dto/filter-assignment.dto';

@Controller('assignments')
@UseGuards(JwtAuthGuard)
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  create(@Body() createAssignmentDto: CreateAssignmentDto, @Request() req) {
    const userId = req.user.id;
    const schoolId = req.user.schoolId;
    return this.assignmentsService.create(createAssignmentDto, userId, schoolId);
  }

  @Get()
  findAll(@Request() req, @Query() filters: FilterAssignmentDto) {
    const schoolId = req.user.schoolId;
    return this.assignmentsService.findAll(schoolId, filters);
  }

  @Get('by-class/:classId')
  findByClass(@Param('classId', ParseIntPipe) classId: number, @Request() req) {
    const schoolId = req.user.schoolId;
    return this.assignmentsService.getAssignmentsByClass(classId, schoolId);
  }

  @Get('by-student/:studentId')
  findByStudent(@Param('studentId', ParseIntPipe) studentId: number, @Request() req) {
    const schoolId = req.user.schoolId;
    return this.assignmentsService.getAssignmentsByStudent(studentId, schoolId);
  }

  @Get('by-teacher/:teacherId')
  findByTeacher(@Param('teacherId', ParseIntPipe) teacherId: number, @Request() req) {
    const schoolId = req.user.schoolId;
    return this.assignmentsService.getAssignmentsByTeacher(teacherId, schoolId);
  }

  @Get('by-creator/:creatorId')
  findByCreator(@Param('creatorId', ParseIntPipe) creatorId: number, @Request() req) {
    const schoolId = req.user.schoolId;
    return this.assignmentsService.getAssignmentsByCreator(creatorId, schoolId);
  }

  @Get('my-teacher-assignments')
  findMyTeacherAssignments(@Request() req) {
    const userId = req.user.id;
    const schoolId = req.user.schoolId;
    return this.assignmentsService.getAssignmentsForTeacherSpecificStudents(userId, schoolId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const schoolId = req.user.schoolId;
    return this.assignmentsService.findOne(id, schoolId);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAssignmentDto: UpdateAssignmentDto, @Request() req) {
    const schoolId = req.user.schoolId;
    return this.assignmentsService.update(id, updateAssignmentDto, schoolId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const schoolId = req.user.schoolId;
    return this.assignmentsService.remove(id, schoolId);
  }
}

