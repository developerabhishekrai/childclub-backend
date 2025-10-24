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
exports.AssignmentsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const assignments_service_1 = require("./assignments.service");
const create_assignment_dto_1 = require("./dto/create-assignment.dto");
const update_assignment_dto_1 = require("./dto/update-assignment.dto");
const filter_assignment_dto_1 = require("./dto/filter-assignment.dto");
let AssignmentsController = class AssignmentsController {
    constructor(assignmentsService) {
        this.assignmentsService = assignmentsService;
    }
    create(createAssignmentDto, req) {
        const userId = req.user.id;
        const schoolId = req.user.schoolId;
        return this.assignmentsService.create(createAssignmentDto, userId, schoolId);
    }
    findAll(req, filters) {
        const schoolId = req.user.schoolId;
        return this.assignmentsService.findAll(schoolId, filters);
    }
    findByClass(classId, req) {
        const schoolId = req.user.schoolId;
        return this.assignmentsService.getAssignmentsByClass(classId, schoolId);
    }
    findByStudent(studentId, req) {
        const schoolId = req.user.schoolId;
        return this.assignmentsService.getAssignmentsByStudent(studentId, schoolId);
    }
    findByTeacher(teacherId, req) {
        const schoolId = req.user.schoolId;
        return this.assignmentsService.getAssignmentsByTeacher(teacherId, schoolId);
    }
    findByCreator(creatorId, req) {
        const schoolId = req.user.schoolId;
        return this.assignmentsService.getAssignmentsByCreator(creatorId, schoolId);
    }
    findMyTeacherAssignments(req) {
        const userId = req.user.id;
        const schoolId = req.user.schoolId;
        return this.assignmentsService.getAssignmentsForTeacherSpecificStudents(userId, schoolId);
    }
    findOne(id, req) {
        const schoolId = req.user.schoolId;
        return this.assignmentsService.findOne(id, schoolId);
    }
    update(id, updateAssignmentDto, req) {
        const schoolId = req.user.schoolId;
        return this.assignmentsService.update(id, updateAssignmentDto, schoolId);
    }
    remove(id, req) {
        const schoolId = req.user.schoolId;
        return this.assignmentsService.remove(id, schoolId);
    }
};
exports.AssignmentsController = AssignmentsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_assignment_dto_1.CreateAssignmentDto, Object]),
    __metadata("design:returntype", void 0)
], AssignmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, filter_assignment_dto_1.FilterAssignmentDto]),
    __metadata("design:returntype", void 0)
], AssignmentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('by-class/:classId'),
    __param(0, (0, common_1.Param)('classId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], AssignmentsController.prototype, "findByClass", null);
__decorate([
    (0, common_1.Get)('by-student/:studentId'),
    __param(0, (0, common_1.Param)('studentId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], AssignmentsController.prototype, "findByStudent", null);
__decorate([
    (0, common_1.Get)('by-teacher/:teacherId'),
    __param(0, (0, common_1.Param)('teacherId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], AssignmentsController.prototype, "findByTeacher", null);
__decorate([
    (0, common_1.Get)('by-creator/:creatorId'),
    __param(0, (0, common_1.Param)('creatorId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], AssignmentsController.prototype, "findByCreator", null);
__decorate([
    (0, common_1.Get)('my-teacher-assignments'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AssignmentsController.prototype, "findMyTeacherAssignments", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], AssignmentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_assignment_dto_1.UpdateAssignmentDto, Object]),
    __metadata("design:returntype", void 0)
], AssignmentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], AssignmentsController.prototype, "remove", null);
exports.AssignmentsController = AssignmentsController = __decorate([
    (0, common_1.Controller)('assignments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [assignments_service_1.AssignmentsService])
], AssignmentsController);
//# sourceMappingURL=assignments.controller.js.map