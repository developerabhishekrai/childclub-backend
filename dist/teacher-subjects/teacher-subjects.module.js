"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherSubjectsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const teacher_subjects_controller_1 = require("./teacher-subjects.controller");
const teacher_subjects_service_1 = require("./teacher-subjects.service");
const teacher_subject_entity_1 = require("./entities/teacher-subject.entity");
const teacher_entity_1 = require("../teachers/entities/teacher.entity");
const subject_entity_1 = require("../subjects/entities/subject.entity");
const class_entity_1 = require("../classes/entities/class.entity");
let TeacherSubjectsModule = class TeacherSubjectsModule {
};
exports.TeacherSubjectsModule = TeacherSubjectsModule;
exports.TeacherSubjectsModule = TeacherSubjectsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([teacher_subject_entity_1.TeacherSubject, teacher_entity_1.Teacher, subject_entity_1.Subject, class_entity_1.Class])],
        controllers: [teacher_subjects_controller_1.TeacherSubjectsController],
        providers: [teacher_subjects_service_1.TeacherSubjectsService],
        exports: [teacher_subjects_service_1.TeacherSubjectsService],
    })
], TeacherSubjectsModule);
//# sourceMappingURL=teacher-subjects.module.js.map