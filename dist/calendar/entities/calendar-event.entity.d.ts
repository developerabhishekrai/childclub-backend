import { User } from '../../users/entities/user.entity';
import { School } from '../../schools/entities/school.entity';
export declare enum EventType {
    ACADEMIC = "academic",
    EVENT = "event",
    ACTIVITY = "activity",
    CURRICULUM = "curriculum",
    EXAM = "exam",
    HOLIDAY = "holiday",
    MEETING = "meeting"
}
export declare enum EventPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high"
}
export declare enum EventStatus {
    ACTIVE = "active",
    CANCELLED = "cancelled",
    POSTPONED = "postponed"
}
export declare enum RecurringPattern {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    YEARLY = "yearly"
}
export declare class CalendarEvent {
    id: number;
    title: string;
    description: string;
    eventType: EventType;
    startDate: Date;
    endDate: Date;
    allDay: number;
    location: string;
    color: string;
    priority: EventPriority;
    attendees: any;
    isRecurring: number;
    recurringPattern: RecurringPattern;
    recurringEndDate: Date;
    schoolId: number;
    createdById: number;
    status: EventStatus;
    isActive: number;
    createdAt: Date;
    updatedAt: Date;
    school: School;
    createdBy: User;
}
