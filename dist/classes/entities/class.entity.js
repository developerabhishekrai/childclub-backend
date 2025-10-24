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
exports.Class = exports.ClassStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const school_entity_1 = require("../../schools/entities/school.entity");
var ClassStatus;
(function (ClassStatus) {
    ClassStatus["ACTIVE"] = "active";
    ClassStatus["INACTIVE"] = "inactive";
    ClassStatus["COMPLETED"] = "completed";
})(ClassStatus || (exports.ClassStatus = ClassStatus = {}));
let Class = class Class {
};
exports.Class = Class;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Class.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Class.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'grade', type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], Class.prototype, "grade", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'section', type: 'varchar', length: 10, nullable: true }),
    __metadata("design:type", String)
], Class.prototype, "section", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], Class.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'enum', enum: ClassStatus, default: ClassStatus.ACTIVE }),
    __metadata("design:type", String)
], Class.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'academicYear', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Class.prototype, "academicYear", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'startDate', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Class.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'endDate', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Class.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'maxStudents', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Class.prototype, "maxStudents", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'currentStudents', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Class.prototype, "currentStudents", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'syllabus', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Class.prototype, "syllabus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rules', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Class.prototype, "rules", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'isActive', type: 'tinyint', default: 1 }),
    __metadata("design:type", Number)
], Class.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'schoolId', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Class.prototype, "schoolId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'classTeacherId', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Class.prototype, "classTeacherId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'schedule', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Class.prototype, "schedule", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'subjects', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Class.prototype, "subjects", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'datetime', precision: 6 }),
    __metadata("design:type", Date)
], Class.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'datetime', precision: 6 }),
    __metadata("design:type", Date)
], Class.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => school_entity_1.School, { onDelete: 'NO ACTION' }),
    (0, typeorm_1.JoinColumn)({ name: 'schoolId' }),
    __metadata("design:type", school_entity_1.School)
], Class.prototype, "school", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'classTeacherId' }),
    __metadata("design:type", user_entity_1.User)
], Class.prototype, "classTeacher", void 0);
exports.Class = Class = __decorate([
    (0, typeorm_1.Entity)('classes')
], Class);
//# sourceMappingURL=class.entity.js.map