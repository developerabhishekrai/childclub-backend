import { CalendarService } from './calendar.service';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
export declare class CalendarController {
    private readonly calendarService;
    constructor(calendarService: CalendarService);
    create(createEventDto: CreateCalendarEventDto, req: any): Promise<import("./entities/calendar-event.entity").CalendarEvent>;
    findAll(req: any): Promise<import("./entities/calendar-event.entity").CalendarEvent[]>;
    findUpcoming(req: any, limit?: string): Promise<import("./entities/calendar-event.entity").CalendarEvent[]>;
    findByDateRange(req: any, startDate: string, endDate: string): Promise<import("./entities/calendar-event.entity").CalendarEvent[]>;
    countUpcoming(req: any): Promise<{
        count: number;
    }>;
    findOne(id: number, req: any): Promise<import("./entities/calendar-event.entity").CalendarEvent>;
    update(id: number, updateEventDto: UpdateCalendarEventDto, req: any): Promise<import("./entities/calendar-event.entity").CalendarEvent>;
    remove(id: number, req: any): Promise<{
        message: string;
    }>;
    cancel(id: number, req: any): Promise<import("./entities/calendar-event.entity").CalendarEvent>;
    postpone(id: number, newDate: string, req: any): Promise<import("./entities/calendar-event.entity").CalendarEvent>;
}
