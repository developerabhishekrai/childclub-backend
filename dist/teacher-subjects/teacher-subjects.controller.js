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
exports.TeacherSubjectsController = void 0;
const common_1 = require("@nestjs/common");
const teacher_subjects_service_1 = require("./teacher-subjects.service");
const assign_teacher_subject_dto_1 = require("./dto/assign-teacher-subject.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let TeacherSubjectsController = class TeacherSubjectsController {
    constructor(teacherSubjectsService) {
        this.teacherSubjectsService = teacherSubjectsService;
    }
    async assignSubjectsToTeacher(assignTeacherSubjectDto) {
        return this.teacherSubjectsService.assignSubjectsToTeacher(assignTeacherSubjectDto);
    }
    async getTeacherSubjects(teacherId) {
        return this.teacherSubjectsService.getTeacherSubjects(parseInt(teacherId));
    }
    async getSubjectTeachers(subjectId) {
        return this.teacherSubjectsService.getSubjectTeachers(parseInt(subjectId));
    }
    async getClassTeachers(classId) {
        return this.teacherSubjectsService.getClassTeachers(parseInt(classId));
    }
    async removeTeacherSubject(teacherId, subjectId, classId) {
        await this.teacherSubjectsService.removeTeacherSubject(parseInt(teacherId), parseInt(subjectId), classId ? parseInt(classId) : undefined);
        return {
            success: true,
            message: 'Teacher-Subject assignment removed successfully',
        };
    }
    async removeAllTeacherSubjects(teacherId) {
        await this.teacherSubjectsService.removeAllTeacherSubjects(parseInt(teacherId));
        return {
            success: true,
            message: 'All teacher-subject assignments removed successfully',
        };
    }
};
exports.TeacherSubjectsController = TeacherSubjectsController;
__decorate([
    (0, common_1.Post)('assign'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assign_teacher_subject_dto_1.AssignTeacherSubjectDto]),
    __metadata("design:returntype", Promise)
], TeacherSubjectsController.prototype, "assignSubjectsToTeacher", null);
__decorate([
    (0, common_1.Get)('teacher/:teacherId'),
    __param(0, (0, common_1.Param)('teacherId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeacherSubjectsController.prototype, "getTeacherSubjects", null);
__decorate([
    (0, common_1.Get)('subject/:subjectId'),
    __param(0, (0, common_1.Param)('subjectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeacherSubjectsController.prototype, "getSubjectTeachers", null);
__decorate([
    (0, common_1.Get)('class/:classId'),
    __param(0, (0, common_1.Param)('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeacherSubjectsController.prototype, "getClassTeachers", null);
__decorate([
    (0, common_1.Delete)('remove'),
    __param(0, (0, common_1.Query)('teacherId')),
    __param(1, (0, common_1.Query)('subjectId')),
    __param(2, (0, common_1.Query)('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], TeacherSubjectsController.prototype, "removeTeacherSubject", null);
__decorate([
    (0, common_1.Delete)('teacher/:teacherId/all'),
    __param(0, (0, common_1.Param)('teacherId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeacherSubjectsController.prototype, "removeAllTeacherSubjects", null);
exports.TeacherSubjectsController = TeacherSubjectsController = __decorate([
    (0, common_1.Controller)('teacher-subjects'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [teacher_subjects_service_1.TeacherSubjectsService])
], TeacherSubjectsController);
//# sourceMappingURL=teacher-subjects.controller.js.map