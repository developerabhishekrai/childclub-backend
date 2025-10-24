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
import { TasksService, CreateTaskDto, UpdateTaskDto } from './tasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TaskStatus } from './entities/task.entity';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Request() req,
  ) {
    const schoolId = req.user.schoolId || req.user.id;
    return this.tasksService.createTask(createTaskDto, schoolId);
  }

  @Get()
  async findAllTasks(
    @Request() req,
    @Query('schoolId') schoolId?: string,
  ) {
    const id = schoolId || req.user.schoolId || req.user.id;
    return this.tasksService.findAllTasks(id);
  }

  @Get('stats')
  async getTaskStats(@Request() req) {
    const schoolId = req.user.schoolId || req.user.id;
    return this.tasksService.getTaskStats(schoolId);
  }

  @Get('overdue')
  async getOverdueTasks(@Request() req) {
    const schoolId = req.user.schoolId || req.user.id;
    return this.tasksService.getOverdueTasks(schoolId);
  }

  @Get('class/:classId')
  async getTasksByClass(@Param('classId') classId: string) {
    return this.tasksService.getTasksByClass(classId);
  }

  @Get('student/:studentId')
  async getTasksByStudent(@Param('studentId') studentId: string) {
    return this.tasksService.getTasksByStudent(studentId);
  }

  @Get('teacher/:teacherId')
  async getTasksByTeacher(@Param('teacherId') teacherId: string) {
    return this.tasksService.getTasksByTeacher(teacherId);
  }

  @Get(':id')
  async findTaskById(@Param('id') id: string) {
    return this.tasksService.findTaskById(id);
  }

  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Put(':id/status/:status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Param('status') status: TaskStatus,
  ) {
    return this.tasksService.updateTaskStatus(id, status);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }
}

