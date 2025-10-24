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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarEvent = exports.RecurringPattern = exports.EventStatus = exports.EventPriority = exports.EventType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const school_entity_1 = require("../../schools/entities/school.entity");
var EventType;
(function (EventType) {
    EventType["ACADEMIC"] = "academic";
    EventType["EVENT"] = "event";
    EventType["ACTIVITY"] = "activity";
    EventType["CURRICULUM"] = "curriculum";
    EventType["EXAM"] = "exam";
    EventType["HOLIDAY"] = "holiday";
    EventType["MEETING"] = "meeting";
})(EventType || (exports.EventType = EventType = {}));
var EventPriority;
(function (EventPriority) {
    EventPriority["LOW"] = "low";
    EventPriority["MEDIUM"] = "medium";
    EventPriority["HIGH"] = "high";
})(EventPriority || (exports.EventPriority = EventPriority = {}));
var EventStatus;
(function (EventStatus) {
    EventStatus["ACTIVE"] = "active";
    EventStatus["CANCELLED"] = "cancelled";
    EventStatus["POSTPONED"] = "postponed";
})(EventStatus || (exports.EventStatus = EventStatus = {}));
var RecurringPattern;
(function (RecurringPattern) {
    RecurringPattern["DAILY"] = "daily";
    RecurringPattern["WEEKLY"] = "weekly";
    RecurringPattern["MONTHLY"] = "monthly";
    RecurringPattern["YEARLY"] = "yearly";
})(RecurringPattern || (exports.RecurringPattern = RecurringPattern = {}));
let CalendarEvent = class CalendarEvent {
};
exports.CalendarEvent = CalendarEvent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CalendarEvent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'title', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], CalendarEvent.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'text', nullable: true }),
    __metadata("design:type", String)
], CalendarEvent.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'eventType', type: 'enum', enum: EventType, default: EventType.EVENT }),
    __metadata("design:type", String)
], CalendarEvent.prototype, "eventType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'startDate', type: 'datetime' }),
    __metadata("design:type", Date)
], CalendarEvent.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'endDate', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], CalendarEvent.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'allDay', type: 'tinyint', default: 0 }),
    __metadata("design:type", Number)
], CalendarEvent.prototype, "allDay", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'location', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], CalendarEvent.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'color', type: 'varchar', length: 7, default: '#007bff' }),
    __metadata("design:type", String)
], CalendarEvent.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'priority', type: 'enum', enum: EventPriority, default: EventPriority.MEDIUM }),
    __metadata("design:type", String)
], CalendarEvent.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'attendees', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], CalendarEvent.prototype, "attendees", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'isRecurring', type: 'tinyint', default: 0 }),
    __metadata("design:type", Number)
], CalendarEvent.prototype, "isRecurring", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'recurringPattern', type: 'enum', enum: RecurringPattern, nullable: true }),
    __metadata("design:type", String)
], CalendarEvent.prototype, "recurringPattern", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'recurringEndDate', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], CalendarEvent.prototype, "recurringEndDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'schoolId', type: 'int' }),
    __metadata("design:type", Number)
], CalendarEvent.prototype, "schoolId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'createdById', type: 'int' }),
    __metadata("design:type", Number)
], CalendarEvent.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'enum', enum: EventStatus, default: EventStatus.ACTIVE }),
    __metadata("design:type", String)
], CalendarEvent.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'isActive', type: 'tinyint', default: 1 }),
    __metadata("design:type", Number)
], CalendarEvent.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'datetime', precision: 6 }),
    __metadata("design:type", Date)
], CalendarEvent.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'datetime', precision: 6 }),
    __metadata("design:type", Date)
], CalendarEvent.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => school_entity_1.School, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'schoolId' }),
    __metadata("design:type", school_entity_1.School)
], CalendarEvent.prototype, "school", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'createdById' }),
    __metadata("design:type", user_entity_1.User)
], CalendarEvent.prototype, "createdBy", void 0);
exports.CalendarEvent = CalendarEvent = __decorate([
    (0, typeorm_1.Entity)('calendar_events')
], CalendarEvent);
//# sourceMappingURL=calendar-event.entity.js.map