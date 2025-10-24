import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RejectSchoolDto {
  @ApiProperty({
    description: 'Reason for school rejection',
    example: 'School does not meet minimum infrastructure requirements.',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  reason: string;
}


