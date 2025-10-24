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
exports.AttendanceController = void 0;
const common_1 = require("@nestjs/common");
const attendance_service_1 = require("./attendance.service");
const mark_attendance_dto_1 = require("./dto/mark-attendance.dto");
const update_attendance_dto_1 = require("./dto/update-attendance.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let AttendanceController = class AttendanceController {
    constructor(attendanceService) {
        this.attendanceService = attendanceService;
    }
    async markAttendance(markAttendanceDto, req) {
        return this.attendanceService.markAttendance(markAttendanceDto, req.user.id);
    }
    async getAttendanceByClass(classId, date) {
        return this.attendanceService.getAttendanceByClass(parseInt(classId), date);
    }
    async getAttendanceByStudent(studentId, startDate, endDate) {
        return this.attendanceService.getAttendanceByStudent(parseInt(studentId), startDate, endDate);
    }
    async getAttendanceStats(classId, startDate, endDate) {
        return this.attendanceService.getAttendanceStats(parseInt(classId), startDate, endDate);
    }
    async getStudentAttendanceStats(studentId, startDate, endDate) {
        return this.attendanceService.getStudentAttendanceStats(parseInt(studentId), startDate, endDate);
    }
    async updateAttendance(id, updateAttendanceDto) {
        return this.attendanceService.updateAttendance(parseInt(id), updateAttendanceDto);
    }
    async deleteAttendance(id) {
        await this.attendanceService.deleteAttendance(parseInt(id));
        return {
            success: true,
            message: 'Attendance record deleted successfully',
        };
    }
};
exports.AttendanceController = AttendanceController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mark_attendance_dto_1.MarkAttendanceDto, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "markAttendance", null);
__decorate([
    (0, common_1.Get)('class/:classId'),
    __param(0, (0, common_1.Param)('classId')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getAttendanceByClass", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    __param(0, (0, common_1.Param)('studentId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getAttendanceByStudent", null);
__decorate([
    (0, common_1.Get)('stats/class/:classId'),
    __param(0, (0, common_1.Param)('classId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getAttendanceStats", null);
__decorate([
    (0, common_1.Get)('stats/student/:studentId'),
    __param(0, (0, common_1.Param)('studentId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getStudentAttendanceStats", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_attendance_dto_1.UpdateAttendanceDto]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "updateAttendance", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "deleteAttendance", null);
exports.AttendanceController = AttendanceController = __decorate([
    (0, common_1.Controller)('attendance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [attendance_service_1.AttendanceService])
], AttendanceController);
//# sourceMappingURL=attendance.controller.js.map