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
Object.defineProperty(exports, "__esModule", { value: true });
exports.School = exports.SchoolStatus = exports.SchoolType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var SchoolType;
(function (SchoolType) {
    SchoolType["PRIMARY"] = "primary";
    SchoolType["SECONDARY"] = "secondary";
    SchoolType["HIGHER_SECONDARY"] = "higher_secondary";
    SchoolType["INTERNATIONAL"] = "international";
    SchoolType["SPECIAL_NEEDS"] = "special_needs";
})(SchoolType || (exports.SchoolType = SchoolType = {}));
var SchoolStatus;
(function (SchoolStatus) {
    SchoolStatus["PENDING"] = "pending";
    SchoolStatus["APPROVED"] = "approved";
    SchoolStatus["REJECTED"] = "rejected";
    SchoolStatus["SUSPENDED"] = "suspended";
})(SchoolStatus || (exports.SchoolStatus = SchoolStatus = {}));
let School = class School {
};
exports.School = School;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], School.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], School.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], School.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'type', type: 'enum', enum: SchoolType, default: SchoolType.PRIMARY }),
    __metadata("design:type", String)
], School.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'enum', enum: SchoolStatus, default: SchoolStatus.PENDING }),
    __metadata("design:type", String)
], School.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'logo', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], School.prototype, "logo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'banner', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], School.prototype, "banner", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'city', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], School.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'state', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], School.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'country', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], School.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'postalCode', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], School.prototype, "postalCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], School.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'website', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], School.prototype, "website", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], School.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'establishedYear', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], School.prototype, "establishedYear", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'totalStudents', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], School.prototype, "totalStudents", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'totalTeachers', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], School.prototype, "totalTeachers", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'totalClasses', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], School.prototype, "totalClasses", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'facilities', type: 'text', nullable: true }),
    __metadata("design:type", String)
], School.prototype, "facilities", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'achievements', type: 'text', nullable: true }),
    __metadata("design:type", String)
], School.prototype, "achievements", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vision', type: 'text', nullable: true }),
    __metadata("design:type", String)
], School.prototype, "vision", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'mission', type: 'text', nullable: true }),
    __metadata("design:type", String)
], School.prototype, "mission", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'isActive', type: 'tinyint', default: 1 }),
    __metadata("design:type", Number)
], School.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approvedAt', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], School.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approvedBy', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], School.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rejectionReason', type: 'text', nullable: true }),
    __metadata("design:type", String)
], School.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], School.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address', type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], School.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'workingHours', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], School.prototype, "workingHours", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'holidays', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], School.prototype, "holidays", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'datetime', precision: 6 }),
    __metadata("design:type", Date)
], School.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'datetime', precision: 6 }),
    __metadata("design:type", Date)
], School.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'NO ACTION' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], School.prototype, "user", void 0);
exports.School = School = __decorate([
    (0, typeorm_1.Entity)('schools')
], School);
//# sourceMappingURL=school.entity.js.map