import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Class, ClassStatus } from '../classes/entities/class.entity';
import { Task, TaskStatus } from '../tasks/entities/task.entity';
import { CalendarEvent, EventStatus } from '../calendar/entities/calendar-event.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { School, SchoolStatus } from '../schools/entities/school.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Student) private readonly studentsRepository: Repository<Student>,
    @InjectRepository(Teacher) private readonly teachersRepository: Repository<Teacher>,
    @InjectRepository(Class) private readonly classesRepository: Repository<Class>,
    @InjectRepository(Task) private readonly tasksRepository: Repository<Task>,
    @InjectRepository(CalendarEvent) private readonly calendarEventsRepository: Repository<CalendarEvent>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(School) private readonly schoolsRepository: Repository<School>,
  ) {}

  async getDashboardStats(schoolId: number, userId?: number, userRole?: string) {
    try {
      console.log('Dashboard Service - getDashboardStats called:', { schoolId, userId, userRole });
      
      // Ensure schoolId is a number
      const numericSchoolId = parseInt(String(schoolId));
      console.log('Dashboard Service - Converted schoolId:', numericSchoolId, 'type:', typeof numericSchoolId);
      
      if (!schoolId) {
        throw new Error('School ID is required');
      }

      // If teacher, get teacher-specific stats
      if (userRole === 'teacher' && userId) {
        return await this.getTeacherDashboardStats(userId, numericSchoolId);
      }

      // For school admin or other roles, return school-level stats
      const totalStudents = await this.studentsRepository.count({ where: { schoolId: numericSchoolId, isActive: 1 } });
      const totalTeachers = await this.teachersRepository.count({ where: { schoolId: numericSchoolId, isActive: 1 } });
      const totalClasses = await this.classesRepository.count({ where: { schoolId: numericSchoolId, isActive: 1 } });
      const activeClasses = await this.classesRepository.count({ where: { schoolId: numericSchoolId, isActive: 1, status: ClassStatus.ACTIVE } });
      
      console.log('Dashboard Service - Query results:', {
        totalStudents,
        totalTeachers,
        totalClasses,
        activeClasses,
        schoolId
      });
      
      // Count pending tasks for the specific school
      const pendingTasks = await this.tasksRepository
        .createQueryBuilder('task')
        .leftJoin('task.class', 'class')
        .where('task.status = :status', { status: TaskStatus.PENDING })
        .andWhere('task.isActive = :isActive', { isActive: 1 })
        .andWhere('class.schoolId = :schoolId', { schoolId })
        .getCount();

      // Count upcoming events for the specific school
      const upcomingEvents = await this.calendarEventsRepository.count({
        where: {
          schoolId,
          isActive: 1,
          status: EventStatus.ACTIVE
        }
      });

      // Calculate mock averages (can be enhanced with real data later)
      const attendanceRate = 94.5; // Mock data
      const averageScore = 87.2; // Mock data

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
    } catch (error) {
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

  async getTeacherDashboardStats(userId: number, schoolId: number) {
    try {
      console.log('Dashboard Service - getTeacherDashboardStats:', { userId, schoolId });

      // Get teacher record to find their ID
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

      // Get classes assigned to this teacher (from teacher_subjects table)
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
      const activeClasses = totalClasses; // For now, all are active

      // Count students in teacher's classes
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

      // Count pending tasks created by this teacher
      let pendingTasks = 0;
      if (classIds.length > 0) {
        pendingTasks = await this.tasksRepository
          .createQueryBuilder('task')
          .where('task.teacherId = :teacherId', { teacherId: teacher.id })
          .andWhere('task.status = :status', { status: TaskStatus.PENDING })
          .andWhere('task.isActive = :isActive', { isActive: 1 })
          .getCount();
      }

      // Count upcoming events for teacher's classes
      let upcomingEvents = 0;
      if (classIds.length > 0) {
        upcomingEvents = await this.calendarEventsRepository
          .createQueryBuilder('event')
          .where('event.classId IN (:...classIds)', { classIds })
          .andWhere('event.isActive = :isActive', { isActive: 1 })
          .andWhere('event.status = :status', { status: EventStatus.ACTIVE })
          .getCount();
      }

      // Mock averages for teacher
      const attendanceRate = 90.0;
      const averageScore = 85.0;

      const result = {
        totalStudents,
        totalTeachers: 1, // Teacher themselves
        totalClasses,
        activeClasses,
        pendingTasks,
        upcomingEvents,
        attendanceRate,
        averageScore
      };

      console.log('Teacher dashboard stats result:', result);
      return result;

    } catch (error) {
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

  async getRecentActivities(schoolId: number) {
    try {
      // For now, return mock data since we need to implement proper activity tracking
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
          timestamp: new Date(Date.now() - 86400000), // 1 day ago
          details: 'Ms. Sarah Wilson assigned to Class 2A'
        },
        {
          id: 3,
          type: 'task_created',
          message: 'New assignment created',
          timestamp: new Date(Date.now() - 172800000), // 2 days ago
          details: 'Mathematics homework assigned to Class 3A'
        }
      ];
    } catch (error) {
      console.error('Error getting recent activities:', error);
      return [];
    }
  }

  async getSuperAdminStats() {
    try {
      // Get unique school IDs that have students
      const schoolsWithStudents = await this.studentsRepository
        .createQueryBuilder('student')
        .select('DISTINCT student.schoolId', 'schoolId')
        .where('student.isActive = :isActive', { isActive: 1 })
        .getRawMany();

      const schoolIdsWithStudents = schoolsWithStudents.map(s => s.schoolId);

      // Total schools count (only schools with students)
      const totalSchools = schoolIdsWithStudents.length;
      
      // Pending schools count (only those with students)
      const pendingSchools = schoolIdsWithStudents.length > 0 
        ? await this.schoolsRepository.count({ 
            where: { 
              status: SchoolStatus.PENDING,
              id: schoolIdsWithStudents.length === 1 
                ? schoolIdsWithStudents[0] 
                : require('typeorm').In(schoolIdsWithStudents)
            } 
          })
        : 0;

      // Approved schools count (only those with students)
      const approvedSchools = schoolIdsWithStudents.length > 0
        ? await this.schoolsRepository.count({ 
            where: { 
              status: SchoolStatus.APPROVED,
              id: schoolIdsWithStudents.length === 1 
                ? schoolIdsWithStudents[0] 
                : require('typeorm').In(schoolIdsWithStudents)
            } 
          })
        : 0;

      // School admins count (only for schools with students)
      const schoolAdminsWithStudents = schoolIdsWithStudents.length > 0
        ? await this.schoolsRepository
            .createQueryBuilder('school')
            .select('DISTINCT school.userId', 'userId')
            .where('school.id IN (:...schoolIds)', { schoolIds: schoolIdsWithStudents })
            .andWhere('school.userId IS NOT NULL')
            .getRawMany()
        : [];

      const totalAdmins = schoolAdminsWithStudents.length;

      // Teachers count (only from schools with students)
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

      // Total students count (active students only)
      const totalStudents = await this.studentsRepository.count({ 
        where: { isActive: 1 } 
      });

      // Active users count (students + teachers from schools with students)
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
    } catch (error) {
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
}
