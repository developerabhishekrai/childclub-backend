"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const calendar_event_entity_1 = require("./entities/calendar-event.entity");
let CalendarService = class CalendarService {
    constructor(calendarEventRepository) {
        this.calendarEventRepository = calendarEventRepository;
    }
    async create(createEventDto, userId, schoolId) {
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
    async findAll(schoolId) {
        return await this.calendarEventRepository.find({
            where: {
                schoolId,
                isActive: 1,
                status: calendar_event_entity_1.EventStatus.ACTIVE
            },
            order: { startDate: 'ASC' },
            relations: ['createdBy'],
        });
    }
    async findUpcoming(schoolId, limit = 5) {
        const now = new Date();
        return await this.calendarEventRepository.find({
            where: {
                schoolId,
                isActive: 1,
                status: calendar_event_entity_1.EventStatus.ACTIVE
            },
            order: { startDate: 'ASC' },
            take: limit,
            relations: ['createdBy'],
        });
    }
    async findByDateRange(schoolId, startDate, endDate) {
        return await this.calendarEventRepository.find({
            where: {
                schoolId,
                isActive: 1,
                status: calendar_event_entity_1.EventStatus.ACTIVE
            },
            order: { startDate: 'ASC' },
            relations: ['createdBy'],
        });
    }
    async findOne(id, schoolId) {
        const event = await this.calendarEventRepository.findOne({
            where: { id, schoolId, isActive: 1 },
            relations: ['createdBy', 'school'],
        });
        if (!event) {
            throw new common_1.NotFoundException(`Calendar event with ID ${id} not found`);
        }
        return event;
    }
    async update(id, updateEventDto, userId, schoolId) {
        const event = await this.findOne(id, schoolId);
        if (event.createdById !== userId) {
        }
        if (updateEventDto.title !== undefined)
            event.title = updateEventDto.title;
        if (updateEventDto.description !== undefined)
            event.description = updateEventDto.description;
        if (updateEventDto.eventType !== undefined)
            event.eventType = updateEventDto.eventType;
        if (updateEventDto.startDate !== undefined)
            event.startDate = new Date(updateEventDto.startDate);
        if (updateEventDto.endDate !== undefined)
            event.endDate = updateEventDto.endDate ? new Date(updateEventDto.endDate) : null;
        if (updateEventDto.allDay !== undefined)
            event.allDay = updateEventDto.allDay ? 1 : 0;
        if (updateEventDto.location !== undefined)
            event.location = updateEventDto.location;
        if (updateEventDto.color !== undefined)
            event.color = updateEventDto.color;
        if (updateEventDto.priority !== undefined)
            event.priority = updateEventDto.priority;
        if (updateEventDto.attendees !== undefined)
            event.attendees = updateEventDto.attendees;
        if (updateEventDto.isRecurring !== undefined)
            event.isRecurring = updateEventDto.isRecurring ? 1 : 0;
        if (updateEventDto.recurringPattern !== undefined)
            event.recurringPattern = updateEventDto.recurringPattern;
        if (updateEventDto.recurringEndDate !== undefined)
            event.recurringEndDate = updateEventDto.recurringEndDate ? new Date(updateEventDto.recurringEndDate) : null;
        return await this.calendarEventRepository.save(event);
    }
    async remove(id, userId, schoolId) {
        const event = await this.findOne(id, schoolId);
        event.isActive = 0;
        await this.calendarEventRepository.save(event);
    }
    async cancel(id, userId, schoolId) {
        const event = await this.findOne(id, schoolId);
        event.status = calendar_event_entity_1.EventStatus.CANCELLED;
        return await this.calendarEventRepository.save(event);
    }
    async postpone(id, newDate, userId, schoolId) {
        const event = await this.findOne(id, schoolId);
        event.status = calendar_event_entity_1.EventStatus.POSTPONED;
        event.startDate = newDate;
        if (event.endDate) {
            const duration = event.endDate.getTime() - new Date(event.startDate).getTime();
            event.endDate = new Date(newDate.getTime() + duration);
        }
        return await this.calendarEventRepository.save(event);
    }
    async countUpcoming(schoolId) {
        const now = new Date();
        return await this.calendarEventRepository.count({
            where: {
                schoolId,
                isActive: 1,
                status: calendar_event_entity_1.EventStatus.ACTIVE
            },
        });
    }
};
exports.CalendarService = CalendarService;
exports.CalendarService = CalendarService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(calendar_event_entity_1.CalendarEvent)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CalendarService);
//# sourceMappingURL=calendar.service.js.map