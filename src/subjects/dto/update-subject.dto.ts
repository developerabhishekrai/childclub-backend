import { IsOptional, IsString, IsNumber, IsEnum, IsBoolean } from 'class-validator';
import { SubjectStatus } from '../entities/subject.entity';

export class UpdateSubjectDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  gradeLevel?: string;

  @IsOptional()
  @IsNumber()
  totalMarks?: number;

  @IsOptional()
  @IsNumber()
  passingMarks?: number;

  @IsOptional()
  @IsBoolean()
  isElective?: boolean;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsEnum(SubjectStatus)
  status?: SubjectStatus;
}

