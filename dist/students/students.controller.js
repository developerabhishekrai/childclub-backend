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
exports.StudentsController = void 0;
const common_1 = require("@nestjs/common");
const students_service_1 = require("./students.service");
const create_student_dto_1 = require("./dto/create-student.dto");
const update_student_dto_1 = require("./dto/update-student.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let StudentsController = class StudentsController {
    constructor(studentsService) {
        this.studentsService = studentsService;
    }
    async registerStudent(createStudentDto) {
        return this.studentsService.createStudent(createStudentDto, null);
    }
    async createStudent(createStudentDto, req) {
        if (!createStudentDto.schoolId) {
            createStudentDto.schoolId = req.user.schoolId || 1;
        }
        return this.studentsService.createStudent(createStudentDto, req.user.id);
    }
    async findAll(req) {
        try {
            const schoolId = req.user.schoolId || req.user.id;
            console.log('[Students Controller] JWT User:', {
                userId: req.user.id,
                schoolId: req.user.schoolId,
                role: req.user.role,
                finalSchoolId: schoolId
            });
            return this.studentsService.findBySchoolId(schoolId);
        }
        catch (error) {
            console.error('[Students Controller] Error in findAll:', error);
            throw error;
        }
    }
    async findByUserId(userId) {
        return this.studentsService.findByUserId(parseInt(userId));
    }
    async findOne(id) {
        return this.studentsService.findOne(+id);
    }
    async update(id, updateStudentDto) {
        return this.studentsService.update(+id, updateStudentDto);
    }
    async updatePut(id, updateStudentDto) {
        return this.studentsService.update(+id, updateStudentDto);
    }
    async remove(id) {
        return this.studentsService.remove(+id);
    }
    async updateStatus(id, body) {
        return this.studentsService.updateStatus(+id, body.status);
    }
    async findBySchool(schoolId) {
        return this.studentsService.findBySchool(+schoolId);
    }
    async findByClass(classId) {
        return this.studentsService.findByClass(+classId);
    }
    async resetPassword(studentId, newPassword, req) {
        console.log('Reset password request for student:', studentId);
        return this.studentsService.resetPassword(studentId, newPassword);
    }
    async exportToCSV(req, res) {
        try {
            const schoolId = req.user.schoolId || req.user.id;
            console.log('[Students Controller] Exporting students for schoolId:', schoolId);
            const csv = await this.studentsService.exportToCSV(schoolId);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=students-${Date.now()}.csv`);
            res.send(csv);
        }
        catch (error) {
            console.error('[Students Controller] Error in exportToCSV:', error);
            res.status(500).json({ message: 'Failed to export students', error: error.message });
        }
    }
};
exports.StudentsController = StudentsController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_student_dto_1.CreateStudentDto]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "registerStudent", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_student_dto_1.CreateStudentDto, Object]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "createStudent", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('by-user/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "findByUserId", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_student_dto_1.UpdateStudentDto]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_student_dto_1.UpdateStudentDto]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "updatePut", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)('school/:schoolId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('schoolId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "findBySchool", null);
__decorate([
    (0, common_1.Get)('class/:classId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "findByClass", null);
__decorate([
    (0, common_1.Post)(':id/reset-password'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('newPassword')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Get)('export/csv'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "exportToCSV", null);
exports.StudentsController = StudentsController = __decorate([
    (0, common_1.Controller)('students'),
    __metadata("design:paramtypes", [students_service_1.StudentsService])
], StudentsController);
//# sourceMappingURL=students.controller.js.map