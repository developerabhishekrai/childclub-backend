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
exports.Attendance = exports.AttendanceStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const class_entity_1 = require("../../classes/entities/class.entity");
var AttendanceStatus;
(function (AttendanceStatus) {
    AttendanceStatus["PRESENT"] = "present";
    AttendanceStatus["ABSENT"] = "absent";
    AttendanceStatus["LATE"] = "late";
    AttendanceStatus["EXCUSED"] = "excused";
    AttendanceStatus["HALF_DAY"] = "half_day";
})(AttendanceStatus || (exports.AttendanceStatus = AttendanceStatus = {}));
let Attendance = class Attendance {
};
exports.Attendance = Attendance;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Attendance.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'studentId', type: 'int' }),
    __metadata("design:type", Number)
], Attendance.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'classId', type: 'int' }),
    __metadata("design:type", Number)
], Attendance.prototype, "classId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'teacherId', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Attendance.prototype, "teacherId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date', type: 'date' }),
    __metadata("design:type", Date)
], Attendance.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'enum', enum: AttendanceStatus, default: AttendanceStatus.PRESENT }),
    __metadata("design:type", String)
], Attendance.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'remarks', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Attendance.prototype, "remarks", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'checkInTime', type: 'time', nullable: true }),
    __metadata("design:type", String)
], Attendance.prototype, "checkInTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'checkOutTime', type: 'time', nullable: true }),
    __metadata("design:type", String)
], Attendance.prototype, "checkOutTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'temperature', type: 'decimal', precision: 4, scale: 1, nullable: true }),
    __metadata("design:type", Number)
], Attendance.prototype, "temperature", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'mood', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Attendance.prototype, "mood", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'parentNotified', type: 'tinyint', default: 0 }),
    __metadata("design:type", Number)
], Attendance.prototype, "parentNotified", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notificationSentAt', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Attendance.prototype, "notificationSentAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'datetime', precision: 6 }),
    __metadata("design:type", Date)
], Attendance.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'datetime', precision: 6 }),
    __metadata("design:type", Date)
], Attendance.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'studentId' }),
    __metadata("design:type", user_entity_1.User)
], Attendance.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => class_entity_1.Class, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'classId' }),
    __metadata("design:type", class_entity_1.Class)
], Attendance.prototype, "class", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'teacherId' }),
    __metadata("design:type", user_entity_1.User)
], Attendance.prototype, "teacher", void 0);
exports.Attendance = Attendance = __decorate([
    (0, typeorm_1.Entity)('attendance')
], Attendance);
//# sourceMappingURL=attendance.entity.js.map