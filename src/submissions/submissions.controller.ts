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
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('submissions')
@UseGuards(JwtAuthGuard)
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  async createSubmission(
    @Body() createSubmissionDto: CreateSubmissionDto,
    @Request() req,
  ) {
    return this.submissionsService.createSubmission(createSubmissionDto);
  }

  // Specific routes must come BEFORE parameterized routes like :id
  @Get('teacher/my-submissions')
  async findMySubmissions(@Request() req) {
    console.log('[Controller] Getting submissions for teacher:', req.user.id);
    return this.submissionsService.findSubmissionsByTeacher(req.user.id);
  }

  @Get('task/:taskId')
  async findSubmissionsByTask(@Param('taskId') taskId: string) {
    return this.submissionsService.findSubmissionsByTask(parseInt(taskId));
  }

  @Get('student/:studentId')
  async findSubmissionsByStudent(@Param('studentId') studentId: string) {
    return this.submissionsService.findSubmissionsByStudent(parseInt(studentId));
  }

  @Get('class/:classId')
  async findSubmissionsByClass(@Param('classId') classId: string) {
    return this.submissionsService.findSubmissionsByClass(parseInt(classId));
  }

  @Get('school/:schoolId')
  async findSubmissionsBySchool(@Param('schoolId') schoolId: string) {
    return this.submissionsService.findSubmissionsBySchool(parseInt(schoolId));
  }

  @Get('stats/:classId')
  async getSubmissionStats(@Param('classId') classId: string) {
    return this.submissionsService.getSubmissionStats(parseInt(classId));
  }

  @Get(':id')
  async findSubmissionById(@Param('id') id: string) {
    return this.submissionsService.findSubmissionById(parseInt(id));
  }

  @Put(':id')
  async updateSubmission(
    @Param('id') id: string,
    @Body() updateSubmissionDto: UpdateSubmissionDto,
  ) {
    return this.submissionsService.updateSubmission(parseInt(id), updateSubmissionDto);
  }

  @Put(':id/review')
  async reviewSubmission(
    @Param('id') id: string,
    @Body() reviewSubmissionDto: ReviewSubmissionDto,
    @Request() req,
  ) {
    return this.submissionsService.reviewSubmission(parseInt(id), reviewSubmissionDto, req.user.id);
  }

  @Delete(':id')
  async deleteSubmission(@Param('id') id: string) {
    await this.submissionsService.deleteSubmission(parseInt(id));
    return {
      success: true,
      message: 'Submission deleted successfully',
    };
  }
}

