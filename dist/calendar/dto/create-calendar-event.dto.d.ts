import { EventType, EventPriority, RecurringPattern } from '../entities/calendar-event.entity';
export declare class CreateCalendarEventDto {
    title: string;
    description?: string;
    eventType?: EventType;
    startDate: string;
    endDate?: string;
    allDay?: boolean | number;
    location?: string;
    color?: string;
    priority?: EventPriority;
    attendees?: any[];
    isRecurring?: boolean | number;
    recurringPattern?: RecurringPattern;
    recurringEndDate?: string;
}
