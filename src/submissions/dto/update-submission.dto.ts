import { IsOptional, IsString, IsEnum, IsArray, IsNumber } from 'class-validator';
import { SubmissionStatus } from '../entities/submission.entity';

export class UpdateSubmissionDto {
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

