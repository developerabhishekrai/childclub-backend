import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { User, UserRole, UserStatus } from '../users/entities/user.entity';
import { School } from '../schools/entities/school.entity';
import { Class } from '../classes/entities/class.entity';
import { Teacher, TeacherStatus } from './entities/teacher.entity';
import { TeacherClass } from './entities/teacher-class.entity';
import { Subject } from '../subjects/entities/subject.entity';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

export interface CreateTeacherDto {
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  password: string;
  dateOfBirth?: Date;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  schoolId: string;
  subjects?: string[];
  qualification?: string;
  specialization?: string;
  experienceYears?: number;
  department?: string;
  designation?: string;
  joiningDate?: Date;
  salary?: number;
  emergencyContact?: string;
  classIds?: number[];
}

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(School)
    private schoolsRepository: Repository<School>,
    @InjectRepository(Class)
    private classesRepository: Repository<Class>,
    @InjectRepository(Teacher)
    private teachersRepository: Repository<Teacher>,
    @InjectRepository(TeacherClass)
    private teacherClassesRepository: Repository<TeacherClass>,
    @InjectRepository(Subject)
    private subjectsRepository: Repository<Subject>,
  ) {}

  async createTeacher(createTeacherDto: CreateTeacherDto, createdBy: string): Promise<any> {
    // Check if school exists
    const school = await this.schoolsRepository.findOne({ where: { id: parseInt(createTeacherDto.schoolId) } });
    if (!school) {
      throw new NotFoundException('School not found');
    }

    // Check if email already exists
    const existingUser = await this.usersRepository.findOne({ where: { email: createTeacherDto.email } });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // Don't hash password here - let the User entity's @BeforeInsert hook handle it
    // const hashedPassword = await hash(createTeacherDto.password, 10);

    // Create user record
    const user = this.usersRepository.create({
      firstName: createTeacherDto.firstName,
      lastName: createTeacherDto.lastName,
      email: createTeacherDto.email,
      mobile: createTeacherDto.mobile,
      password: createTeacherDto.password, // Pass plain password - entity hook will hash it
      role: UserRole.TEACHER,
      status: UserStatus.ACTIVE,
      city: createTeacherDto.city,
      state: createTeacherDto.state,
      country: createTeacherDto.country,
      postalCode: createTeacherDto.postalCode,
      address: createTeacherDto.address,
      dateOfBirth: createTeacherDto.dateOfBirth,
    });

    const savedUser = await this.usersRepository.save(user);

    // Create teacher record with additional info
    const employeeId = `TCH${Date.now().toString().slice(-8)}`;
    const teacher = this.teachersRepository.create({
      userId: savedUser.id,
      schoolId: parseInt(createTeacherDto.schoolId),
      employeeId: employeeId,
      qualification: createTeacherDto.qualification || '',
      specialization: createTeacherDto.specialization || '',
      experienceYears: createTeacherDto.experienceYears || 0,
      department: createTeacherDto.department || '',
      designation: createTeacherDto.designation || '',
      joiningDate: createTeacherDto.joiningDate || new Date(),
      salary: createTeacherDto.salary || null,
      emergencyContact: createTeacherDto.emergencyContact || '',
      subjects: createTeacherDto.subjects || [],
      status: TeacherStatus.ACTIVE,
      isActive: 1,
    });

    await this.teachersRepository.save(teacher);

    // Handle multiple class assignments
    if (createTeacherDto.classIds && createTeacherDto.classIds.length > 0) {
      const teacherClasses = createTeacherDto.classIds.map((classId, index) => {
        return this.teacherClassesRepository.create({
          teacherId: teacher.id,
          classId: classId,
          isPrimary: index === 0 ? 1 : 0, // First class is primary
          isActive: 1,
        });
      });
      
      await this.teacherClassesRepository.save(teacherClasses);
      
      console.log('Teacher classes assigned:', {
        teacherId: teacher.id,
        classIds: createTeacherDto.classIds
      });
    }

    console.log('Teacher created successfully:', {
      userId: savedUser.id,
      teacherId: teacher.id,
      schoolId: teacher.schoolId,
      employeeId: teacher.employeeId
    });

    return {
      ...savedUser,
      teacherId: teacher.id,
      employeeId: teacher.employeeId,
      schoolId: teacher.schoolId
    };
  }

  async findAllTeachers(userId: string): Promise<any[]> {
    // Find school ID for this school admin
    const school = await this.schoolsRepository.findOne({ 
      where: { userId: parseInt(userId) } 
    });

    if (!school) {
      console.log('No school found for userId:', userId);
      return [];
    }

    console.log('Finding teachers for schoolId:', school.id);

    // Query teachers table joined with users table
    const teachers = await this.teachersRepository
      .createQueryBuilder('teacher')
      .leftJoinAndSelect('teacher.user', 'user')
      .where('teacher.schoolId = :schoolId', { schoolId: school.id })
      .andWhere('teacher.isActive = :isActive', { isActive: 1 })
      .andWhere('user.status != :inactiveStatus', { inactiveStatus: UserStatus.INACTIVE })
      .orderBy('teacher.createdAt', 'DESC')
      .getMany();

    console.log('Found teachers:', teachers.length);

    // Map the data to include both user and teacher info
    return teachers.map(teacher => ({
      id: teacher.user.id,
      firstName: teacher.user.firstName,
      lastName: teacher.user.lastName,
      email: teacher.user.email,
      mobile: teacher.user.mobile,
      status: teacher.user.status,
      role: teacher.user.role,
      city: teacher.user.city,
      state: teacher.user.state,
      country: teacher.user.country,
      createdAt: teacher.user.createdAt,
      updatedAt: teacher.user.updatedAt,
      // Teacher specific fields
      teacherId: teacher.id,
      employeeId: teacher.employeeId,
      schoolId: teacher.schoolId,
      qualification: teacher.qualification,
      experienceYears: teacher.experienceYears,
      joiningDate: teacher.joiningDate,
      department: teacher.department,
      designation: teacher.designation,
      subjects: teacher.subjects || [],
    }));
  }

  async findTeacherById(id: string): Promise<any> {
    // Find teacher with both user and teacher details
    const teacher = await this.teachersRepository
      .createQueryBuilder('teacher')
      .leftJoinAndSelect('teacher.user', 'user')
      .leftJoinAndSelect('teacher.school', 'school')
      .where('user.id = :id', { id: parseInt(id) })
      .andWhere('user.role = :role', { role: UserRole.TEACHER })
      .getOne();

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    // Combine user and teacher data
    return {
      id: teacher.user.id,
      firstName: teacher.user.firstName,
      lastName: teacher.user.lastName,
      email: teacher.user.email,
      mobile: teacher.user.mobile,
      status: teacher.user.status,
      role: teacher.user.role,
      city: teacher.user.city,
      state: teacher.user.state,
      country: teacher.user.country,
      postalCode: teacher.user.postalCode,
      address: teacher.user.address,
      dateOfBirth: teacher.user.dateOfBirth,
      createdAt: teacher.user.createdAt,
      updatedAt: teacher.user.updatedAt,
      // Teacher specific fields
      teacherId: teacher.id,
      employeeId: teacher.employeeId,
      schoolId: teacher.schoolId,
      schoolName: teacher.school?.name || '',
      qualification: teacher.qualification,
      specialization: teacher.specialization,
      experienceYears: teacher.experienceYears,
      joiningDate: teacher.joiningDate,
      department: teacher.department,
      designation: teacher.designation,
      salary: teacher.salary,
      emergencyContact: teacher.emergencyContact,
      subjects: teacher.subjects || [],
      classId: teacher.classId,
    };
  }

  async updateTeacher(id: string, updateTeacherDto: UpdateTeacherDto): Promise<any> {
    // Find the teacher record first
    const teacherRecord = await this.teachersRepository
      .createQueryBuilder('teacher')
      .leftJoinAndSelect('teacher.user', 'user')
      .where('user.id = :id', { id: parseInt(id) })
      .andWhere('user.role = :role', { role: UserRole.TEACHER })
      .getOne();

    if (!teacherRecord) {
      throw new NotFoundException('Teacher not found');
    }

    // Update user fields
    const userUpdateData: any = {};
    if (updateTeacherDto.firstName) userUpdateData.firstName = updateTeacherDto.firstName;
    if (updateTeacherDto.lastName) userUpdateData.lastName = updateTeacherDto.lastName;
    if (updateTeacherDto.email) userUpdateData.email = updateTeacherDto.email;
    if (updateTeacherDto.mobile) userUpdateData.mobile = updateTeacherDto.mobile;
    if (updateTeacherDto.dateOfBirth) userUpdateData.dateOfBirth = new Date(updateTeacherDto.dateOfBirth);
    if (updateTeacherDto.address) userUpdateData.address = updateTeacherDto.address;
    if (updateTeacherDto.city) userUpdateData.city = updateTeacherDto.city;
    if (updateTeacherDto.state) userUpdateData.state = updateTeacherDto.state;
    if (updateTeacherDto.country) userUpdateData.country = updateTeacherDto.country;
    if (updateTeacherDto.postalCode) userUpdateData.postalCode = updateTeacherDto.postalCode;

    // Update user
    Object.assign(teacherRecord.user, userUpdateData);
    await this.usersRepository.save(teacherRecord.user);

    // Update teacher fields
    const teacherUpdateData: any = {};
    if (updateTeacherDto.qualification !== undefined) teacherUpdateData.qualification = updateTeacherDto.qualification;
    if (updateTeacherDto.specialization !== undefined) teacherUpdateData.specialization = updateTeacherDto.specialization;
    if (updateTeacherDto.experienceYears !== undefined) teacherUpdateData.experienceYears = parseInt(updateTeacherDto.experienceYears);
    if (updateTeacherDto.department !== undefined) teacherUpdateData.department = updateTeacherDto.department;
    if (updateTeacherDto.designation !== undefined) teacherUpdateData.designation = updateTeacherDto.designation;
    if (updateTeacherDto.emergencyContact !== undefined) teacherUpdateData.emergencyContact = updateTeacherDto.emergencyContact;
    if (updateTeacherDto.joiningDate) teacherUpdateData.joiningDate = new Date(updateTeacherDto.joiningDate);
    if (updateTeacherDto.salary !== undefined) {
      // Convert salary to number and ensure proper precision
      teacherUpdateData.salary = updateTeacherDto.salary ? parseFloat(String(updateTeacherDto.salary)) : null;
    }
    if (updateTeacherDto.subjects) teacherUpdateData.subjects = updateTeacherDto.subjects;
    if (updateTeacherDto.status) teacherUpdateData.status = updateTeacherDto.status;
    if (updateTeacherDto.classId !== undefined) {
      teacherUpdateData.classId = updateTeacherDto.classId ? parseInt(updateTeacherDto.classId) : null;
    }

    // Update teacher
    Object.assign(teacherRecord, teacherUpdateData);
    await this.teachersRepository.save(teacherRecord);

    // Handle multiple class assignments if provided
    if (updateTeacherDto.classIds !== undefined) {
      // Remove all existing class assignments for this teacher
      await this.teacherClassesRepository.delete({ teacherId: teacherRecord.id });
      
      // Add new class assignments
      if (updateTeacherDto.classIds && updateTeacherDto.classIds.length > 0) {
        const teacherClasses = updateTeacherDto.classIds.map((classId, index) => {
          return this.teacherClassesRepository.create({
            teacherId: teacherRecord.id,
            classId: classId,
            isPrimary: index === 0 ? 1 : 0, // First class is primary
            isActive: 1,
          });
        });
        
        await this.teacherClassesRepository.save(teacherClasses);
        
        console.log('Teacher classes updated:', {
          teacherId: teacherRecord.id,
          classIds: updateTeacherDto.classIds
        });
      }
    }

    // Return updated teacher data
    return this.findTeacherById(id);
  }

  async deleteTeacher(id: string): Promise<void> {
    try {
      // Find the user (teacher)
      const user = await this.usersRepository.findOne({
        where: { id: parseInt(id), role: UserRole.TEACHER }
      });

      if (!user) {
        throw new NotFoundException('Teacher not found');
      }

      console.log('Deleting teacher:', { userId: user.id, email: user.email });

      // Find the teacher record in teachers table
      const teacherRecord = await this.teachersRepository.findOne({
        where: { userId: user.id }
      });

      // Soft delete: Set isActive to 0 in both tables
      if (teacherRecord) {
        teacherRecord.isActive = 0;
        await this.teachersRepository.save(teacherRecord);
        console.log('Teacher record soft deleted:', teacherRecord.id);
      }

      // Soft delete user by setting status to inactive
      user.status = UserStatus.INACTIVE;
      await this.usersRepository.save(user);
      console.log('User record soft deleted:', user.id);

      // Alternatively, for hard delete (remove from both tables):
      // if (teacherRecord) {
      //   await this.teachersRepository.remove(teacherRecord);
      // }
      // await this.usersRepository.remove(user);

    } catch (error) {
      console.error('Error deleting teacher:', error);
      throw error;
    }
  }

  async getTeachersByClass(classId: string): Promise<User[]> {
    return this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('class_teachers', 'ct', 'ct.teacherId = user.id')
      .where('ct.classId = :classId', { classId })
      .andWhere('user.role = :role', { role: UserRole.TEACHER })
      .getMany();
  }

  async getTeacherStats(userId: string): Promise<{
    total: number;
    active: number;
    inactive: number;
    pending: number;
  }> {
    // Find school ID for this school admin
    const school = await this.schoolsRepository.findOne({ 
      where: { userId: parseInt(userId) } 
    });

    if (!school) {
      return {
        total: 0,
        active: 0,
        inactive: 0,
        pending: 0,
      };
    }

    // Query teachers for this school
    const stats = await this.teachersRepository
      .createQueryBuilder('teacher')
      .leftJoin('teacher.user', 'user')
      .select('user.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('teacher.schoolId = :schoolId', { schoolId: school.id })
      .andWhere('teacher.isActive = :isActive', { isActive: 1 })
      .groupBy('user.status')
      .getRawMany();

    const result = {
      total: 0,
      active: 0,
      inactive: 0,
      pending: 0,
    };

    stats.forEach((stat) => {
      const count = parseInt(stat.count);
      result.total += count;
      result[stat.status] = count;
    });

    return result;
  }

  async assignTeacherToClass(teacherId: string, classId: string): Promise<void> {
    const teacher = await this.findTeacherById(teacherId);
    const classEntity = await this.classesRepository.findOne({ where: { id: parseInt(classId) } });
    
    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }

    // Add teacher to class_teachers table
    await this.usersRepository
      .createQueryBuilder()
      .insert()
      .into('class_teachers')
      .values({ classId, teacherId })
      .execute();
  }

  async removeTeacherFromClass(teacherId: string, classId: string): Promise<void> {
    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .from('class_teachers')
      .where('classId = :classId AND teacherId = :teacherId', { classId, teacherId })
      .execute();
  }

  async resetPassword(teacherId: string, newPassword: string): Promise<any> {
    // Find the user (teacher)
    const user = await this.usersRepository.findOne({
      where: { id: parseInt(teacherId), role: UserRole.TEACHER }
    });

    if (!user) {
      throw new NotFoundException('Teacher not found');
    }

    console.log('Resetting password for teacher:', { userId: user.id, email: user.email });

    // Update password - the @BeforeUpdate hook in entity will hash it
    user.password = newPassword;
    await this.usersRepository.save(user);

    console.log('✅ Password reset successfully for teacher:', user.email);

    return {
      success: true,
      message: 'Password reset successfully',
      teacherId: user.id,
      email: user.email
    };
  }

  async getTeacherClasses(userId: number): Promise<any[]> {
    console.log('[Teachers Service] getTeacherClasses called for userId:', userId);
    console.log('[Teachers Service] userId type:', typeof userId);
    
    // Validate userId - more strict validation
    if (userId === null || userId === undefined || Number.isNaN(userId) || userId <= 0) {
      console.error('[Teachers Service] Invalid userId:', userId);
      console.error('[Teachers Service] userId is null/undefined/NaN, returning empty array');
      return [];
    }
    
    // Ensure userId is a proper number
    const validUserId = Number(userId);
    if (isNaN(validUserId) || validUserId <= 0) {
      console.error('[Teachers Service] userId cannot be converted to valid number:', userId);
      return [];
    }
    
    console.log('[Teachers Service] Using valid userId:', validUserId);
    
    try {
      // Find teacher record
      const teacherRecord = await this.teachersRepository
        .createQueryBuilder('teacher')
        .leftJoinAndSelect('teacher.user', 'user')
        .where('user.id = :userId', { userId: validUserId })
        .andWhere('user.role = :role', { role: UserRole.TEACHER })
        .getOne();

      if (!teacherRecord) {
        console.log('[Teachers Service] Teacher not found for userId:', userId);
        console.log('[Teachers Service] Available teachers:', await this.teachersRepository.find());
        throw new NotFoundException('Teacher not found');
      }

      console.log('[Teachers Service] Teacher found:', {
        teacherId: teacherRecord.id,
        schoolId: teacherRecord.schoolId,
        userId: teacherRecord.userId
      });

      // Get all assigned classes from teacher_classes table
      const teacherClasses = await this.teacherClassesRepository
        .createQueryBuilder('tc')
        .leftJoinAndSelect('tc.class', 'class')
        .where('tc.teacherId = :teacherId', { teacherId: teacherRecord.id })
        .andWhere('tc.isActive = :isActive', { isActive: 1 })
        .getMany();

      console.log('[Teachers Service] Raw teacher classes query result:', teacherClasses);
      console.log('[Teachers Service] Found', teacherClasses.length, 'classes');

      if (teacherClasses.length === 0) {
        console.log('[Teachers Service] No classes assigned to teacher');
        return [];
      }

      const result = teacherClasses
        .filter(tc => tc.class) // Filter out any null classes
        .map(tc => ({
          id: tc.classId,
          name: tc.class.name,
          grade: tc.class.grade,
          section: tc.class.section,
          isPrimary: tc.isPrimary === 1,
        }));

      console.log('[Teachers Service] Processed result:', result);
      return result;
    } catch (error) {
      console.error('[Teachers Service] Error in getTeacherClasses:', error);
      console.error('[Teachers Service] Error stack:', error.stack);
      
      // Return empty array instead of throwing error to prevent frontend crash
      console.log('[Teachers Service] Returning empty array due to error');
      return [];
    }
  }

  async getMyStudents(userId: number): Promise<any> {
    console.log('[Teachers Service] getMyStudents called for userId:', userId);
    
    // Find teacher record with schoolId
    const teacherRecord = await this.teachersRepository
      .createQueryBuilder('teacher')
      .leftJoinAndSelect('teacher.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('user.role = :role', { role: UserRole.TEACHER })
      .getOne();

    if (!teacherRecord) {
      console.log('[Teachers Service] Teacher not found for userId:', userId);
      throw new NotFoundException('Teacher not found');
    }

    console.log('[Teachers Service] Teacher found:', {
      teacherId: teacherRecord.id,
      schoolId: teacherRecord.schoolId
    });

    // Get all assigned classes from teacher_classes table
    const teacherClasses = await this.teacherClassesRepository
      .createQueryBuilder('tc')
      .leftJoinAndSelect('tc.class', 'class')
      .where('tc.teacherId = :teacherId', { teacherId: teacherRecord.id })
      .andWhere('tc.isActive = :isActive', { isActive: 1 })
      .orderBy('tc.isPrimary', 'DESC') // Primary class first
      .getMany();

    console.log('[Teachers Service] Teacher has', teacherClasses.length, 'assigned classes');

    // If teacher has no assigned classes, return empty array
    if (teacherClasses.length === 0) {
      console.log('[Teachers Service] Teacher has no assigned classes');
      return {
        classId: null,
        className: null,
        classes: [],
        students: []
      };
    }

    // Get all class IDs
    const classIds = teacherClasses.map(tc => tc.classId);
    console.log('[Teachers Service] Fetching students for classIds:', classIds, 'and schoolId:', teacherRecord.schoolId);

    // Get students for all assigned classes AND this school
    const students = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('students', 'student', 'student.userId = user.id')
      .leftJoin('classes', 'class', 'class.id = student.currentClassId')
      .where('student.currentClassId IN (:...classIds)', { classIds })
      .andWhere('student.schoolId = :schoolId', { schoolId: teacherRecord.schoolId })
      .andWhere('student.isActive = :isActive', { isActive: 1 })
      .select([
        'user.id as userId',
        'user.firstName as firstName',
        'user.lastName as lastName',
        'user.email as email',
        'user.mobile as mobile',
        'student.id as studentRecordId',
        'student.studentId as studentCode',
        'student.enrollNumber as enrollNumber',
        'student.rollNumber as rollNumber',
        'student.admissionNumber as admissionNumber',
        'student.dateOfBirth as dateOfBirth',
        'student.gender as gender',
        'student.bloodGroup as bloodGroup',
        'student.parentName as parentName',
        'student.parentPhone as parentPhone',
        'student.parentEmail as parentEmail',
        'student.emergencyContact as emergencyContact',
        'student.previousSchool as previousSchool',
        'student.enrollmentDate as enrollmentDate',
        'student.status as status',
        'student.currentClassId as currentClassId',
        'class.name as className',
        'class.grade as classGrade',
        'class.section as classSection'
      ])
      .orderBy('class.grade', 'ASC')
      .addOrderBy('class.section', 'ASC')
      .addOrderBy('student.rollNumber', 'ASC')
      .getRawMany();

    console.log('[Teachers Service] Found', students.length, 'students across all classes');

    // For backward compatibility, use primary class
    const primaryClass = teacherClasses[0];

    return {
      classId: primaryClass.classId,
      className: primaryClass.class.name,
      classes: teacherClasses.map(tc => ({
        id: tc.classId,
        name: tc.class.name,
        grade: tc.class.grade,
        section: tc.class.section,
        isPrimary: tc.isPrimary === 1
      })),
      students: students.map(s => ({
        id: s.userId,
        firstName: s.firstName,
        lastName: s.lastName,
        email: s.email,
        mobile: s.mobile,
        studentId: s.studentRecordId,
        studentCode: s.studentCode,
        enrollNumber: s.enrollNumber,
        rollNumber: s.rollNumber,
        admissionNumber: s.admissionNumber,
        dateOfBirth: s.dateOfBirth,
        gender: s.gender,
        bloodGroup: s.bloodGroup,
        parentName: s.parentName,
        parentPhone: s.parentPhone,
        parentEmail: s.parentEmail,
        emergencyContact: s.emergencyContact,
        previousSchool: s.previousSchool,
        enrollmentDate: s.enrollmentDate,
        status: s.status,
        currentClassId: s.currentClassId,
        className: s.className,
        classGrade: s.classGrade,
        classSection: s.classSection
      }))
    };
  }
}

