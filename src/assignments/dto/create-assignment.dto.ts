import { IsString, IsNotEmpty, IsDateString, IsInt, IsBoolean, IsOptional, IsArray, IsEnum, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAssignmentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  priority: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsDateString()
  @IsNotEmpty()
  dueDate: string;

  @IsInt()
  @Min(1)
  @Max(1000)
  @Type(() => Number)
  maxScore: number;

  @IsString()
  @IsOptional()
  instructions?: string;

  @IsString()
  @IsOptional()
  rubric?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;

  @IsString()
  @IsOptional()
  recurringPattern?: string;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  assignedClasses?: number[];

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  assignedStudents?: number[];

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  assignedTeachers?: number[];
}

