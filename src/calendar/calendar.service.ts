import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, LessThanOrEqual, Between } from 'typeorm';
import { CalendarEvent, EventStatus } from './entities/calendar-event.entity';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarEvent)
    private calendarEventRepository: Repository<CalendarEvent>,
  ) {}

  async create(createEventDto: CreateCalendarEventDto, userId: number, schoolId: number): Promise<CalendarEvent> {
    const event = this.calendarEventRepository.create({
      title: createEventDto.title,
      description: createEventDto.description,
      eventType: createEventDto.eventType,
      startDate: new Date(createEventDto.startDate),
      endDate: createEventDto.endDate ? new Date(createEventDto.endDate) : null,
      allDay: createEventDto.allDay ? 1 : 0,
      location: createEventDto.location,
      color: createEventDto.color || '#007bff',
      priority: createEventDto.priority,
      attendees: createEventDto.attendees,
      isRecurring: createEventDto.isRecurring ? 1 : 0,
      recurringPattern: createEventDto.recurringPattern,
      recurringEndDate: createEventDto.recurringEndDate ? new Date(createEventDto.recurringEndDate) : null,
      schoolId,
      createdById: userId,
      isActive: 1,
    });

    return await this.calendarEventRepository.save(event);
  }

  async findAll(schoolId: number): Promise<CalendarEvent[]> {
    return await this.calendarEventRepository.find({
      where: { 
        schoolId,
        isActive: 1,
        status: EventStatus.ACTIVE
      },
      order: { startDate: 'ASC' },
      relations: ['createdBy'],
    });
  }

  async findUpcoming(schoolId: number, limit: number = 5): Promise<CalendarEvent[]> {
    const now = new Date();
    return await this.calendarEventRepository.find({
      where: { 
        schoolId,
        isActive: 1,
        status: EventStatus.ACTIVE
      },
      order: { startDate: 'ASC' },
      take: limit,
      relations: ['createdBy'],
    });
  }

  async findByDateRange(schoolId: number, startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    return await this.calendarEventRepository.find({
      where: { 
        schoolId,
        isActive: 1,
        status: EventStatus.ACTIVE
      },
      order: { startDate: 'ASC' },
      relations: ['createdBy'],
    });
  }

  async findOne(id: number, schoolId: number): Promise<CalendarEvent> {
    const event = await this.calendarEventRepository.findOne({
      where: { id, schoolId, isActive: 1 },
      relations: ['createdBy', 'school'],
    });

    if (!event) {
      throw new NotFoundException(`Calendar event with ID ${id} not found`);
    }

    return event;
  }

  async update(
    id: number, 
    updateEventDto: UpdateCalendarEventDto, 
    userId: number, 
    schoolId: number
  ): Promise<CalendarEvent> {
    const event = await this.findOne(id, schoolId);

    // Check if user has permission to update
    if (event.createdById !== userId) {
      // Allow school admin to update any event
      // This check can be enhanced based on user role
    }

    // Update fields with proper type conversion
    if (updateEventDto.title !== undefined) event.title = updateEventDto.title;
    if (updateEventDto.description !== undefined) event.description = updateEventDto.description;
    if (updateEventDto.eventType !== undefined) event.eventType = updateEventDto.eventType;
    if (updateEventDto.startDate !== undefined) event.startDate = new Date(updateEventDto.startDate);
    if (updateEventDto.endDate !== undefined) event.endDate = updateEventDto.endDate ? new Date(updateEventDto.endDate) : null;
    if (updateEventDto.allDay !== undefined) event.allDay = updateEventDto.allDay ? 1 : 0;
    if (updateEventDto.location !== undefined) event.location = updateEventDto.location;
    if (updateEventDto.color !== undefined) event.color = updateEventDto.color;
    if (updateEventDto.priority !== undefined) event.priority = updateEventDto.priority;
    if (updateEventDto.attendees !== undefined) event.attendees = updateEventDto.attendees;
    if (updateEventDto.isRecurring !== undefined) event.isRecurring = updateEventDto.isRecurring ? 1 : 0;
    if (updateEventDto.recurringPattern !== undefined) event.recurringPattern = updateEventDto.recurringPattern;
    if (updateEventDto.recurringEndDate !== undefined) event.recurringEndDate = updateEventDto.recurringEndDate ? new Date(updateEventDto.recurringEndDate) : null;

    return await this.calendarEventRepository.save(event);
  }

  async remove(id: number, userId: number, schoolId: number): Promise<void> {
    const event = await this.findOne(id, schoolId);

    // Soft delete
    event.isActive = 0;
    await this.calendarEventRepository.save(event);
  }

  async cancel(id: number, userId: number, schoolId: number): Promise<CalendarEvent> {
    const event = await this.findOne(id, schoolId);
    event.status = EventStatus.CANCELLED;
    return await this.calendarEventRepository.save(event);
  }

  async postpone(id: number, newDate: Date, userId: number, schoolId: number): Promise<CalendarEvent> {
    const event = await this.findOne(id, schoolId);
    event.status = EventStatus.POSTPONED;
    event.startDate = newDate;
    
    // Adjust end date if it exists
    if (event.endDate) {
      const duration = event.endDate.getTime() - new Date(event.startDate).getTime();
      event.endDate = new Date(newDate.getTime() + duration);
    }
    
    return await this.calendarEventRepository.save(event);
  }

  async countUpcoming(schoolId: number): Promise<number> {
    const now = new Date();
    return await this.calendarEventRepository.count({
      where: { 
        schoolId,
        isActive: 1,
        status: EventStatus.ACTIVE
      },
    });
  }
}

