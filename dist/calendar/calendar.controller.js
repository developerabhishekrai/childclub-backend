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
exports.CalendarController = void 0;
const common_1 = require("@nestjs/common");
const calendar_service_1 = require("./calendar.service");
const create_calendar_event_dto_1 = require("./dto/create-calendar-event.dto");
const update_calendar_event_dto_1 = require("./dto/update-calendar-event.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let CalendarController = class CalendarController {
    constructor(calendarService) {
        this.calendarService = calendarService;
    }
    async create(createEventDto, req) {
        const userId = req.user.userId;
        const schoolId = req.user.schoolId;
        return await this.calendarService.create(createEventDto, userId, schoolId);
    }
    async findAll(req) {
        const schoolId = req.user.schoolId;
        return await this.calendarService.findAll(schoolId);
    }
    async findUpcoming(req, limit) {
        const schoolId = req.user.schoolId;
        const limitNum = limit ? parseInt(limit) : 5;
        return await this.calendarService.findUpcoming(schoolId, limitNum);
    }
    async findByDateRange(req, startDate, endDate) {
        const schoolId = req.user.schoolId;
        return await this.calendarService.findByDateRange(schoolId, new Date(startDate), new Date(endDate));
    }
    async countUpcoming(req) {
        const schoolId = req.user.schoolId;
        const count = await this.calendarService.countUpcoming(schoolId);
        return { count };
    }
    async findOne(id, req) {
        const schoolId = req.user.schoolId;
        return await this.calendarService.findOne(id, schoolId);
    }
    async update(id, updateEventDto, req) {
        const userId = req.user.userId;
        const schoolId = req.user.schoolId;
        return await this.calendarService.update(id, updateEventDto, userId, schoolId);
    }
    async remove(id, req) {
        const userId = req.user.userId;
        const schoolId = req.user.schoolId;
        await this.calendarService.remove(id, userId, schoolId);
        return { message: 'Event deleted successfully' };
    }
    async cancel(id, req) {
        const userId = req.user.userId;
        const schoolId = req.user.schoolId;
        return await this.calendarService.cancel(id, userId, schoolId);
    }
    async postpone(id, newDate, req) {
        const userId = req.user.userId;
        const schoolId = req.user.schoolId;
        return await this.calendarService.postpone(id, new Date(newDate), userId, schoolId);
    }
};
exports.CalendarController = CalendarController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_calendar_event_dto_1.CreateCalendarEventDto, Object]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('upcoming'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "findUpcoming", null);
__decorate([
    (0, common_1.Get)('range'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "findByDateRange", null);
__decorate([
    (0, common_1.Get)('count'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "countUpcoming", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_calendar_event_dto_1.UpdateCalendarEventDto, Object]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "cancel", null);
__decorate([
    (0, common_1.Patch)(':id/postpone'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('newDate')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "postpone", null);
exports.CalendarController = CalendarController = __decorate([
    (0, common_1.Controller)('calendar'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [calendar_service_1.CalendarService])
], CalendarController);
//# sourceMappingURL=calendar.controller.js.map