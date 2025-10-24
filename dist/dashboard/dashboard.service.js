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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const student_entity_1 = require("../students/entities/student.entity");
const teacher_entity_1 = require("../teachers/entities/teacher.entity");
const class_entity_1 = require("../classes/entities/class.entity");
const task_entity_1 = require("../tasks/entities/task.entity");
const calendar_event_entity_1 = require("../calendar/entities/calendar-event.entity");
const user_entity_1 = require("../users/entities/user.entity");
const school_entity_1 = require("../schools/entities/school.entity");
let DashboardService = class DashboardService {
    constructor(studentsRepository, teachersRepository, classesRepository, tasksRepository, calendarEventsRepository, usersRepository, schoolsRepository) {
        this.studentsRepository = studentsRepository;
        this.teachersRepository = teachersRepository;
        this.classesRepository = classesRepository;
        this.tasksRepository = tasksRepository;
        this.calendarEventsRepository = calendarEventsRepository;
        this.usersRepository = usersRepository;
        this.schoolsRepository = schoolsRepository;
    }
    async getDashboardStats(schoolId, userId, userRole) {
        try {
            console.log('Dashboard Service - getDashboardStats called:', { schoolId, userId, userRole });
            const numericSchoolId = parseInt(String(schoolId));
            console.log('Dashboard Service - Converted schoolId:', numericSchoolId, 'type:', typeof numericSchoolId);
            if (!schoolId) {
                throw new Error('School ID is required');
            }
            if (userRole === 'teacher' && userId) {
                return await this.getTeacherDashboardStats(userId, numericSchoolId);
            }
            const totalStudents = await this.studentsRepository.count({ where: { schoolId: numericSchoolId, isActive: 1 } });
            const totalTeachers = await this.teachersRepository.count({ where: { schoolId: numericSchoolId, isActive: 1 } });
            const totalClasses = await this.classesRepository.count({ where: { schoolId: numericSchoolId, isActive: 1 } });
            const activeClasses = await this.classesRepository.count({ where: { schoolId: numericSchoolId, isActive: 1, status: class_entity_1.ClassStatus.ACTIVE } });
            console.log('Dashboard Service - Query results:', {
                totalStudents,
                totalTeachers,
                totalClasses,
                activeClasses,
                schoolId
            });
            const pendingTasks = await this.tasksRepository
                .createQueryBuilder('task')
                .leftJoin('task.class', 'class')
                .where('task.status = :status', { status: task_entity_1.TaskStatus.PENDING })
                .andWhere('task.isActive = :isActive', { isActive: 1 })
                .andWhere('class.schoolId = :schoolId', { schoolId })
                .getCount();
            const upcomingEvents = await this.calendarEventsRepository.count({
                where: {
                    schoolId,
                    isActive: 1,
                    status: calendar_event_entity_1.EventStatus.ACTIVE
                }
            });
            const attendanceRate = 94.5;
            const averageScore = 87.2;
            return {
                totalStudents,
                totalTeachers,
                totalClasses,
                activeClasses,
                pendingTasks,
                upcomingEvents,
                attendanceRate,
                averageScore
            };
        }
        catch (error) {
            console.error('Error getting dashboard stats:', error);
            return {
                totalStudents: 0,
                totalTeachers: 0,
                totalClasses: 0,
                activeClasses: 0,
                pendingTasks: 0,
                upcomingEvents: 0,
                attendanceRate: 0,
                averageScore: 0
            };
        }
    }
    async getTeacherDashboardStats(userId, schoolId) {
        try {
            console.log('Dashboard Service - getTeacherDashboardStats:', { userId, schoolId });
            const teacher = await this.teachersRepository.findOne({
                where: { userId, schoolId, isActive: 1 }
            });
            if (!teacher) {
                console.error('Teacher not found for userId:', userId);
                return {
                    totalStudents: 0,
                    totalTeachers: 0,
                    totalClasses: 0,
                    activeClasses: 0,
                    pendingTasks: 0,
                    upcomingEvents: 0,
                    attendanceRate: 0,
                    averageScore: 0
                };
            }
            console.log('Teacher found:', { teacherId: teacher.id });
            const teacherClasses = await this.classesRepository
                .createQueryBuilder('class')
                .leftJoin('teacher_subjects', 'ts', 'ts.classId = class.id')
                .where('ts.teacherId = :teacherId', { teacherId: teacher.id })
                .andWhere('class.isActive = :isActive', { isActive: 1 })
                .andWhere('class.schoolId = :schoolId', { schoolId })
                .select(['class.id'])
                .getMany();
            const classIds = teacherClasses.map(c => c.id);
            console.log('Teacher class IDs:', classIds);
            const totalClasses = classIds.length;
            const activeClasses = totalClasses;
            let totalStudents = 0;
            if (classIds.length > 0) {
                const studentCount = await this.studentsRepository
                    .createQueryBuilder('student')
                    .where('student.classId IN (:...classIds)', { classIds })
                    .andWhere('student.isActive = :isActive', { isActive: 1 })
                    .andWhere('student.schoolId = :schoolId', { schoolId })
                    .getCount();
                totalStudents = studentCount;
            }
            let pendingTasks = 0;
            if (classIds.length > 0) {
                pendingTasks = await this.tasksRepository
                    .createQueryBuilder('task')
                    .where('task.teacherId = :teacherId', { teacherId: teacher.id })
                    .andWhere('task.status = :status', { status: task_entity_1.TaskStatus.PENDING })
                    .andWhere('task.isActive = :isActive', { isActive: 1 })
                    .getCount();
            }
            let upcomingEvents = 0;
            if (classIds.length > 0) {
                upcomingEvents = await this.calendarEventsRepository
                    .createQueryBuilder('event')
                    .where('event.classId IN (:...classIds)', { classIds })
                    .andWhere('event.isActive = :isActive', { isActive: 1 })
                    .andWhere('event.status = :status', { status: calendar_event_entity_1.EventStatus.ACTIVE })
                    .getCount();
            }
            const attendanceRate = 90.0;
            const averageScore = 85.0;
            const result = {
                totalStudents,
                totalTeachers: 1,
                totalClasses,
                activeClasses,
                pendingTasks,
                upcomingEvents,
                attendanceRate,
                averageScore
            };
            console.log('Teacher dashboard stats result:', result);
            return result;
        }
        catch (error) {
            console.error('Error getting teacher dashboard stats:', error);
            return {
                totalStudents: 0,
                totalTeachers: 0,
                totalClasses: 0,
                activeClasses: 0,
                pendingTasks: 0,
                upcomingEvents: 0,
                attendanceRate: 0,
                averageScore: 0
            };
        }
    }
    async getRecentActivities(schoolId) {
        try {
            return [
                {
                    id: 1,
                    type: 'student_registration',
                    message: 'New student registered',
                    timestamp: new Date(),
                    details: 'Student John Doe was registered in Class 1A'
                },
                {
                    id: 2,
                    type: 'teacher_assignment',
                    message: 'Teacher assigned to class',
                    timestamp: new Date(Date.now() - 86400000),
                    details: 'Ms. Sarah Wilson assigned to Class 2A'
                },
                {
                    id: 3,
                    type: 'task_created',
                    message: 'New assignment created',
                    timestamp: new Date(Date.now() - 172800000),
                    details: 'Mathematics homework assigned to Class 3A'
                }
            ];
        }
        catch (error) {
            console.error('Error getting recent activities:', error);
            return [];
        }
    }
    async getSuperAdminStats() {
        try {
            const schoolsWithStudents = await this.studentsRepository
                .createQueryBuilder('student')
                .select('DISTINCT student.schoolId', 'schoolId')
                .where('student.isActive = :isActive', { isActive: 1 })
                .getRawMany();
            const schoolIdsWithStudents = schoolsWithStudents.map(s => s.schoolId);
            const totalSchools = schoolIdsWithStudents.length;
            const pendingSchools = schoolIdsWithStudents.length > 0
                ? await this.schoolsRepository.count({
                    where: {
                        status: school_entity_1.SchoolStatus.PENDING,
                        id: schoolIdsWithStudents.length === 1
                            ? schoolIdsWithStudents[0]
                            : require('typeorm').In(schoolIdsWithStudents)
                    }
                })
                : 0;
            const approvedSchools = schoolIdsWithStudents.length > 0
                ? await this.schoolsRepository.count({
                    where: {
                        status: school_entity_1.SchoolStatus.APPROVED,
                        id: schoolIdsWithStudents.length === 1
                            ? schoolIdsWithStudents[0]
                            : require('typeorm').In(schoolIdsWithStudents)
                    }
                })
                : 0;
            const schoolAdminsWithStudents = schoolIdsWithStudents.length > 0
                ? await this.schoolsRepository
                    .createQueryBuilder('school')
                    .select('DISTINCT school.userId', 'userId')
                    .where('school.id IN (:...schoolIds)', { schoolIds: schoolIdsWithStudents })
                    .andWhere('school.userId IS NOT NULL')
                    .getRawMany()
                : [];
            const totalAdmins = schoolAdminsWithStudents.length;
            const totalTeachers = schoolIdsWithStudents.length > 0
                ? await this.teachersRepository.count({
                    where: {
                        isActive: 1,
                        schoolId: schoolIdsWithStudents.length === 1
                            ? schoolIdsWithStudents[0]
                            : require('typeorm').In(schoolIdsWithStudents)
                    }
                })
                : 0;
            const totalStudents = await this.studentsRepository.count({
                where: { isActive: 1 }
            });
            const activeUsers = totalStudents + totalTeachers;
            return {
                totalSchools,
                pendingSchools,
                approvedSchools,
                totalAdmins,
                totalTeachers,
                totalStudents,
                activeUsers,
                systemHealth: totalSchools > 0 ? 'Excellent' : 'No Active Schools'
            };
        }
        catch (error) {
            console.error('Error getting super admin stats:', error);
            return {
                totalSchools: 0,
                pendingSchools: 0,
                approvedSchools: 0,
                totalAdmins: 0,
                totalTeachers: 0,
                totalStudents: 0,
                activeUsers: 0,
                systemHealth: 'Error'
            };
        }
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __param(1, (0, typeorm_1.InjectRepository)(teacher_entity_1.Teacher)),
    __param(2, (0, typeorm_1.InjectRepository)(class_entity_1.Class)),
    __param(3, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __param(4, (0, typeorm_1.InjectRepository)(calendar_event_entity_1.CalendarEvent)),
    __param(5, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(6, (0, typeorm_1.InjectRepository)(school_entity_1.School)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map