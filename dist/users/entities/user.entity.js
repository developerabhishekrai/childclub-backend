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
exports.User = exports.UserStatus = exports.UserRole = void 0;
const typeorm_1 = require("typeorm");
const bcrypt = require("bcryptjs");
const user_role_enum_1 = require("./user-role.enum");
Object.defineProperty(exports, "UserRole", { enumerable: true, get: function () { return user_role_enum_1.UserRole; } });
const user_status_enum_1 = require("./user-status.enum");
Object.defineProperty(exports, "UserStatus", { enumerable: true, get: function () { return user_status_enum_1.UserStatus; } });
let User = class User {
    async hashPasswordBeforeInsert() {
        if (this.password) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            console.log('Password hashed on insert');
        }
    }
    async hashPasswordBeforeUpdate() {
        if (this.password && !this.password.startsWith('$2a$') && !this.password.startsWith('$2b$')) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            console.log('Password hashed on update');
        }
    }
    async validatePassword(password) {
        try {
            return await bcrypt.compare(password, this.password);
        }
        catch (error) {
            console.error('Password validation error:', error);
            return false;
        }
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'firstName', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lastName', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email', type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'mobile', type: 'varchar', length: 255, nullable: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "mobile", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'role', type: 'enum', enum: user_role_enum_1.UserRole, default: user_role_enum_1.UserRole.STUDENT }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'enum', enum: user_status_enum_1.UserStatus, default: user_status_enum_1.UserStatus.PENDING }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'profilePicture', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "profilePicture", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'city', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'state', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'country', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'postalCode', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "postalCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'emailVerified', type: 'tinyint', default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "emailVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'mobileVerified', type: 'tinyint', default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "mobileVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lastLoginAt', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "lastLoginAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lastLoginIp', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "lastLoginIp", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dateOfBirth', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "dateOfBirth", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'adminPosition', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "adminPosition", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'yearsOfExperience', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "yearsOfExperience", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'educationLevel', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "educationLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'certifications', type: 'text', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "certifications", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'datetime', precision: 6 }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'datetime', precision: 6 }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], User.prototype, "hashPasswordBeforeInsert", null);
__decorate([
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], User.prototype, "hashPasswordBeforeUpdate", null);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=user.entity.js.map