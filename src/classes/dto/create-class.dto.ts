import { IsString, IsOptional, IsNumber, IsEnum, IsArray, IsDateString } from 'class-validator';
import { ClassStatus } from '../entities/class.entity';

export class CreateClassDto {
  @IsString()
  name: string;

  @IsString()
  grade: string;

  @IsString()
  section: string;



  @IsString()
  academicYear: string;

  @IsString()
  maxStudents: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  subjects: string[];

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

  @IsNumber()
  schoolId: number;

  @IsOptional()
  @IsEnum(ClassStatus)
  status?: ClassStatus;
}
