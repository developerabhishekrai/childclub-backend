import { IsOptional, IsString, IsEmail, IsDateString, IsEnum, IsArray, IsNumber } from 'class-validator';
import { TeacherStatus } from '../entities/teacher.entity';

export class UpdateTeacherDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;



  @IsOptional()
  @IsString()
  qualification?: string;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsString()
  experienceYears?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  designation?: string;

  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subjects?: string[];

  @IsOptional()
  @IsString()
  classId?: string | null;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  classIds?: number[];

  @IsOptional()
  @IsDateString()
  joiningDate?: string;

  @IsOptional()
  salary?: string | number;

  @IsOptional()
  @IsEnum(TeacherStatus)
  status?: TeacherStatus;
}
