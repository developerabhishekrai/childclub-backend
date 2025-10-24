import { IsString, IsOptional, IsNumber, IsNumberString, IsEnum, IsArray, IsDateString, IsBoolean } from 'class-validator';
import { TaskType, TaskPriority, TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;



  @IsEnum(TaskType)
  type: TaskType;

  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @IsDateString()
  dueDate: string;

  @IsOptional()
  @IsString()
  maxScore?: string;

  @IsOptional()
  @IsString()
  passingScore?: string;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsOptional()
  @IsString()
  rubric?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @IsOptional()
  @IsString()
  recurringPattern?: string;

  @IsOptional()
  @IsNumber()
  classId?: number;

  @IsOptional()
  @IsArray()
  assignedClasses?: string[];

  @IsOptional()
  @IsArray()
  assignedStudents?: string[];

  @IsOptional()
  @IsArray()
  assignedTeachers?: string[];

  @IsNumber()
  schoolId: number;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
