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
exports.Student = exports.BloodGroup = exports.Gender = exports.StudentStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const school_entity_1 = require("../../schools/entities/school.entity");
const class_entity_1 = require("../../classes/entities/class.entity");
var StudentStatus;
(function (StudentStatus) {
    StudentStatus["ACTIVE"] = "active";
    StudentStatus["INACTIVE"] = "inactive";
    StudentStatus["GRADUATED"] = "graduated";
    StudentStatus["TRANSFERRED"] = "transferred";
    StudentStatus["SUSPENDED"] = "suspended";
})(StudentStatus || (exports.StudentStatus = StudentStatus = {}));
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
    Gender["OTHER"] = "other";
})(Gender || (exports.Gender = Gender = {}));
var BloodGroup;
(function (BloodGroup) {
    BloodGroup["A_POSITIVE"] = "A+";
    BloodGroup["A_NEGATIVE"] = "A-";
    BloodGroup["B_POSITIVE"] = "B+";
    BloodGroup["B_NEGATIVE"] = "B-";
    BloodGroup["AB_POSITIVE"] = "AB+";
    BloodGroup["AB_NEGATIVE"] = "AB-";
    BloodGroup["O_POSITIVE"] = "O+";
    BloodGroup["O_NEGATIVE"] = "O-";
})(BloodGroup || (exports.BloodGroup = BloodGroup = {}));
let Student = class Student {
};
exports.Student = Student;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Student.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'userId', type: 'int' }),
    __metadata("design:type", Number)
], Student.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'schoolId', type: 'int' }),
    __metadata("design:type", Number)
], Student.prototype, "schoolId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'studentId', type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], Student.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rollNumber', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Student.prototype, "rollNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'admissionNumber', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Student.prototype, "admissionNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'enrollNumber', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Student.prototype, "enrollNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dateOfBirth', type: 'date' }),
    __metadata("design:type", Date)
], Student.prototype, "dateOfBirth", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gender', type: 'enum', enum: Gender, default: Gender.OTHER }),
    __metadata("design:type", String)
], Student.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bloodGroup', type: 'enum', enum: BloodGroup, nullable: true }),
    __metadata("design:type", String)
], Student.prototype, "bloodGroup", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'parentName', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Student.prototype, "parentName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'parentPhone', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Student.prototype, "parentPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'parentEmail', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Student.prototype, "parentEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'emergencyContact', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Student.prototype, "emergencyContact", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'enrollmentDate', type: 'date' }),
    __metadata("design:type", Date)
], Student.prototype, "enrollmentDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'currentClassId', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Student.prototype, "currentClassId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'previousSchool', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Student.prototype, "previousSchool", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'academicYear', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Student.prototype, "academicYear", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'enum', enum: StudentStatus, default: StudentStatus.ACTIVE }),
    __metadata("design:type", String)
], Student.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'isActive', type: 'tinyint', default: 1 }),
    __metadata("design:type", Number)
], Student.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'datetime', precision: 6 }),
    __metadata("design:type", Date)
], Student.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'datetime', precision: 6 }),
    __metadata("design:type", Date)
], Student.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Student.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => school_entity_1.School, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'schoolId' }),
    __metadata("design:type", school_entity_1.School)
], Student.prototype, "school", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => class_entity_1.Class, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'currentClassId' }),
    __metadata("design:type", class_entity_1.Class)
], Student.prototype, "currentClass", void 0);
exports.Student = Student = __decorate([
    (0, typeorm_1.Entity)('students')
], Student);
//# sourceMappingURL=student.entity.js.map