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
exports.SchoolsController = void 0;
const common_1 = require("@nestjs/common");
const schools_service_1 = require("./schools.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_school_dto_1 = require("./dto/create-school.dto");
const approve_school_dto_1 = require("./dto/approve-school.dto");
const reject_school_dto_1 = require("./dto/reject-school.dto");
const update_school_dto_1 = require("./dto/update-school.dto");
const user_entity_1 = require("../users/entities/user.entity");
let SchoolsController = class SchoolsController {
    constructor(schoolsService) {
        this.schoolsService = schoolsService;
    }
    async findAll(status, type, search, page, limit, req) {
        return this.schoolsService.findAll({
            status,
            type,
            search,
            page: page || 1,
            limit: limit || 10,
            userRole: req?.user?.role,
            schoolId: req?.user?.schoolId,
        });
    }
    async getPendingCount(req) {
        if (req.user.role !== user_entity_1.UserRole.SUPER_ADMIN) {
            throw new common_1.HttpException('Insufficient permissions', common_1.HttpStatus.FORBIDDEN);
        }
        return this.schoolsService.getPendingCount();
    }
    async findMySchool(req) {
        const userId = req.user.userId || req.user.id;
        return this.schoolsService.findByUserId(parseInt(userId));
    }
    async findOne(id) {
        return this.schoolsService.findOne(parseInt(id));
    }
    async create(createSchoolDto, req) {
        if (req.user.role !== user_entity_1.UserRole.SCHOOL_ADMIN && req.user.role !== user_entity_1.UserRole.SUPER_ADMIN) {
            throw new common_1.HttpException('Only school admins can register schools', common_1.HttpStatus.FORBIDDEN);
        }
        return this.schoolsService.create(createSchoolDto, req.user.id);
    }
    async update(id, updateSchoolDto, req) {
        if (req.user.role !== user_entity_1.UserRole.SUPER_ADMIN && req.user.role !== user_entity_1.UserRole.SCHOOL_ADMIN) {
            throw new common_1.HttpException('Insufficient permissions', common_1.HttpStatus.FORBIDDEN);
        }
        return this.schoolsService.update(parseInt(id), updateSchoolDto, req.user.id);
    }
    async approveSchool(id, approveSchoolDto, req) {
        if (req.user.role !== user_entity_1.UserRole.SUPER_ADMIN) {
            throw new common_1.HttpException('Only super admin can approve schools', common_1.HttpStatus.FORBIDDEN);
        }
        return this.schoolsService.approveSchool(parseInt(id), req.user.id, approveSchoolDto.comments);
    }
    async rejectSchool(id, rejectSchoolDto, req) {
        if (req.user.role !== user_entity_1.UserRole.SUPER_ADMIN) {
            throw new common_1.HttpException('Only super admin can reject schools', common_1.HttpStatus.FORBIDDEN);
        }
        return this.schoolsService.rejectSchool(parseInt(id), req.user.id, rejectSchoolDto.reason);
    }
    async suspendSchool(id, rejectSchoolDto, req) {
        if (req.user.role !== user_entity_1.UserRole.SUPER_ADMIN) {
            throw new common_1.HttpException('Only super admin can suspend schools', common_1.HttpStatus.FORBIDDEN);
        }
        return this.schoolsService.suspendSchool(parseInt(id), req.user.id, rejectSchoolDto.reason);
    }
    async remove(id, req) {
        if (req.user.role !== user_entity_1.UserRole.SUPER_ADMIN) {
            throw new common_1.HttpException('Only super admin can delete schools', common_1.HttpStatus.FORBIDDEN);
        }
        return this.schoolsService.remove(parseInt(id));
    }
};
exports.SchoolsController = SchoolsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __param(5, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number, Number, Object]),
    __metadata("design:returntype", Promise)
], SchoolsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('pending/count'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SchoolsController.prototype, "getPendingCount", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SchoolsController.prototype, "findMySchool", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SchoolsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_school_dto_1.CreateSchoolDto, Object]),
    __metadata("design:returntype", Promise)
], SchoolsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_school_dto_1.UpdateSchoolDto, Object]),
    __metadata("design:returntype", Promise)
], SchoolsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approve_school_dto_1.ApproveSchoolDto, Object]),
    __metadata("design:returntype", Promise)
], SchoolsController.prototype, "approveSchool", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reject_school_dto_1.RejectSchoolDto, Object]),
    __metadata("design:returntype", Promise)
], SchoolsController.prototype, "rejectSchool", null);
__decorate([
    (0, common_1.Post)(':id/suspend'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reject_school_dto_1.RejectSchoolDto, Object]),
    __metadata("design:returntype", Promise)
], SchoolsController.prototype, "suspendSchool", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SchoolsController.prototype, "remove", null);
exports.SchoolsController = SchoolsController = __decorate([
    (0, common_1.Controller)('schools'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [schools_service_1.SchoolsService])
], SchoolsController);
//# sourceMappingURL=schools.controller.js.map