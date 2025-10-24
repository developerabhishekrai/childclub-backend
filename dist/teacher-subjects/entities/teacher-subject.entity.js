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
exports.TeacherSubject = void 0;
const typeorm_1 = require("typeorm");
const teacher_entity_1 = require("../../teachers/entities/teacher.entity");
const subject_entity_1 = require("../../subjects/entities/subject.entity");
const class_entity_1 = require("../../classes/entities/class.entity");
let TeacherSubject = class TeacherSubject {
};
exports.TeacherSubject = TeacherSubject;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TeacherSubject.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'teacherId', type: 'int' }),
    __metadata("design:type", Number)
], TeacherSubject.prototype, "teacherId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'subjectId', type: 'int' }),
    __metadata("design:type", Number)
], TeacherSubject.prototype, "subjectId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'classId', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], TeacherSubject.prototype, "classId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'isActive', type: 'tinyint', default: 1 }),
    __metadata("design:type", Number)
], TeacherSubject.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'datetime', precision: 6 }),
    __metadata("design:type", Date)
], TeacherSubject.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'datetime', precision: 6 }),
    __metadata("design:type", Date)
], TeacherSubject.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => teacher_entity_1.Teacher, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'teacherId' }),
    __metadata("design:type", teacher_entity_1.Teacher)
], TeacherSubject.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => subject_entity_1.Subject, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'subjectId' }),
    __metadata("design:type", subject_entity_1.Subject)
], TeacherSubject.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => class_entity_1.Class, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'classId' }),
    __metadata("design:type", class_entity_1.Class)
], TeacherSubject.prototype, "class", void 0);
exports.TeacherSubject = TeacherSubject = __decorate([
    (0, typeorm_1.Entity)('teacher_subjects')
], TeacherSubject);
//# sourceMappingURL=teacher-subject.entity.js.map