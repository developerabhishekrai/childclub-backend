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
exports.SubmissionsController = void 0;
const common_1 = require("@nestjs/common");
const submissions_service_1 = require("./submissions.service");
const create_submission_dto_1 = require("./dto/create-submission.dto");
const update_submission_dto_1 = require("./dto/update-submission.dto");
const review_submission_dto_1 = require("./dto/review-submission.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let SubmissionsController = class SubmissionsController {
    constructor(submissionsService) {
        this.submissionsService = submissionsService;
    }
    async createSubmission(createSubmissionDto, req) {
        return this.submissionsService.createSubmission(createSubmissionDto);
    }
    async findMySubmissions(req) {
        console.log('[Controller] Getting submissions for teacher:', req.user.id);
        return this.submissionsService.findSubmissionsByTeacher(req.user.id);
    }
    async findSubmissionsByTask(taskId) {
        return this.submissionsService.findSubmissionsByTask(parseInt(taskId));
    }
    async findSubmissionsByStudent(studentId) {
        return this.submissionsService.findSubmissionsByStudent(parseInt(studentId));
    }
    async findSubmissionsByClass(classId) {
        return this.submissionsService.findSubmissionsByClass(parseInt(classId));
    }
    async findSubmissionsBySchool(schoolId) {
        return this.submissionsService.findSubmissionsBySchool(parseInt(schoolId));
    }
    async getSubmissionStats(classId) {
        return this.submissionsService.getSubmissionStats(parseInt(classId));
    }
    async findSubmissionById(id) {
        return this.submissionsService.findSubmissionById(parseInt(id));
    }
    async updateSubmission(id, updateSubmissionDto) {
        return this.submissionsService.updateSubmission(parseInt(id), updateSubmissionDto);
    }
    async reviewSubmission(id, reviewSubmissionDto, req) {
        return this.submissionsService.reviewSubmission(parseInt(id), reviewSubmissionDto, req.user.id);
    }
    async deleteSubmission(id) {
        await this.submissionsService.deleteSubmission(parseInt(id));
        return {
            success: true,
            message: 'Submission deleted successfully',
        };
    }
};
exports.SubmissionsController = SubmissionsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_submission_dto_1.CreateSubmissionDto, Object]),
    __metadata("design:returntype", Promise)
], SubmissionsController.prototype, "createSubmission", null);
__decorate([
    (0, common_1.Get)('teacher/my-submissions'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubmissionsController.prototype, "findMySubmissions", null);
__decorate([
    (0, common_1.Get)('task/:taskId'),
    __param(0, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubmissionsController.prototype, "findSubmissionsByTask", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubmissionsController.prototype, "findSubmissionsByStudent", null);
__decorate([
    (0, common_1.Get)('class/:classId'),
    __param(0, (0, common_1.Param)('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubmissionsController.prototype, "findSubmissionsByClass", null);
__decorate([
    (0, common_1.Get)('school/:schoolId'),
    __param(0, (0, common_1.Param)('schoolId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubmissionsController.prototype, "findSubmissionsBySchool", null);
__decorate([
    (0, common_1.Get)('stats/:classId'),
    __param(0, (0, common_1.Param)('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubmissionsController.prototype, "getSubmissionStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubmissionsController.prototype, "findSubmissionById", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_submission_dto_1.UpdateSubmissionDto]),
    __metadata("design:returntype", Promise)
], SubmissionsController.prototype, "updateSubmission", null);
__decorate([
    (0, common_1.Put)(':id/review'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, review_submission_dto_1.ReviewSubmissionDto, Object]),
    __metadata("design:returntype", Promise)
], SubmissionsController.prototype, "reviewSubmission", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubmissionsController.prototype, "deleteSubmission", null);
exports.SubmissionsController = SubmissionsController = __decorate([
    (0, common_1.Controller)('submissions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [submissions_service_1.SubmissionsService])
], SubmissionsController);
//# sourceMappingURL=submissions.controller.js.map