"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const assignments_controller_1 = require("./assignments.controller");
const assignments_service_1 = require("./assignments.service");
const assignment_entity_1 = require("./entities/assignment.entity");
const assignment_target_entity_1 = require("./entities/assignment-target.entity");
const student_entity_1 = require("../students/entities/student.entity");
const teacher_entity_1 = require("../teachers/entities/teacher.entity");
const teacher_class_entity_1 = require("../teachers/entities/teacher-class.entity");
let AssignmentsModule = class AssignmentsModule {
};
exports.AssignmentsModule = AssignmentsModule;
exports.AssignmentsModule = AssignmentsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([assignment_entity_1.Assignment, assignment_target_entity_1.AssignmentTarget, student_entity_1.Student, teacher_entity_1.Teacher, teacher_class_entity_1.TeacherClass])],
        controllers: [assignments_controller_1.AssignmentsController],
        providers: [assignments_service_1.AssignmentsService],
        exports: [assignments_service_1.AssignmentsService],
    })
], AssignmentsModule);
//# sourceMappingURL=assignments.module.js.map