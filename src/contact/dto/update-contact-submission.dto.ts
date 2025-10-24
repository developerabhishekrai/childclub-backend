import { IsString, IsEnum, IsOptional } from 'class-validator';

export class UpdateContactSubmissionDto {
  @IsString()
  @IsEnum(['pending', 'in_progress', 'resolved', 'closed'])
  @IsOptional()
  status?: string;
}

