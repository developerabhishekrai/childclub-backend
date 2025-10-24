import { IsNotEmpty, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SubjectAssignmentDto {
  @IsNotEmpty()
  @IsNumber()
  subjectId: number;

  @IsOptional()
  @IsNumber()
  classId?: number;
}

export class AssignTeacherSubjectDto {
  @IsNotEmpty()
  @IsNumber()
  teacherId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubjectAssignmentDto)
  subjects: SubjectAssignmentDto[];
}

