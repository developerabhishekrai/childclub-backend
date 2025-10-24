import { IsOptional, IsInt, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum FilterByTarget {
  CLASS = 'class',
  STUDENT = 'student',
  TEACHER = 'teacher',
}

export class FilterAssignmentDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  schoolId?: number;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsEnum(FilterByTarget)
  targetType?: FilterByTarget;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  targetId?: number;
}

