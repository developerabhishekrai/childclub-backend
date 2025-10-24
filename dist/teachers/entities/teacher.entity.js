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
exports.Teacher = exports.TeacherStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const school_entity_1 = require("../../schools/entities/school.entity");
var TeacherStatus;
(function (TeacherStatus) {
    TeacherStatus["ACTIVE"] = "active";
    TeacherStatus["INACTIVE"] = "inactive";
    TeacherStatus["RESIGNED"] = "resigned";
    TeacherStatus["RETIRED"] = "retired";
    TeacherStatus["SUSPENDED"] = "suspended";
})(TeacherStatus || (exports.TeacherStatus = TeacherStatus = {}));
let Teacher = class Teacher {
};
exports.Teacher = Teacher;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Teacher.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'userId', type: 'int' }),
    __metadata("design:type", Number)
], Teacher.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'schoolId', type: 'int' }),
    __metadata("design:type", Number)
], Teacher.prototype, "schoolId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'classId', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Teacher.prototype, "classId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employeeId', type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], Teacher.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qualification', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Teacher.prototype, "qualification", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'specialization', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Teacher.prototype, "specialization", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'experienceYears', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Teacher.prototype, "experienceYears", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'joiningDate', type: 'date' }),
    __metadata("design:type", Date)
], Teacher.prototype, "joiningDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'salary', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Teacher.prototype, "salary", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'department', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Teacher.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'designation', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Teacher.prototype, "designation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'emergencyContact', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Teacher.prototype, "emergencyContact", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'enum', enum: TeacherStatus, default: TeacherStatus.ACTIVE }),
    __metadata("design:type", String)
], Teacher.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'subjects', type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Teacher.prototype, "subjects", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'isActive', type: 'tinyint', default: 1 }),
    __metadata("design:type", Number)
], Teacher.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'datetime', precision: 6 }),
    __metadata("design:type", Date)
], Teacher.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'datetime', precision: 6 }),
    __metadata("design:type", Date)
], Teacher.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Teacher.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => school_entity_1.School, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'schoolId' }),
    __metadata("design:type", school_entity_1.School)
], Teacher.prototype, "school", void 0);
exports.Teacher = Teacher = __decorate([
    (0, typeorm_1.Entity)('teachers')
], Teacher);
//# sourceMappingURL=teacher.entity.js.map