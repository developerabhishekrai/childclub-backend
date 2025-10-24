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
exports.Task = exports.TaskStatus = exports.TaskPriority = exports.TaskType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const class_entity_1 = require("../../classes/entities/class.entity");
var TaskType;
(function (TaskType) {
    TaskType["HOMEWORK"] = "homework";
    TaskType["PROJECT"] = "project";
    TaskType["QUIZ"] = "quiz";
    TaskType["ASSIGNMENT"] = "assignment";
    TaskType["ACTIVITY"] = "activity";
    TaskType["EXAM"] = "exam";
})(TaskType || (exports.TaskType = TaskType = {}));
var TaskPriority;
(function (TaskPriority) {
    TaskPriority["LOW"] = "low";
    TaskPriority["MEDIUM"] = "medium";
    TaskPriority["HIGH"] = "high";
    TaskPriority["URGENT"] = "urgent";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["PENDING"] = "pending";
    TaskStatus["IN_PROGRESS"] = "in_progress";
    TaskStatus["COMPLETED"] = "completed";
    TaskStatus["OVERDUE"] = "overdue";
    TaskStatus["CANCELLED"] = "cancelled";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
let Task = class Task {
};
exports.Task = Task;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Task.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'title', type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], Task.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'text' }),
    __metadata("design:type", String)
], Task.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'type', type: 'enum', enum: TaskType, default: TaskType.HOMEWORK }),
    __metadata("design:type", String)
], Task.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'priority', type: 'enum', enum: TaskPriority, default: TaskPriority.MEDIUM }),
    __metadata("design:type", String)
], Task.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'enum', enum: TaskStatus, default: TaskStatus.PENDING }),
    __metadata("design:type", String)
], Task.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'assignedDate', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Task.prototype, "assignedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'completedDate', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Task.prototype, "completedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'maxScore', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Task.prototype, "maxScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'passingScore', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Task.prototype, "passingScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'instructions', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Task.prototype, "instructions", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rubric', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Task.prototype, "rubric", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'isActive', type: 'tinyint', default: 1 }),
    __metadata("design:type", Number)
], Task.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'isRecurring', type: 'tinyint', default: 0 }),
    __metadata("design:type", Number)
], Task.prototype, "isRecurring", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'recurringPattern', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Task.prototype, "recurringPattern", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'classId', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Task.prototype, "classId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'createdById', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Task.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dueDate', type: 'datetime' }),
    __metadata("design:type", Date)
], Task.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'attachments', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Task.prototype, "attachments", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tags', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Task.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'datetime', precision: 6 }),
    __metadata("design:type", Date)
], Task.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'datetime', precision: 6 }),
    __metadata("design:type", Date)
], Task.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => class_entity_1.Class, { onDelete: 'NO ACTION' }),
    (0, typeorm_1.JoinColumn)({ name: 'classId' }),
    __metadata("design:type", class_entity_1.Class)
], Task.prototype, "class", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'NO ACTION' }),
    (0, typeorm_1.JoinColumn)({ name: 'createdById' }),
    __metadata("design:type", user_entity_1.User)
], Task.prototype, "createdBy", void 0);
exports.Task = Task = __decorate([
    (0, typeorm_1.Entity)('tasks')
], Task);
//# sourceMappingURL=task.entity.js.map