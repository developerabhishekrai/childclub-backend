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
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('subjects')
@UseGuards(JwtAuthGuard)
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  async createSubject(
    @Body() createSubjectDto: CreateSubjectDto,
    @Request() req,
  ) {
    // Extract schoolId from JWT token
    const schoolId = req.user.schoolId || req.user.id;
    
    // Add schoolId to DTO
    const subjectData = {
      ...createSubjectDto,
      schoolId: schoolId.toString(),
    };
    
    return this.subjectsService.createSubject(subjectData);
  }

  @Get()
  async findAllSubjects(
    @Request() req,
    @Query('schoolId') schoolId?: string,
  ) {
    const id = schoolId || req.user.schoolId || req.user.id;
    return this.subjectsService.findAllSubjects(parseInt(id));
  }

  @Get('stats')
  async getSubjectStats(@Request() req) {
    const schoolId = req.user.schoolId || req.user.id;
    return this.subjectsService.getSubjectStats(schoolId);
  }

  @Get('grade/:gradeLevel')
  async findSubjectsByGrade(
    @Param('gradeLevel') gradeLevel: string,
    @Request() req,
  ) {
    const schoolId = req.user.schoolId || req.user.id;
    return this.subjectsService.findSubjectsByGrade(schoolId, gradeLevel);
  }

  @Get(':id')
  async findSubjectById(@Param('id') id: string) {
    return this.subjectsService.findSubjectById(parseInt(id));
  }

  @Put(':id')
  async updateSubject(
    @Param('id') id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    return this.subjectsService.updateSubject(parseInt(id), updateSubjectDto);
  }

  @Delete(':id')
  async deleteSubject(@Param('id') id: string) {
    await this.subjectsService.deleteSubject(parseInt(id));
    return {
      success: true,
      message: 'Subject deleted successfully',
    };
  }
}

