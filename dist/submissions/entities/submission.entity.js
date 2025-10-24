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
exports.Submission = exports.SubmissionStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const assignment_entity_1 = require("../../assignments/entities/assignment.entity");
var SubmissionStatus;
(function (SubmissionStatus) {
    SubmissionStatus["DRAFT"] = "draft";
    SubmissionStatus["SUBMITTED"] = "submitted";
    SubmissionStatus["REVIEWED"] = "reviewed";
    SubmissionStatus["APPROVED"] = "approved";
    SubmissionStatus["REJECTED"] = "rejected";
    SubmissionStatus["RESUBMIT"] = "resubmit";
})(SubmissionStatus || (exports.SubmissionStatus = SubmissionStatus = {}));
let Submission = class Submission {
};
exports.Submission = Submission;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Submission.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'taskId', type: 'int' }),
    __metadata("design:type", Number)
], Submission.prototype, "taskId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'studentId', type: 'int' }),
    __metadata("design:type", Number)
], Submission.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'enum', enum: SubmissionStatus, default: SubmissionStatus.DRAFT }),
    __metadata("design:type", String)
], Submission.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'content', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Submission.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'attachments', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Submission.prototype, "attachments", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'submittedAt', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Submission.prototype, "submittedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reviewedAt', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Submission.prototype, "reviewedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reviewedById', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Submission.prototype, "reviewedById", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'grade', type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Submission.prototype, "grade", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'feedback', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Submission.prototype, "feedback", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'teacherNotes', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Submission.prototype, "teacherNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'attempts', type: 'int', default: 1 }),
    __metadata("design:type", Number)
], Submission.prototype, "attempts", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'isLate', type: 'tinyint', default: 0 }),
    __metadata("design:type", Number)
], Submission.prototype, "isLate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lateReason', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Submission.prototype, "lateReason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'datetime', precision: 6 }),
    __metadata("design:type", Date)
], Submission.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'datetime', precision: 6 }),
    __metadata("design:type", Date)
], Submission.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => assignment_entity_1.Assignment, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'taskId' }),
    __metadata("design:type", assignment_entity_1.Assignment)
], Submission.prototype, "task", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'studentId' }),
    __metadata("design:type", user_entity_1.User)
], Submission.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'reviewedById' }),
    __metadata("design:type", user_entity_1.User)
], Submission.prototype, "reviewer", void 0);
exports.Submission = Submission = __decorate([
    (0, typeorm_1.Entity)('submissions')
], Submission);
//# sourceMappingURL=submission.entity.js.map