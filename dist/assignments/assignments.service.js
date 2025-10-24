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
exports.AssignmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const assignment_entity_1 = require("./entities/assignment.entity");
const assignment_target_entity_1 = require("./entities/assignment-target.entity");
const student_entity_1 = require("../students/entities/student.entity");
const teacher_entity_1 = require("../teachers/entities/teacher.entity");
const teacher_class_entity_1 = require("../teachers/entities/teacher-class.entity");
let AssignmentsService = class AssignmentsService {
    constructor(assignmentRepository, assignmentTargetRepository, studentRepository, teacherRepository, teacherClassRepository) {
        this.assignmentRepository = assignmentRepository;
        this.assignmentTargetRepository = assignmentTargetRepository;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.teacherClassRepository = teacherClassRepository;
    }
    async create(createAssignmentDto, userId, schoolId) {
        const { assignedClasses, assignedStudents, assignedTeachers, ...assignmentData } = createAssignmentDto;
        if ((!assignedClasses || assignedClasses.length === 0) &&
            (!assignedStudents || assignedStudents.length === 0) &&
            (!assignedTeachers || assignedTeachers.length === 0)) {
            throw new common_1.BadRequestException('Must assign to at least one class, student, or teacher');
        }
        const assignment = this.assignmentRepository.create({
            ...assignmentData,
            schoolId,
            createdBy: userId,
        });
        const savedAssignment = await this.assignmentRepository.save(assignment);
        const targets = [];
        if (assignedClasses && assignedClasses.length > 0) {
            assignedClasses.forEach((classId) => {
                targets.push({
                    assignmentId: savedAssignment.id,
                    targetType: assignment_target_entity_1.TargetType.CLASS,
                    targetId: classId,
                });
            });
        }
        if (assignedStudents && assignedStudents.length > 0) {
            assignedStudents.forEach((studentId) => {
                targets.push({
                    assignmentId: savedAssignment.id,
                    targetType: assignment_target_entity_1.TargetType.STUDENT,
                    targetId: studentId,
                });
            });
        }
        if (assignedTeachers && assignedTeachers.length > 0) {
            assignedTeachers.forEach((teacherId) => {
                targets.push({
                    assignmentId: savedAssignment.id,
                    targetType: assignment_target_entity_1.TargetType.TEACHER,
                    targetId: teacherId,
                });
            });
        }
        await this.assignmentTargetRepository.save(targets);
        return savedAssignment;
    }
    async findAll(schoolId, filters) {
        const query = this.assignmentRepository
            .createQueryBuilder('assignment')
            .where('assignment.schoolId = :schoolId', { schoolId });
        if (filters?.type) {
            query.andWhere('assignment.type = :type', { type: filters.type });
        }
        if (filters?.priority) {
            query.andWhere('assignment.priority = :priority', { priority: filters.priority });
        }
        const assignments = await query
            .orderBy('assignment.dueDate', 'DESC')
            .getMany();
        if (filters?.targetType && filters?.targetId) {
            const targetAssignmentIds = await this.assignmentTargetRepository
                .createQueryBuilder('target')
                .select('target.assignmentId')
                .where('target.targetType = :targetType', { targetType: filters.targetType })
                .andWhere('target.targetId = :targetId', { targetId: filters.targetId })
                .getRawMany();
            const ids = targetAssignmentIds.map((t) => t.target_assignmentId);
            return assignments.filter((a) => ids.includes(a.id));
        }
        const assignmentIds = assignments.map((a) => a.id);
        if (assignmentIds.length === 0) {
            return [];
        }
        const targets = await this.assignmentTargetRepository.find({
            where: { assignmentId: (0, typeorm_2.In)(assignmentIds) },
        });
        const targetsByAssignment = targets.reduce((acc, target) => {
            if (!acc[target.assignmentId]) {
                acc[target.assignmentId] = { classes: [], students: [], teachers: [] };
            }
            if (target.targetType === assignment_target_entity_1.TargetType.CLASS) {
                acc[target.assignmentId].classes.push(target.targetId);
            }
            else if (target.targetType === assignment_target_entity_1.TargetType.STUDENT) {
                acc[target.assignmentId].students.push(target.targetId);
            }
            else if (target.targetType === assignment_target_entity_1.TargetType.TEACHER) {
                acc[target.assignmentId].teachers.push(target.targetId);
            }
            return acc;
        }, {});
        return assignments.map((assignment) => ({
            ...assignment,
            assignedClasses: targetsByAssignment[assignment.id]?.classes || [],
            assignedStudents: targetsByAssignment[assignment.id]?.students || [],
            assignedTeachers: targetsByAssignment[assignment.id]?.teachers || [],
        }));
    }
    async findOne(id, schoolId) {
        const assignment = await this.assignmentRepository.findOne({
            where: { id, schoolId },
        });
        if (!assignment) {
            throw new common_1.NotFoundException(`Assignment with ID ${id} not found`);
        }
        const targets = await this.assignmentTargetRepository.find({
            where: { assignmentId: id },
        });
        const assignedClasses = targets.filter((t) => t.targetType === assignment_target_entity_1.TargetType.CLASS).map((t) => t.targetId);
        const assignedStudents = targets.filter((t) => t.targetType === assignment_target_entity_1.TargetType.STUDENT).map((t) => t.targetId);
        const assignedTeachers = targets.filter((t) => t.targetType === assignment_target_entity_1.TargetType.TEACHER).map((t) => t.targetId);
        return {
            ...assignment,
            assignedClasses,
            assignedStudents,
            assignedTeachers,
        };
    }
    async update(id, updateAssignmentDto, schoolId) {
        const assignment = await this.assignmentRepository.findOne({
            where: { id, schoolId },
        });
        if (!assignment) {
            throw new common_1.NotFoundException(`Assignment with ID ${id} not found`);
        }
        const { assignedClasses, assignedStudents, assignedTeachers, ...assignmentData } = updateAssignmentDto;
        Object.assign(assignment, assignmentData);
        const updatedAssignment = await this.assignmentRepository.save(assignment);
        if (assignedClasses !== undefined || assignedStudents !== undefined || assignedTeachers !== undefined) {
            await this.assignmentTargetRepository.delete({ assignmentId: id });
            const targets = [];
            if (assignedClasses && assignedClasses.length > 0) {
                assignedClasses.forEach((classId) => {
                    targets.push({
                        assignmentId: id,
                        targetType: assignment_target_entity_1.TargetType.CLASS,
                        targetId: classId,
                    });
                });
            }
            if (assignedStudents && assignedStudents.length > 0) {
                assignedStudents.forEach((studentId) => {
                    targets.push({
                        assignmentId: id,
                        targetType: assignment_target_entity_1.TargetType.STUDENT,
                        targetId: studentId,
                    });
                });
            }
            if (assignedTeachers && assignedTeachers.length > 0) {
                assignedTeachers.forEach((teacherId) => {
                    targets.push({
                        assignmentId: id,
                        targetType: assignment_target_entity_1.TargetType.TEACHER,
                        targetId: teacherId,
                    });
                });
            }
            if (targets.length > 0) {
                await this.assignmentTargetRepository.save(targets);
            }
        }
        return updatedAssignment;
    }
    async remove(id, schoolId) {
        const assignment = await this.assignmentRepository.findOne({
            where: { id, schoolId },
        });
        if (!assignment) {
            throw new common_1.NotFoundException(`Assignment with ID ${id} not found`);
        }
        await this.assignmentRepository.remove(assignment);
    }
    async getAssignmentsByClass(classId, schoolId) {
        return this.findAll(schoolId, { targetType: 'class', targetId: classId });
    }
    async getAssignmentsByStudent(studentId, schoolId) {
        const student = await this.studentRepository.findOne({
            where: { userId: studentId, schoolId, isActive: 1 }
        });
        if (!student) {
            console.log(`[Assignments Service] No student found for userId: ${studentId}, schoolId: ${schoolId}`);
            return [];
        }
        console.log(`[Assignments Service] Student found - ID: ${student.id}, userId: ${student.userId}, currentClassId: ${student.currentClassId}, schoolId: ${student.schoolId}`);
        const allAssignments = await this.findAll(schoolId);
        console.log(`[Assignments Service] Total assignments in school: ${allAssignments.length}`);
        const relevantAssignments = allAssignments.filter((assignment) => {
            const hasTargets = ((assignment.assignedClasses && assignment.assignedClasses.length > 0) ||
                (assignment.assignedStudents && assignment.assignedStudents.length > 0) ||
                (assignment.assignedTeachers && assignment.assignedTeachers.length > 0));
            if (!hasTargets) {
                console.log(`[Assignments Service] Assignment ${assignment.id} has NO targets - EXCLUDING`);
                return false;
            }
            if (assignment.assignedStudents && assignment.assignedStudents.length > 0) {
                if (assignment.assignedStudents.includes(student.id)) {
                    console.log(`[Assignments Service] ✓ Assignment ${assignment.id} is directly assigned to student ID ${student.id}`);
                    return true;
                }
            }
            if (student.currentClassId && assignment.assignedClasses && assignment.assignedClasses.length > 0) {
                if (assignment.assignedClasses.includes(student.currentClassId)) {
                    console.log(`[Assignments Service] ✓ Assignment ${assignment.id} is assigned to student's class ${student.currentClassId}`);
                    return true;
                }
            }
            console.log(`[Assignments Service] ✗ Assignment ${assignment.id} NOT relevant to student ${student.id} (classId: ${student.currentClassId})`);
            return false;
        });
        console.log(`[Assignments Service] Found ${relevantAssignments.length} relevant assignments for student ${studentId}`);
        relevantAssignments.forEach((assignment) => {
            console.log(`  - Assignment ${assignment.id}: "${assignment.title}" - Classes: [${assignment.assignedClasses}], Students: [${assignment.assignedStudents}]`);
        });
        return relevantAssignments;
    }
    async getAssignmentsByTeacher(teacherId, schoolId) {
        return this.findAll(schoolId, { targetType: 'teacher', targetId: teacherId });
    }
    async getAssignmentsByCreator(createdBy, schoolId) {
        const query = this.assignmentRepository
            .createQueryBuilder('assignment')
            .where('assignment.schoolId = :schoolId', { schoolId })
            .andWhere('assignment.createdBy = :createdBy', { createdBy })
            .orderBy('assignment.dueDate', 'DESC');
        const assignments = await query.getMany();
        const assignmentIds = assignments.map((a) => a.id);
        if (assignmentIds.length === 0) {
            return [];
        }
        const targets = await this.assignmentTargetRepository.find({
            where: { assignmentId: (0, typeorm_2.In)(assignmentIds) },
        });
        const targetsByAssignment = targets.reduce((acc, target) => {
            if (!acc[target.assignmentId]) {
                acc[target.assignmentId] = { classes: [], students: [], teachers: [] };
            }
            if (target.targetType === assignment_target_entity_1.TargetType.CLASS) {
                acc[target.assignmentId].classes.push(target.targetId);
            }
            else if (target.targetType === assignment_target_entity_1.TargetType.STUDENT) {
                acc[target.assignmentId].students.push(target.targetId);
            }
            else if (target.targetType === assignment_target_entity_1.TargetType.TEACHER) {
                acc[target.assignmentId].teachers.push(target.targetId);
            }
            return acc;
        }, {});
        return assignments.map((assignment) => ({
            ...assignment,
            assignedClasses: targetsByAssignment[assignment.id]?.classes || [],
            assignedStudents: targetsByAssignment[assignment.id]?.students || [],
            assignedTeachers: targetsByAssignment[assignment.id]?.teachers || [],
        }));
    }
    async getAssignmentsForTeacher(userId, schoolId) {
        console.log(`[Assignments Service] Getting assignments for teacher userId: ${userId}, schoolId: ${schoolId}`);
        const teacher = await this.teacherRepository.findOne({
            where: { userId, schoolId, isActive: 1 }
        });
        if (!teacher) {
            console.log(`[Assignments Service] No teacher found for userId: ${userId}`);
            return [];
        }
        console.log(`[Assignments Service] Teacher found: ${teacher.id}`);
        const teacherClasses = await this.teacherClassRepository.find({
            where: { teacherId: teacher.id, isActive: 1 }
        });
        const classIds = teacherClasses.map(tc => tc.classId);
        console.log(`[Assignments Service] Teacher has ${classIds.length} assigned classes:`, classIds);
        let studentIds = [];
        if (classIds.length > 0) {
            const students = await this.studentRepository.find({
                where: {
                    currentClassId: (0, typeorm_2.In)(classIds),
                    schoolId,
                    isActive: 1
                }
            });
            studentIds = students.map(s => s.id);
            console.log(`[Assignments Service] Found ${studentIds.length} students in teacher's classes`);
        }
        const allAssignments = await this.findAll(schoolId);
        console.log(`[Assignments Service] Total assignments in school: ${allAssignments.length}`);
        const relevantAssignments = allAssignments.filter((assignment) => {
            if (assignment.createdBy === userId) {
                console.log(`[Assignments Service] Assignment ${assignment.id} created by teacher ${userId}`);
                return true;
            }
            if (classIds.length > 0 && assignment.assignedClasses && assignment.assignedClasses.length > 0) {
                const hasTeacherClass = assignment.assignedClasses.some((classId) => classIds.includes(classId));
                if (hasTeacherClass) {
                    console.log(`[Assignments Service] Assignment ${assignment.id} assigned to teacher's class`);
                    return true;
                }
            }
            if (studentIds.length > 0 && assignment.assignedStudents && assignment.assignedStudents.length > 0) {
                const hasTeacherStudent = assignment.assignedStudents.some((studentId) => studentIds.includes(studentId));
                if (hasTeacherStudent) {
                    console.log(`[Assignments Service] Assignment ${assignment.id} assigned to teacher's student`);
                    return true;
                }
            }
            return false;
        });
        console.log(`[Assignments Service] Found ${relevantAssignments.length} relevant assignments for teacher`);
        return relevantAssignments;
    }
    async getAssignmentsForTeacherSpecificStudents(userId, schoolId) {
        console.log(`[Assignments Service] Getting assignments for teacher's specific students - userId: ${userId}, schoolId: ${schoolId}`);
        const teacher = await this.teacherRepository.findOne({
            where: { userId, schoolId, isActive: 1 }
        });
        if (!teacher) {
            console.log(`[Assignments Service] No teacher found for userId: ${userId}`);
            return [];
        }
        console.log(`[Assignments Service] Teacher found: ${teacher.id}`);
        const teacherClasses = await this.teacherClassRepository.find({
            where: { teacherId: teacher.id, isActive: 1 }
        });
        const classIds = teacherClasses.map(tc => tc.classId);
        console.log(`[Assignments Service] Teacher has ${classIds.length} assigned classes:`, classIds);
        let studentIds = [];
        if (classIds.length > 0) {
            const students = await this.studentRepository.find({
                where: {
                    currentClassId: (0, typeorm_2.In)(classIds),
                    schoolId,
                    isActive: 1
                }
            });
            studentIds = students.map(s => s.id);
            console.log(`[Assignments Service] Found ${studentIds.length} students in teacher's classes`);
        }
        const allAssignments = await this.findAll(schoolId);
        console.log(`[Assignments Service] Total assignments in school: ${allAssignments.length}`);
        const relevantAssignments = allAssignments.filter((assignment) => {
            if (assignment.createdBy === userId) {
                const hasSpecificAssignments = (assignment.assignedClasses && assignment.assignedClasses.length > 0) ||
                    (assignment.assignedStudents && assignment.assignedStudents.length > 0);
                if (hasSpecificAssignments) {
                    console.log(`[Assignments Service] Assignment ${assignment.id} created by teacher ${userId} with specific assignments`);
                    return true;
                }
            }
            if (classIds.length > 0 && assignment.assignedClasses && assignment.assignedClasses.length > 0) {
                const hasTeacherClass = assignment.assignedClasses.some((classId) => classIds.includes(classId));
                if (hasTeacherClass) {
                    console.log(`[Assignments Service] Assignment ${assignment.id} assigned to teacher's class by admin`);
                    return true;
                }
            }
            if (studentIds.length > 0 && assignment.assignedStudents && assignment.assignedStudents.length > 0) {
                const hasTeacherStudent = assignment.assignedStudents.some((studentId) => studentIds.includes(studentId));
                if (hasTeacherStudent) {
                    console.log(`[Assignments Service] Assignment ${assignment.id} assigned to teacher's student by admin`);
                    return true;
                }
            }
            return false;
        });
        console.log(`[Assignments Service] Found ${relevantAssignments.length} relevant assignments for teacher's specific students`);
        return relevantAssignments;
    }
};
exports.AssignmentsService = AssignmentsService;
exports.AssignmentsService = AssignmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(assignment_entity_1.Assignment)),
    __param(1, (0, typeorm_1.InjectRepository)(assignment_target_entity_1.AssignmentTarget)),
    __param(2, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __param(3, (0, typeorm_1.InjectRepository)(teacher_entity_1.Teacher)),
    __param(4, (0, typeorm_1.InjectRepository)(teacher_class_entity_1.TeacherClass)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AssignmentsService);
//# sourceMappingURL=assignments.service.js.map