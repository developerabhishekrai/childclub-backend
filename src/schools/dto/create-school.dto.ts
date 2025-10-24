import { IsNotEmpty, IsString, IsEmail, IsEnum, IsOptional, IsInt, MaxLength, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SchoolType } from '../entities/school.entity';

export class CreateSchoolDto {
  @ApiProperty({
    description: 'School name',
    example: 'Kendriya Vidyalaya Deoria',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiProperty({
    description: 'School description',
    example: 'A prestigious government school providing quality education',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    description: 'School type',
    enum: SchoolType,
    example: SchoolType.PRIMARY,
  })
  @IsEnum(SchoolType)
  type: SchoolType;

  @ApiProperty({
    description: 'School address',
    example: 'Vill: Olipatti, P.o: Pathardewa',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  address: string;

  @ApiProperty({
    description: 'City',
    example: 'Deoria',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  city: string;

  @ApiProperty({
    description: 'State',
    example: 'Uttar Pradesh',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  state: string;

  @ApiProperty({
    description: 'Country',
    example: 'India',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  country: string;

  @ApiProperty({
    description: 'Postal code',
    example: '274404',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  postalCode: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+91-8858724547',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiProperty({
    description: 'Email address',
    example: 'kv.deoria@kvs.gov.in',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @ApiProperty({
    description: 'Website URL',
    example: 'https://kvdeoria.edu.in',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(100)
  website?: string;

  @ApiProperty({
    description: 'Established year',
    example: 1995,
    required: false,
  })
  @IsOptional()
  @IsInt()
  establishedYear?: number;

  @ApiProperty({
    description: 'Total students',
    example: 1200,
    required: false,
  })
  @IsOptional()
  @IsInt()
  totalStudents?: number;

  @ApiProperty({
    description: 'Total teachers',
    example: 45,
    required: false,
  })
  @IsOptional()
  @IsInt()
  totalTeachers?: number;

  @ApiProperty({
    description: 'Total classes',
    example: 24,
    required: false,
  })
  @IsOptional()
  @IsInt()
  totalClasses?: number;

  @ApiProperty({
    description: 'School facilities',
    example: 'Library, Computer Lab, Science Lab, Sports Ground',
    required: false,
  })
  @IsOptional()
  @IsString()
  facilities?: string;

  @ApiProperty({
    description: 'School vision',
    example: 'To provide excellence in education and character building',
    required: false,
  })
  @IsOptional()
  @IsString()
  vision?: string;

  @ApiProperty({
    description: 'School mission',
    example: 'Empowering students with knowledge, skills and values',
    required: false,
  })
  @IsOptional()
  @IsString()
  mission?: string;
}


