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
exports.SubjectsController = void 0;
const common_1 = require("@nestjs/common");
const subjects_service_1 = require("./subjects.service");
const create_subject_dto_1 = require("./dto/create-subject.dto");
const update_subject_dto_1 = require("./dto/update-subject.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let SubjectsController = class SubjectsController {
    constructor(subjectsService) {
        this.subjectsService = subjectsService;
    }
    async createSubject(createSubjectDto, req) {
        const schoolId = req.user.schoolId || req.user.id;
        const subjectData = {
            ...createSubjectDto,
            schoolId: schoolId.toString(),
        };
        return this.subjectsService.createSubject(subjectData);
    }
    async findAllSubjects(req, schoolId) {
        const id = schoolId || req.user.schoolId || req.user.id;
        return this.subjectsService.findAllSubjects(parseInt(id));
    }
    async getSubjectStats(req) {
        const schoolId = req.user.schoolId || req.user.id;
        return this.subjectsService.getSubjectStats(schoolId);
    }
    async findSubjectsByGrade(gradeLevel, req) {
        const schoolId = req.user.schoolId || req.user.id;
        return this.subjectsService.findSubjectsByGrade(schoolId, gradeLevel);
    }
    async findSubjectById(id) {
        return this.subjectsService.findSubjectById(parseInt(id));
    }
    async updateSubject(id, updateSubjectDto) {
        return this.subjectsService.updateSubject(parseInt(id), updateSubjectDto);
    }
    async deleteSubject(id) {
        await this.subjectsService.deleteSubject(parseInt(id));
        return {
            success: true,
            message: 'Subject deleted successfully',
        };
    }
};
exports.SubjectsController = SubjectsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_subject_dto_1.CreateSubjectDto, Object]),
    __metadata("design:returntype", Promise)
], SubjectsController.prototype, "createSubject", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('schoolId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SubjectsController.prototype, "findAllSubjects", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubjectsController.prototype, "getSubjectStats", null);
__decorate([
    (0, common_1.Get)('grade/:gradeLevel'),
    __param(0, (0, common_1.Param)('gradeLevel')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SubjectsController.prototype, "findSubjectsByGrade", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubjectsController.prototype, "findSubjectById", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_subject_dto_1.UpdateSubjectDto]),
    __metadata("design:returntype", Promise)
], SubjectsController.prototype, "updateSubject", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubjectsController.prototype, "deleteSubject", null);
exports.SubjectsController = SubjectsController = __decorate([
    (0, common_1.Controller)('subjects'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [subjects_service_1.SubjectsService])
], SubjectsController);
//# sourceMappingURL=subjects.controller.js.map