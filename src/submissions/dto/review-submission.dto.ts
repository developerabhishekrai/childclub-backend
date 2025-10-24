import { IsNotEmpty, IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { SubmissionStatus } from '../entities/submission.entity';

export class ReviewSubmissionDto {
  @IsNotEmpty()
  @IsEnum(SubmissionStatus)
  status: SubmissionStatus;

  @IsOptional()
  @IsNumber()
  grade?: number;

  @IsOptional()
  @IsString()
  feedback?: string;

  @IsOptional()
  @IsString()
  teacherNotes?: string;
}

