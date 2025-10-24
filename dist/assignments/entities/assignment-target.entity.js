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
exports.AssignmentTarget = exports.TargetType = void 0;
const typeorm_1 = require("typeorm");
const assignment_entity_1 = require("./assignment.entity");
var TargetType;
(function (TargetType) {
    TargetType["CLASS"] = "class";
    TargetType["STUDENT"] = "student";
    TargetType["TEACHER"] = "teacher";
})(TargetType || (exports.TargetType = TargetType = {}));
let AssignmentTarget = class AssignmentTarget {
};
exports.AssignmentTarget = AssignmentTarget;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AssignmentTarget.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], AssignmentTarget.prototype, "assignmentId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TargetType,
    }),
    __metadata("design:type", String)
], AssignmentTarget.prototype, "targetType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], AssignmentTarget.prototype, "targetId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AssignmentTarget.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => assignment_entity_1.Assignment, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'assignmentId' }),
    __metadata("design:type", assignment_entity_1.Assignment)
], AssignmentTarget.prototype, "assignment", void 0);
exports.AssignmentTarget = AssignmentTarget = __decorate([
    (0, typeorm_1.Entity)('assignment_targets')
], AssignmentTarget);
//# sourceMappingURL=assignment-target.entity.js.map