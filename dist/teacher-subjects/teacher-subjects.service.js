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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherSubjectsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const teacher_subject_entity_1 = require("./entities/teacher-subject.entity");
const teacher_entity_1 = require("../teachers/entities/teacher.entity");
const subject_entity_1 = require("../subjects/entities/subject.entity");
const class_entity_1 = require("../classes/entities/class.entity");
let TeacherSubjectsService = class TeacherSubjectsService {
    constructor(teacherSubjectsRepository, teachersRepository, subjectsRepository, classesRepository) {
        this.teacherSubjectsRepository = teacherSubjectsRepository;
        this.teachersRepository = teachersRepository;
        this.subjectsRepository = subjectsRepository;
        this.classesRepository = classesRepository;
    }
    async assignSubjectsToTeacher(assignTeacherSubjectDto) {
        const teacher = await this.teachersRepository.findOne({
            where: { id: assignTeacherSubjectDto.teacherId }
        });
        if (!teacher) {
            throw new common_1.NotFoundException('Teacher not found');
        }
        const assignedSubjects = [];
        for (const subjectAssignment of assignTeacherSubjectDto.subjects) {
            const subject = await this.subjectsRepository.findOne({
                where: { id: subjectAssignment.subjectId }
            });
            if (!subject) {
                console.warn(`Subject with id ${subjectAssignment.subjectId} not found, skipping...`);
                continue;
            }
            if (subjectAssignment.classId) {
                const classEntity = await this.classesRepository.findOne({
                    where: { id: subjectAssignment.classId }
                });
                if (!classEntity) {
                    console.warn(`Class with id ${subjectAssignment.classId} not found, skipping...`);
                    continue;
                }
            }
            const existingAssignment = await this.teacherSubjectsRepository.findOne({
                where: {
                    teacherId: assignTeacherSubjectDto.teacherId,
                    subjectId: subjectAssignment.subjectId,
                    classId: subjectAssignment.classId || null,
                },
            });
            if (existingAssignment) {
                existingAssignment.isActive = 1;
                assignedSubjects.push(await this.teacherSubjectsRepository.save(existingAssignment));
            }
            else {
                const teacherSubject = this.teacherSubjectsRepository.create({
                    teacherId: assignTeacherSubjectDto.teacherId,
                    subjectId: subjectAssignment.subjectId,
                    classId: subjectAssignment.classId || null,
                    isActive: 1,
                });
                assignedSubjects.push(await this.teacherSubjectsRepository.save(teacherSubject));
            }
        }
        return assignedSubjects;
    }
    async getTeacherSubjects(teacherId) {
        return this.teacherSubjectsRepository.find({
            where: { teacherId, isActive: 1 },
            relations: ['subject', 'class'],
            order: { createdAt: 'DESC' },
        });
    }
    async getSubjectTeachers(subjectId) {
        return this.teacherSubjectsRepository.find({
            where: { subjectId, isActive: 1 },
            relations: ['teacher', 'class'],
            order: { createdAt: 'DESC' },
        });
    }
    async getClassTeachers(classId) {
        return this.teacherSubjectsRepository.find({
            where: { classId, isActive: 1 },
            relations: ['teacher', 'subject'],
            order: { createdAt: 'DESC' },
        });
    }
    async removeTeacherSubject(teacherId, subjectId, classId) {
        const whereClause = {
            teacherId,
            subjectId,
        };
        if (classId) {
            whereClause.classId = classId;
        }
        const assignment = await this.teacherSubjectsRepository.findOne({
            where: whereClause,
        });
        if (!assignment) {
            throw new common_1.NotFoundException('Teacher-Subject assignment not found');
        }
        assignment.isActive = 0;
        await this.teacherSubjectsRepository.save(assignment);
    }
    async removeAllTeacherSubjects(teacherId) {
        await this.teacherSubjectsRepository.update({ teacherId }, { isActive: 0 });
    }
};
exports.TeacherSubjectsService = TeacherSubjectsService;
exports.TeacherSubjectsService = TeacherSubjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(teacher_subject_entity_1.TeacherSubject)),
    __param(1, (0, typeorm_1.InjectRepository)(teacher_entity_1.Teacher)),
    __param(2, (0, typeorm_1.InjectRepository)(subject_entity_1.Subject)),
    __param(3, (0, typeorm_1.InjectRepository)(class_entity_1.Class)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TeacherSubjectsService);
//# sourceMappingURL=teacher-subjects.service.js.map