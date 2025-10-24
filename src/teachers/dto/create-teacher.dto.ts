import { IsString, IsEmail, IsOptional, IsDateString, IsNumber, IsEnum, MinLength, IsArray } from 'class-validator';
import { TeacherStatus } from '../entities/teacher.entity';

export class CreateTeacherDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsString()
  @MinLength(6)
  password: string;

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



  @IsString()
  qualification: string;

  @IsString()
  experience: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subjects?: string[];

  @IsOptional()
  @IsString()
  classId?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  classIds?: number[];

  @IsOptional()
  @IsDateString()
  joiningDate?: string;

  @IsOptional()
  @IsString()
  salary?: string;

  @IsNumber()
  schoolId: number;

  @IsOptional()
  @IsEnum(TeacherStatus)
  status?: TeacherStatus;
}
