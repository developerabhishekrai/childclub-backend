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
exports.CreateCalendarEventDto = void 0;
const class_validator_1 = require("class-validator");
const calendar_event_entity_1 = require("../entities/calendar-event.entity");
class CreateCalendarEventDto {
}
exports.CreateCalendarEventDto = CreateCalendarEventDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCalendarEventDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCalendarEventDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(calendar_event_entity_1.EventType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCalendarEventDto.prototype, "eventType", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCalendarEventDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCalendarEventDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateCalendarEventDto.prototype, "allDay", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCalendarEventDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCalendarEventDto.prototype, "color", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(calendar_event_entity_1.EventPriority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCalendarEventDto.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateCalendarEventDto.prototype, "attendees", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateCalendarEventDto.prototype, "isRecurring", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(calendar_event_entity_1.RecurringPattern),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCalendarEventDto.prototype, "recurringPattern", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCalendarEventDto.prototype, "recurringEndDate", void 0);
//# sourceMappingURL=create-calendar-event.dto.js.map