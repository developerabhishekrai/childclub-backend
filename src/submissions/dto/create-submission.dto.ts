import { IsNotEmpty, IsString, IsOptional, IsNumber, IsEnum, IsArray } from 'class-validator';
import { SubmissionStatus } from '../entities/submission.entity';

export class CreateSubmissionDto {
  @IsNotEmpty()
  @IsNumber()
  taskId: number;

  @IsNotEmpty()
  @IsNumber()
  studentId: number;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  attachments?: any[];

  @IsOptional()
  @IsEnum(SubmissionStatus)
  status?: SubmissionStatus;

  @IsOptional()
  @IsString()
  lateReason?: string;
}

