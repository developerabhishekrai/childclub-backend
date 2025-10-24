import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsEnum, IsBoolean, IsDateString, Validate, IsNumber, IsUrl, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';
import { Match } from '../decorators/match.decorator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User mobile number',
    example: '+1234567890',
    required: false,
  })
  @IsString()
  @IsOptional()
  mobile?: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Confirm password',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Match('password')
  confirmPassword: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.STUDENT,
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @ApiProperty({
    description: 'User date of birth',
    example: '2000-01-01',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiProperty({
    description: 'User gender',
    example: 'male',
    required: false,
  })
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiProperty({
    description: 'School name',
    example: 'ABC School',
    required: false,
  })
  @IsString()
  @IsOptional()
  schoolName?: string;

  @ApiProperty({
    description: 'Student grade',
    example: '10th',
    required: false,
  })
  @IsString()
  @IsOptional()
  grade?: string;

  @ApiProperty({
    description: 'Parent name',
    example: 'John Doe Sr.',
    required: false,
  })
  @IsString()
  @IsOptional()
  parentName?: string;

  @ApiProperty({
    description: 'Parent email',
    example: 'parent@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  parentEmail?: string;

  @ApiProperty({
    description: 'Parent mobile',
    example: '+1234567890',
    required: false,
  })
  @IsString()
  @IsOptional()
  parentMobile?: string;

  @ApiProperty({
    description: 'Emergency contact',
    example: '+1234567890',
    required: false,
  })
  @IsString()
  @IsOptional()
  emergencyContact?: string;

  @ApiProperty({
    description: 'Medical information',
    example: 'No allergies',
    required: false,
  })
  @IsString()
  @IsOptional()
  medicalInfo?: string;

  @ApiProperty({
    description: 'Terms accepted',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  termsAccepted?: boolean;

  @ApiProperty({
    description: 'User address',
    example: '123 Main St',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'User city',
    example: 'New York',
    required: false,
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({
    description: 'User state',
    example: 'NY',
    required: false,
  })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({
    description: 'User country',
    example: 'USA',
    required: false,
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({
    description: 'User postal code',
    example: '10001',
    required: false,
  })
  @IsString()
  @IsOptional()
  postalCode?: string;

  // School Administrator specific fields
  @ApiProperty({
    description: 'School type',
    example: 'primary',
    required: false,
  })
  @IsString()
  @IsOptional()
  schoolType?: string;

  @ApiProperty({
    description: 'School address',
    example: '123 School St',
    required: false,
  })
  @IsString()
  @IsOptional()
  schoolAddress?: string;

  @ApiProperty({
    description: 'School city',
    example: 'New York',
    required: false,
  })
  @IsString()
  @IsOptional()
  schoolCity?: string;

  @ApiProperty({
    description: 'School state',
    example: 'NY',
    required: false,
  })
  @IsString()
  @IsOptional()
  schoolState?: string;

  @ApiProperty({
    description: 'School country',
    example: 'USA',
    required: false,
  })
  @IsString()
  @IsOptional()
  schoolCountry?: string;

  @ApiProperty({
    description: 'School postal code',
    example: '10001',
    required: false,
  })
  @IsString()
  @IsOptional()
  schoolPostalCode?: string;

  @ApiProperty({
    description: 'School phone',
    example: '+1234567890',
    required: false,
  })
  @IsString()
  @IsOptional()
  schoolPhone?: string;

  @ApiProperty({
    description: 'School email',
    example: 'school@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  schoolEmail?: string;

  @ApiProperty({
    description: 'School website',
    example: 'https://school.com',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  schoolWebsite?: string;

  @ApiProperty({
    description: 'Admin position',
    example: 'Principal',
    required: false,
  })
  @IsString()
  @IsOptional()
  adminPosition?: string;

  @ApiProperty({
    description: 'Years of experience',
    example: '5 or 0-2 or 5+',
    required: false,
  })
  @IsString()
  @IsOptional()
  yearsOfExperience?: string;

  @ApiProperty({
    description: 'Education level',
    example: 'Masters',
    required: false,
  })
  @IsString()
  @IsOptional()
  educationLevel?: string;

  @ApiProperty({
    description: 'Certifications',
    example: 'Teaching License, Admin Certificate',
    required: false,
  })
  @IsString()
  @IsOptional()
  certifications?: string;
}

