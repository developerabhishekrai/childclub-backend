import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApproveSchoolDto {
  @ApiProperty({
    description: 'Optional comments for school approval',
    example: 'School meets all requirements and standards.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  comments?: string;
}


