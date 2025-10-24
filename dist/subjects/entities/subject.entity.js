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
exports.Subject = exports.SubjectStatus = void 0;
const typeorm_1 = require("typeorm");
const school_entity_1 = require("../../schools/entities/school.entity");
var SubjectStatus;
(function (SubjectStatus) {
    SubjectStatus["ACTIVE"] = "active";
    SubjectStatus["INACTIVE"] = "inactive";
})(SubjectStatus || (exports.SubjectStatus = SubjectStatus = {}));
let Subject = class Subject {
};
exports.Subject = Subject;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Subject.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Subject.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'code', type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], Subject.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Subject.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'enum', enum: SubjectStatus, default: SubjectStatus.ACTIVE }),
    __metadata("design:type", String)
], Subject.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'schoolId', type: 'int' }),
    __metadata("design:type", Number)
], Subject.prototype, "schoolId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gradeLevel', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Subject.prototype, "gradeLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'totalMarks', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Subject.prototype, "totalMarks", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'passingMarks', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Subject.prototype, "passingMarks", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'isElective', type: 'tinyint', default: 0 }),
    __metadata("design:type", Number)
], Subject.prototype, "isElective", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'color', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Subject.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'icon', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Subject.prototype, "icon", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'isActive', type: 'tinyint', default: 1 }),
    __metadata("design:type", Number)
], Subject.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'datetime', precision: 6 }),
    __metadata("design:type", Date)
], Subject.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'datetime', precision: 6 }),
    __metadata("design:type", Date)
], Subject.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => school_entity_1.School, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'schoolId' }),
    __metadata("design:type", school_entity_1.School)
], Subject.prototype, "school", void 0);
exports.Subject = Subject = __decorate([
    (0, typeorm_1.Entity)('subjects')
], Subject);
//# sourceMappingURL=subject.entity.js.map