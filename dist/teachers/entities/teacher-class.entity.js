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
exports.TeacherClass = void 0;
const typeorm_1 = require("typeorm");
const teacher_entity_1 = require("./teacher.entity");
const class_entity_1 = require("../../classes/entities/class.entity");
let TeacherClass = class TeacherClass {
};
exports.TeacherClass = TeacherClass;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TeacherClass.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'teacherId', type: 'int' }),
    __metadata("design:type", Number)
], TeacherClass.prototype, "teacherId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'classId', type: 'int' }),
    __metadata("design:type", Number)
], TeacherClass.prototype, "classId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'isPrimary', type: 'tinyint', default: 0, comment: '1 if this is the teacher primary class' }),
    __metadata("design:type", Number)
], TeacherClass.prototype, "isPrimary", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'isActive', type: 'tinyint', default: 1 }),
    __metadata("design:type", Number)
], TeacherClass.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'datetime', precision: 6 }),
    __metadata("design:type", Date)
], TeacherClass.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'datetime', precision: 6 }),
    __metadata("design:type", Date)
], TeacherClass.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => teacher_entity_1.Teacher, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'teacherId' }),
    __metadata("design:type", teacher_entity_1.Teacher)
], TeacherClass.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => class_entity_1.Class, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'classId' }),
    __metadata("design:type", class_entity_1.Class)
], TeacherClass.prototype, "class", void 0);
exports.TeacherClass = TeacherClass = __decorate([
    (0, typeorm_1.Entity)('teacher_classes')
], TeacherClass);
//# sourceMappingURL=teacher-class.entity.js.map