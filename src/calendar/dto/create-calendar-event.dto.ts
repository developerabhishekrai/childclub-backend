import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsBoolean, IsArray, IsObject } from 'class-validator';
import { EventType, EventPriority, RecurringPattern } from '../entities/calendar-event.entity';

export class CreateCalendarEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(EventType)
  @IsOptional()
  eventType?: EventType;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsOptional()
  allDay?: boolean | number;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsEnum(EventPriority)
  @IsOptional()
  priority?: EventPriority;

  @IsArray()
  @IsOptional()
  attendees?: any[];

  @IsOptional()
  isRecurring?: boolean | number;

  @IsEnum(RecurringPattern)
  @IsOptional()
  recurringPattern?: RecurringPattern;

  @IsDateString()
  @IsOptional()
  recurringEndDate?: string;
}

