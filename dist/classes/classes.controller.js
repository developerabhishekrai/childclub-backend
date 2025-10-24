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
exports.ClassesController = void 0;
const common_1 = require("@nestjs/common");
const classes_service_1 = require("./classes.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ClassesController = class ClassesController {
    constructor(classesService) {
        this.classesService = classesService;
    }
    async createClass(createClassDto, req) {
        const schoolId = req.user.schoolId || req.user.id;
        return this.classesService.createClass(createClassDto, schoolId);
    }
    async findAllClasses(req, schoolId) {
        const id = schoolId || req.user.schoolId || req.user.id;
        return this.classesService.findAllClasses(id);
    }
    async getClassStats(req) {
        const schoolId = req.user.schoolId || req.user.id;
        return this.classesService.getClassStats(schoolId);
    }
    async getClassesByGrade(grade, req) {
        const schoolId = req.user.schoolId || req.user.id;
        return this.classesService.getClassesByGrade(schoolId, grade);
    }
    async findClassById(id) {
        return this.classesService.findClassById(parseInt(id));
    }
    async updateClass(id, updateClassDto) {
        return this.classesService.updateClass(parseInt(id), updateClassDto);
    }
    async deleteClass(id) {
        return this.classesService.deleteClass(parseInt(id));
    }
    async addStudentToClass(classId, studentId) {
        return this.classesService.addStudentToClass(parseInt(classId), parseInt(studentId));
    }
    async removeStudentFromClass(classId, studentId) {
        return this.classesService.removeStudentFromClass(parseInt(classId), parseInt(studentId));
    }
};
exports.ClassesController = ClassesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ClassesController.prototype, "createClass", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('schoolId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ClassesController.prototype, "findAllClasses", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClassesController.prototype, "getClassStats", null);
__decorate([
    (0, common_1.Get)('grade/:grade'),
    __param(0, (0, common_1.Param)('grade')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClassesController.prototype, "getClassesByGrade", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClassesController.prototype, "findClassById", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClassesController.prototype, "updateClass", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClassesController.prototype, "deleteClass", null);
__decorate([
    (0, common_1.Post)(':id/add-student/:studentId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ClassesController.prototype, "addStudentToClass", null);
__decorate([
    (0, common_1.Delete)(':id/remove-student/:studentId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ClassesController.prototype, "removeStudentFromClass", null);
exports.ClassesController = ClassesController = __decorate([
    (0, common_1.Controller)('classes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [classes_service_1.ClassesService])
], ClassesController);
//# sourceMappingURL=classes.controller.js.map