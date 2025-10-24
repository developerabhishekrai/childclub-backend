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
exports.TeachersController = void 0;
const common_1 = require("@nestjs/common");
const teachers_service_1 = require("./teachers.service");
const update_teacher_dto_1 = require("./dto/update-teacher.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let TeachersController = class TeachersController {
    constructor(teachersService) {
        this.teachersService = teachersService;
    }
    async createTeacher(createTeacherDto, req) {
        const createdBy = req.user.id;
        console.log('Creating teacher with createdBy:', {
            userId: req.user.id,
            userRole: req.user.role,
            schoolId: req.user.schoolId,
            createdBy
        });
        return this.teachersService.createTeacher(createTeacherDto, createdBy.toString());
    }
    async findAllTeachers(req, schoolId) {
        const id = schoolId || req.user.id;
        console.log('Finding teachers for user/school:', {
            userId: req.user.id,
            userRole: req.user.role,
            schoolId: req.user.schoolId,
            querySchoolId: schoolId,
            finalId: id
        });
        return this.teachersService.findAllTeachers(id);
    }
    async getTeacherStats(req) {
        const userId = req.user.id;
        console.log('Fetching teacher stats for user:', userId);
        return this.teachersService.getTeacherStats(userId.toString());
    }
    async findTeacherById(id) {
        return this.teachersService.findTeacherById(id);
    }
    async getTeacherClasses(id) {
        const userId = parseInt(id);
        if (isNaN(userId)) {
            throw new Error('Invalid teacher ID');
        }
        return this.teachersService.getTeacherClasses(userId);
    }
    async getTeachersByClass(classId) {
        return this.teachersService.getTeachersByClass(classId);
    }
    async updateTeacher(id, updateTeacherDto) {
        return this.teachersService.updateTeacher(id, updateTeacherDto);
    }
    async deleteTeacher(id) {
        try {
            await this.teachersService.deleteTeacher(id);
            return {
                success: true,
                message: 'Teacher deleted successfully',
            };
        }
        catch (error) {
            console.error('Error in deleteTeacher controller:', error);
            throw error;
        }
    }
    async assignTeacherToClass(teacherId, classId) {
        return this.teachersService.assignTeacherToClass(teacherId, classId);
    }
    async removeTeacherFromClass(teacherId, classId) {
        return this.teachersService.removeTeacherFromClass(teacherId, classId);
    }
    async resetPassword(teacherId, newPassword, req) {
        console.log('Reset password request for teacher:', teacherId);
        return this.teachersService.resetPassword(teacherId, newPassword);
    }
    async getMyStudents(req) {
        console.log('Getting students for teacher:', req.user.id);
        return this.teachersService.getMyStudents(req.user.id);
    }
    async testRestart() {
        return {
            message: 'Backend restarted successfully!',
            timestamp: new Date().toISOString(),
            version: 'v2.0-fixed'
        };
    }
    async getMyClasses(req) {
        try {
            console.log('==================== MY-CLASSES ENDPOINT ====================');
            console.log('[Controller] Request received at:', new Date().toISOString());
            console.log('[Controller] req.user exists:', !!req.user);
            if (!req.user) {
                console.error('[Controller] ERROR: req.user is undefined or null');
                throw new Error('Authentication failed - no user object in request');
            }
            console.log('[Controller] Full request user:', JSON.stringify(req.user, null, 2));
            console.log('[Controller] req.user.id value:', req.user.id);
            console.log('[Controller] req.user.id type:', typeof req.user.id);
            if (req.user.id === undefined || req.user.id === null) {
                console.error('[Controller] ERROR: req.user.id is undefined or null');
                throw new Error('Authentication failed - no user ID in request');
            }
            const userId = req.user.id;
            console.log('[Controller] Original userId from token:', userId);
            console.log('[Controller] userId type:', typeof userId);
            if (userId === null || userId === undefined || Number.isNaN(userId)) {
                console.error('[Controller] ERROR: userId is null/undefined/NaN:', userId);
                console.log('[Controller] Returning empty array due to invalid userId');
                return [];
            }
            const userIdNum = typeof userId === 'number' ? userId : parseInt(String(userId));
            console.log('[Controller] Parsed userId:', userIdNum);
            if (isNaN(userIdNum) || userIdNum <= 0) {
                console.error('[Controller] ERROR: Invalid userId after parsing:', userIdNum);
                console.log('[Controller] Returning empty array due to invalid parsed userId');
                return [];
            }
            console.log('[Controller] Calling getTeacherClasses with userId:', userIdNum);
            const result = await this.teachersService.getTeacherClasses(userIdNum);
            console.log('[Controller] Successfully retrieved classes:', result.length);
            console.log('==================== END MY-CLASSES ENDPOINT ====================');
            return result;
        }
        catch (error) {
            console.error('==================== MY-CLASSES ERROR ====================');
            console.error('[Controller] Error in getMyClasses:', error.message);
            console.error('[Controller] Error stack:', error.stack);
            console.error('==================== END ERROR ====================');
            throw error;
        }
    }
};
exports.TeachersController = TeachersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TeachersController.prototype, "createTeacher", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('schoolId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TeachersController.prototype, "findAllTeachers", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TeachersController.prototype, "getTeacherStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeachersController.prototype, "findTeacherById", null);
__decorate([
    (0, common_1.Get)(':id/classes'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeachersController.prototype, "getTeacherClasses", null);
__decorate([
    (0, common_1.Get)('class/:classId'),
    __param(0, (0, common_1.Param)('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeachersController.prototype, "getTeachersByClass", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_teacher_dto_1.UpdateTeacherDto]),
    __metadata("design:returntype", Promise)
], TeachersController.prototype, "updateTeacher", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeachersController.prototype, "deleteTeacher", null);
__decorate([
    (0, common_1.Post)(':id/assign-class/:classId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TeachersController.prototype, "assignTeacherToClass", null);
__decorate([
    (0, common_1.Delete)(':id/remove-class/:classId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TeachersController.prototype, "removeTeacherFromClass", null);
__decorate([
    (0, common_1.Post)(':id/reset-password'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('newPassword')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], TeachersController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Get)('my/students'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TeachersController.prototype, "getMyStudents", null);
__decorate([
    (0, common_1.Get)('test-restart'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TeachersController.prototype, "testRestart", null);
__decorate([
    (0, common_1.Get)('my-classes'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TeachersController.prototype, "getMyClasses", null);
exports.TeachersController = TeachersController = __decorate([
    (0, common_1.Controller)('teachers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [teachers_service_1.TeachersService])
], TeachersController);
//# sourceMappingURL=teachers.controller.js.map