import { Repository } from 'typeorm';
import { CalendarEvent } from './entities/calendar-event.entity';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
export declare class CalendarService {
    private calendarEventRepository;
    constructor(calendarEventRepository: Repository<CalendarEvent>);
    create(createEventDto: CreateCalendarEventDto, userId: number, schoolId: number): Promise<CalendarEvent>;
    findAll(schoolId: number): Promise<CalendarEvent[]>;
    findUpcoming(schoolId: number, limit?: number): Promise<CalendarEvent[]>;
    findByDateRange(schoolId: number, startDate: Date, endDate: Date): Promise<CalendarEvent[]>;
    findOne(id: number, schoolId: number): Promise<CalendarEvent>;
    update(id: number, updateEventDto: UpdateCalendarEventDto, userId: number, schoolId: number): Promise<CalendarEvent>;
    remove(id: number, userId: number, schoolId: number): Promise<void>;
    cancel(id: number, userId: number, schoolId: number): Promise<CalendarEvent>;
    postpone(id: number, newDate: Date, userId: number, schoolId: number): Promise<CalendarEvent>;
    countUpcoming(schoolId: number): Promise<number>;
}
