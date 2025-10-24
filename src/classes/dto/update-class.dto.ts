import { IsString, IsOptional, IsNumber, IsEnum, IsArray, IsDateString } from 'class-validator';
import { ClassStatus } from '../entities/class.entity';

export class UpdateClassDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  grade?: string;

  @IsOptional()
  @IsString()
  section?: string;

  @IsOptional()
  @IsString()
  academicYear?: string;

  @IsOptional()
  @IsString()
  maxStudents?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subjects?: string[];

  @IsOptional()
  @IsString()
  syllabus?: string;

  @IsOptional()
  @IsString()
  rules?: string;

  @IsOptional()
  @IsNumber()
  classTeacherId?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  schedule?: string;

  @IsOptional()
  @IsString()
  roomNumber?: string;

  @IsOptional()
  @IsNumber()
  schoolId?: number;

  @IsOptional()
  @IsEnum(ClassStatus)
  status?: ClassStatus;
}

