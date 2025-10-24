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
exports.ClassesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const class_entity_1 = require("./entities/class.entity");
const school_entity_1 = require("../schools/entities/school.entity");
const user_entity_1 = require("../users/entities/user.entity");
let ClassesService = class ClassesService {
    constructor(classesRepository, schoolsRepository, usersRepository) {
        this.classesRepository = classesRepository;
        this.schoolsRepository = schoolsRepository;
        this.usersRepository = usersRepository;
    }
    async createClass(createClassDto, createdBy) {
        const school = await this.schoolsRepository.findOne({ where: { id: parseInt(createClassDto.schoolId) } });
        if (!school) {
            throw new common_1.NotFoundException('School not found');
        }
        if (createClassDto.classTeacherId) {
            const teacher = await this.usersRepository.findOne({
                where: { id: parseInt(createClassDto.classTeacherId), role: user_entity_1.UserRole.TEACHER }
            });
            if (!teacher) {
                throw new common_1.NotFoundException('Class teacher not found');
            }
        }
        const existingClass = await this.classesRepository.findOne({
            where: {
                name: createClassDto.name,
                grade: createClassDto.grade,
                section: createClassDto.section,
                school: { id: parseInt(createClassDto.schoolId) },
            },
        });
        if (existingClass) {
            throw new common_1.BadRequestException('Class with this name already exists');
        }
        const classEntity = this.classesRepository.create({
            name: createClassDto.name,
            grade: createClassDto.grade,
            section: createClassDto.section,
            description: createClassDto.description,
            academicYear: createClassDto.academicYear,
            maxStudents: parseInt(createClassDto.maxStudents.toString()),
            subjects: createClassDto.subjects,
            syllabus: createClassDto.syllabus,
            rules: createClassDto.rules,
            startDate: createClassDto.startDate ? new Date(createClassDto.startDate) : null,
            endDate: createClassDto.endDate ? new Date(createClassDto.endDate) : null,
            schoolId: parseInt(createClassDto.schoolId),
            classTeacherId: createClassDto.classTeacherId ? parseInt(createClassDto.classTeacherId.toString()) : null,
            currentStudents: 0,
            status: class_entity_1.ClassStatus.ACTIVE,
        });
        return this.classesRepository.save(classEntity);
    }
    async findAllClasses(schoolId) {
        return this.classesRepository.find({
            where: { schoolId: schoolId, isActive: 1 },
            relations: ['classTeacher'],
            order: { grade: 'ASC', name: 'ASC' },
        });
    }
    async findClassById(id) {
        const classEntity = await this.classesRepository.findOne({
            where: { id, isActive: 1 }
        });
        if (!classEntity) {
            throw new common_1.NotFoundException('Class not found');
        }
        return classEntity;
    }
    async updateClass(id, updateClassDto) {
        const classEntity = await this.findClassById(id);
        if (updateClassDto.classTeacherId) {
            const teacher = await this.usersRepository.findOne({
                where: { id: parseInt(updateClassDto.classTeacherId), role: user_entity_1.UserRole.TEACHER }
            });
            if (!teacher) {
                throw new common_1.NotFoundException('Class teacher not found');
            }
        }
        Object.assign(classEntity, updateClassDto);
        return this.classesRepository.save(classEntity);
    }
    async deleteClass(id) {
        const classEntity = await this.findClassById(id);
        if (classEntity.currentStudents > 0) {
            throw new common_1.BadRequestException('Cannot delete class with students');
        }
        await this.classesRepository.remove(classEntity);
    }
    async getClassStats(schoolId) {
        const stats = await this.classesRepository
            .createQueryBuilder('class')
            .select('class.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .where('class.school = :schoolId', { schoolId })
            .groupBy('class.status')
            .getRawMany();
        const result = {
            total: 0,
            active: 0,
            inactive: 0,
            completed: 0,
        };
        stats.forEach((stat) => {
            const count = parseInt(stat.count);
            result.total += count;
            result[stat.status] = count;
        });
        return result;
    }
    async addStudentToClass(classId, studentId) {
        const classEntity = await this.findClassById(classId);
        const student = await this.usersRepository.findOne({
            where: { id: studentId, role: user_entity_1.UserRole.STUDENT }
        });
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        if (classEntity.maxStudents && classEntity.currentStudents >= classEntity.maxStudents) {
            throw new common_1.BadRequestException('Class is full');
        }
        await this.classesRepository
            .createQueryBuilder()
            .insert()
            .into('class_students')
            .values({ classId, studentId })
            .execute();
        classEntity.currentStudents += 1;
        await this.classesRepository.save(classEntity);
    }
    async removeStudentFromClass(classId, studentId) {
        const classEntity = await this.findClassById(classId);
        await this.classesRepository
            .createQueryBuilder()
            .delete()
            .from('class_students')
            .where('classId = :classId AND studentId = :studentId', { classId, studentId })
            .execute();
        if (classEntity.currentStudents > 0) {
            classEntity.currentStudents -= 1;
            await this.classesRepository.save(classEntity);
        }
    }
    async getClassesByGrade(schoolId, grade) {
        return this.classesRepository.find({
            where: { school: { id: schoolId }, grade },
            relations: ['school', 'classTeacher'],
            order: { name: 'ASC' },
        });
    }
};
exports.ClassesService = ClassesService;
exports.ClassesService = ClassesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(class_entity_1.Class)),
    __param(1, (0, typeorm_1.InjectRepository)(school_entity_1.School)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ClassesService);
//# sourceMappingURL=classes.service.js.map