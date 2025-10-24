import { IsNotEmpty, IsString, IsOptional, IsNumber, IsEnum, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AttendanceStatus } from '../entities/attendance.entity';

export class StudentAttendanceDto {
  @IsNotEmpty()
  @IsNumber()
  studentId: number;

  @IsNotEmpty()
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsString()
  checkInTime?: string;

  @IsOptional()
  @IsString()
  mood?: string;

  @IsOptional()
  @IsNumber()
  temperature?: number;
}

export class MarkAttendanceDto {
  @IsNotEmpty()
  @IsNumber()
  classId: number;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentAttendanceDto)
  attendance: StudentAttendanceDto[];
}

