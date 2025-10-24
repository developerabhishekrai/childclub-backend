import { IsOptional, IsString, IsEmail, IsUrl, IsNumber, MaxLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SchoolType } from '../entities/school.entity';

export class UpdateSchoolDto {
  @ApiProperty({ description: 'School name', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @ApiProperty({ description: 'School description', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ description: 'School type', enum: SchoolType, required: false })
  @IsOptional()
  @IsEnum(SchoolType)
  type?: SchoolType;

  @ApiProperty({ description: 'School address', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  address?: string;

  @ApiProperty({ description: 'City', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiProperty({ description: 'State', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @ApiProperty({ description: 'Country', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @ApiProperty({ description: 'Postal code', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  postalCode?: string;

  @ApiProperty({ description: 'Phone number', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiProperty({ description: 'Website URL', required: false })
  @IsOptional()
  @IsUrl()
  @MaxLength(100)
  website?: string;

  @ApiProperty({ description: 'Email address', required: false })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @ApiProperty({ description: 'Established year', required: false })
  @IsOptional()
  @IsNumber()
  establishedYear?: number;

  @ApiProperty({ description: 'Total students', required: false })
  @IsOptional()
  @IsNumber()
  totalStudents?: number;

  @ApiProperty({ description: 'Total teachers', required: false })
  @IsOptional()
  @IsNumber()
  totalTeachers?: number;

  @ApiProperty({ description: 'Total classes', required: false })
  @IsOptional()
  @IsNumber()
  totalClasses?: number;

  @ApiProperty({ description: 'School facilities', required: false })
  @IsOptional()
  @IsString()
  facilities?: string;

  @ApiProperty({ description: 'School achievements', required: false })
  @IsOptional()
  @IsString()
  achievements?: string;

  @ApiProperty({ description: 'School vision', required: false })
  @IsOptional()
  @IsString()
  vision?: string;

  @ApiProperty({ description: 'School mission', required: false })
  @IsOptional()
  @IsString()
  mission?: string;
}


