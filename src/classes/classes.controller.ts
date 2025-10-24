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
import { ClassesService, CreateClassDto, UpdateClassDto } from './classes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('classes')
@UseGuards(JwtAuthGuard)
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  async createClass(
    @Body() createClassDto: CreateClassDto,
    @Request() req,
  ) {
    const schoolId = req.user.schoolId || req.user.id;
    return this.classesService.createClass(createClassDto, schoolId);
  }

  @Get()
  async findAllClasses(
    @Request() req,
    @Query('schoolId') schoolId?: string,
  ) {
    const id = schoolId || req.user.schoolId || req.user.id;
    return this.classesService.findAllClasses(id);
  }

  @Get('stats')
  async getClassStats(@Request() req) {
    const schoolId = req.user.schoolId || req.user.id;
    return this.classesService.getClassStats(schoolId);
  }

  @Get('grade/:grade')
  async getClassesByGrade(
    @Param('grade') grade: string,
    @Request() req,
  ) {
    const schoolId = req.user.schoolId || req.user.id;
    return this.classesService.getClassesByGrade(schoolId, grade);
  }

  @Get(':id')
  async findClassById(@Param('id') id: string) {
    return this.classesService.findClassById(parseInt(id));
  }

  @Put(':id')
  async updateClass(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
  ) {
    return this.classesService.updateClass(parseInt(id), updateClassDto);
  }

  @Delete(':id')
  async deleteClass(@Param('id') id: string) {
    return this.classesService.deleteClass(parseInt(id));
  }

  @Post(':id/add-student/:studentId')
  async addStudentToClass(
    @Param('id') classId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.classesService.addStudentToClass(parseInt(classId), parseInt(studentId));
  }

  @Delete(':id/remove-student/:studentId')
  async removeStudentFromClass(
    @Param('id') classId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.classesService.removeStudentFromClass(parseInt(classId), parseInt(studentId));
  }
}
