import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { Student, Gender, StudentStatus } from './entities/student.entity';
import { Class } from '../classes/entities/class.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Class)
    private readonly classesRepository: Repository<Class>,
  ) {}

  async createStudent(createStudentDto: CreateStudentDto, createdBy: number): Promise<Student> {
    // Check if user with email already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email: createStudentDto.email }
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Check if enrollment number already exists in the same class
    if (createStudentDto.enrollNumber && createStudentDto.classId) {
      const existingEnrollment = await this.studentsRepository.findOne({
        where: { 
          enrollNumber: createStudentDto.enrollNumber,
          currentClassId: createStudentDto.classId,
          isActive: 1
        }
      });

      if (existingEnrollment) {
        throw new ConflictException('Enrollment number already exists in this class');
      }
    }

    // Create user first
    const user = this.usersRepository.create({
      firstName: createStudentDto.firstName,
      lastName: createStudentDto.lastName,
      email: createStudentDto.email,
      mobile: createStudentDto.mobile,
      password: createStudentDto.password, // Note: Should be hashed in production
      role: 'student' as any, // Type assertion for now
      status: 'active' as any, // Type assertion for now
      city: createStudentDto.city,
      state: createStudentDto.state,
      country: createStudentDto.country,
      postalCode: createStudentDto.postalCode,
      dateOfBirth: createStudentDto.dateOfBirth ? new Date(createStudentDto.dateOfBirth) : new Date('2000-01-01'),
      address: createStudentDto.address,
      emailVerified: 1,
      mobileVerified: 1,
    });

    const savedUser = await this.usersRepository.save(user);

    // Generate unique student ID, roll number, and admission number
    const studentId = `S${Date.now()}`;
    const rollNumber = `R${Date.now()}`;
    const admissionNumber = `ADM${Date.now()}`;

    // Create student record
    const student = this.studentsRepository.create({
      userId: savedUser.id,
      schoolId: createStudentDto.schoolId,
      studentId: studentId,
      rollNumber: rollNumber,
      admissionNumber: admissionNumber,
      enrollNumber: createStudentDto.enrollNumber,
      dateOfBirth: createStudentDto.dateOfBirth ? new Date(createStudentDto.dateOfBirth) : new Date('2000-01-01'),
      gender: Gender.OTHER, // Default value, can be updated later
      parentName: createStudentDto.parentName,
      parentPhone: createStudentDto.parentPhone,
      parentEmail: createStudentDto.parentEmail,
      emergencyContact: createStudentDto.emergencyContact,
      enrollmentDate: new Date(),
      currentClassId: createStudentDto.classId || null,
      previousSchool: createStudentDto.previousSchool,
      academicYear: new Date().getFullYear().toString(),
      status: StudentStatus.ACTIVE,
      isActive: 1
    });

    return this.studentsRepository.save(student);
  }

  async findAll(): Promise<Student[]> {
    return this.studentsRepository.find({
      where: { isActive: 1 }
    });
  }

  async findBySchoolId(schoolId: number): Promise<any[]> {
    try {
      console.log('[Students Service] Finding students for schoolId:', schoolId);
      
      // Get students basic data
      const students = await this.studentsRepository.find({
        where: { 
          schoolId: schoolId, 
          isActive: 1 
        },
        order: { createdAt: 'DESC' }
      });

      console.log('[Students Service] Found', students.length, 'students');

      // If no students, return empty array
      if (students.length === 0) {
        return [];
      }

      // Debug: Check if usersRepository is working
      if (students.length > 0) {
        const testUserId = students[0].userId;
        console.log('[Students Service] Testing usersRepository with userId:', testUserId);
        
        // Try direct query
        const allUsers = await this.usersRepository.find({ take: 5 });
        console.log('[Students Service] Sample users in DB:', allUsers.map(u => ({ id: u.id, name: `${u.firstName} ${u.lastName}` })));
      }

      // Get user data for each student
      const studentsWithUserData = await Promise.all(
        students.map(async (student) => {
          try {
            console.log('[Students Service] Fetching user for userId:', student.userId);
            
            const user = await this.usersRepository.findOne({
              where: { id: student.userId }
            });

            console.log('[Students Service] User found:', user ? `${user.firstName} ${user.lastName} (${user.email})` : 'NULL');

            // Get class name if student has a class assigned
            let className = null;
            if (student.currentClassId) {
              const classEntity = await this.classesRepository.findOne({
                where: { id: student.currentClassId }
              });
              className = classEntity?.name || null;
            }

            return {
              id: student.id,
              userId: student.userId,
              schoolId: student.schoolId,
              studentId: student.studentId,
              rollNumber: student.rollNumber,
              admissionNumber: student.admissionNumber,
              firstName: user?.firstName || '',
              lastName: user?.lastName || '',
              email: user?.email || '',
              mobile: user?.mobile || '',
              dateOfBirth: student.dateOfBirth,
              gender: student.gender,
              bloodGroup: student.bloodGroup,
              parentName: student.parentName,
              parentPhone: student.parentPhone,
              parentEmail: student.parentEmail,
              enrollmentDate: student.enrollmentDate,
              currentClassId: student.currentClassId,
              className: className,
              academicYear: student.academicYear,
              status: student.status,
              isActive: student.isActive,
              createdAt: student.createdAt,
              updatedAt: student.updatedAt
            };
          } catch (userError) {
            console.error('[Students Service] Error fetching user for student', student.id, ':', userError.message);
            // Return student with empty user fields
            return {
              id: student.id,
              userId: student.userId,
              schoolId: student.schoolId,
              studentId: student.studentId,
              rollNumber: student.rollNumber,
              admissionNumber: student.admissionNumber,
              firstName: '',
              lastName: '',
              email: '',
              mobile: '',
              dateOfBirth: student.dateOfBirth,
              gender: student.gender,
              bloodGroup: student.bloodGroup,
              parentName: student.parentName,
              parentPhone: student.parentPhone,
              parentEmail: student.parentEmail,
              enrollmentDate: student.enrollmentDate,
              currentClassId: student.currentClassId,
              academicYear: student.academicYear,
              status: student.status,
              isActive: student.isActive,
              createdAt: student.createdAt,
              updatedAt: student.updatedAt
            };
          }
        })
      );

      console.log('[Students Service] Returning', studentsWithUserData.length, 'students with user data');
      return studentsWithUserData;
      
    } catch (error) {
      console.error('[Students Service] Critical error in findBySchoolId:', error);
      throw error;
    }
  }

  async findByUserId(userId: number): Promise<any> {
    // Find student by user ID
    const student = await this.studentsRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.user', 'user')
      .leftJoinAndSelect('student.currentClass', 'currentClass')
      .leftJoinAndSelect('student.school', 'school')
      .where('student.userId = :userId', { userId })
      .andWhere('student.isActive = :isActive', { isActive: 1 })
      .getOne();

    if (!student) {
      throw new NotFoundException(`Student with user ID ${userId} not found`);
    }

    // Combine student and user data
    return {
      id: student.user.id,
      studentId: student.id,
      firstName: student.user.firstName,
      lastName: student.user.lastName,
      email: student.user.email,
      mobile: student.user.mobile,
      status: student.status,
      role: student.user.role,
      dateOfBirth: student.dateOfBirth,
      address: student.user.address,
      city: student.user.city,
      state: student.user.state,
      country: student.user.country,
      postalCode: student.user.postalCode,
      // Student specific fields
      enrollNumber: student.enrollNumber,
      rollNumber: student.rollNumber,
      admissionNumber: student.admissionNumber,
      gender: student.gender,
      bloodGroup: student.bloodGroup,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      parentEmail: student.parentEmail,
      emergencyContact: student.emergencyContact,
      previousSchool: student.previousSchool,
      currentClassId: student.currentClassId,
      className: student.currentClass?.name,
      schoolId: student.schoolId,
      schoolName: student.school?.name,
      enrollmentDate: student.enrollmentDate,
      academicYear: student.academicYear,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    };
  }

  async findOne(id: number): Promise<any> {
    // Find student with user and class details
    // Try to find by user ID first, then by student entity ID
    let student = await this.studentsRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.user', 'user')
      .leftJoinAndSelect('student.currentClass', 'currentClass')
      .leftJoinAndSelect('student.school', 'school')
      .where('user.id = :id', { id })
      .andWhere('student.isActive = :isActive', { isActive: 1 })
      .getOne();

    // If not found by user ID, try by student entity ID
    if (!student) {
      student = await this.studentsRepository
        .createQueryBuilder('student')
        .leftJoinAndSelect('student.user', 'user')
        .leftJoinAndSelect('student.currentClass', 'currentClass')
        .leftJoinAndSelect('student.school', 'school')
        .where('student.id = :id', { id })
        .andWhere('student.isActive = :isActive', { isActive: 1 })
        .getOne();
    }

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    // Combine student and user data
    return {
      id: student.user.id,
      firstName: student.user.firstName,
      lastName: student.user.lastName,
      email: student.user.email,
      mobile: student.user.mobile,
      status: student.status,
      role: student.user.role,
      dateOfBirth: student.dateOfBirth,
      address: student.user.address,
      city: student.user.city,
      state: student.user.state,
      country: student.user.country,
      postalCode: student.user.postalCode,
      // Student specific fields
      studentId: student.studentId,
      enrollNumber: student.enrollNumber,
      rollNumber: student.rollNumber,
      admissionNumber: student.admissionNumber,
      gender: student.gender,
      bloodGroup: student.bloodGroup,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      parentEmail: student.parentEmail,
      emergencyContact: student.emergencyContact,
      previousSchool: student.previousSchool,
      currentClassId: student.currentClassId,
      className: student.currentClass?.name,
      schoolId: student.schoolId,
      schoolName: student.school?.name,
      enrollmentDate: student.enrollmentDate,
      academicYear: student.academicYear,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    };
  }

  async update(id: number, updateStudentDto: UpdateStudentDto): Promise<any> {
    // Get the actual student entity (not the formatted response)
    const student = await this.studentsRepository.findOne({
      where: { id, isActive: 1 },
      relations: ['user']
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    // Check if enrollment number already exists in the same class when updating
    // Only check if enrollment number or class is being changed
    if (updateStudentDto.enrollNumber || updateStudentDto.classId) {
      const newEnrollNumber = updateStudentDto.enrollNumber || student.enrollNumber;
      const newClassId = updateStudentDto.classId ? parseInt(updateStudentDto.classId) : student.currentClassId;
      
      // Check if the combination of enrollNumber and classId is changing
      if (newEnrollNumber && newClassId && (newEnrollNumber !== student.enrollNumber || newClassId !== student.currentClassId)) {
        const existingEnrollment = await this.studentsRepository.findOne({
          where: { 
            enrollNumber: newEnrollNumber,
            currentClassId: newClassId,
            isActive: 1
          }
        });

        // If found and it's not the same student, throw error
        if (existingEnrollment && existingEnrollment.id !== id) {
          throw new ConflictException('Enrollment number already exists in this class');
        }
      }
    }

    // Update student fields in student table
    if (updateStudentDto.gender) student.gender = updateStudentDto.gender as any;
    if (updateStudentDto.status) student.status = updateStudentDto.status as any;
    if (updateStudentDto.enrollNumber) student.enrollNumber = updateStudentDto.enrollNumber;
    if (updateStudentDto.parentName) student.parentName = updateStudentDto.parentName;
    if (updateStudentDto.parentPhone) student.parentPhone = updateStudentDto.parentPhone;
    if (updateStudentDto.parentEmail) student.parentEmail = updateStudentDto.parentEmail;
    if (updateStudentDto.emergencyContact) student.emergencyContact = updateStudentDto.emergencyContact;
    if (updateStudentDto.previousSchool) student.previousSchool = updateStudentDto.previousSchool;
    if (updateStudentDto.dateOfBirth) student.dateOfBirth = new Date(updateStudentDto.dateOfBirth);
    if (updateStudentDto.classId) student.currentClassId = parseInt(updateStudentDto.classId);

    // Update related user if basic info changed
    if (updateStudentDto.firstName || updateStudentDto.lastName || updateStudentDto.email || updateStudentDto.mobile || updateStudentDto.address || updateStudentDto.city || updateStudentDto.state || updateStudentDto.country || updateStudentDto.postalCode) {
      const user = await this.usersRepository.findOne({ where: { id: student.userId } });
      if (user) {
        if (updateStudentDto.firstName) user.firstName = updateStudentDto.firstName;
        if (updateStudentDto.lastName) user.lastName = updateStudentDto.lastName;
        if (updateStudentDto.email) user.email = updateStudentDto.email;
        if (updateStudentDto.mobile) user.mobile = updateStudentDto.mobile;
        if (updateStudentDto.address) user.address = updateStudentDto.address;
        if (updateStudentDto.city) user.city = updateStudentDto.city;
        if (updateStudentDto.state) user.state = updateStudentDto.state;
        if (updateStudentDto.country) user.country = updateStudentDto.country;
        if (updateStudentDto.postalCode) user.postalCode = updateStudentDto.postalCode;
        await this.usersRepository.save(user);
      }
    }

    await this.studentsRepository.save(student);
    
    // Return formatted response
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const student = await this.studentsRepository.findOne({
      where: { id, isActive: 1 }
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    student.isActive = 0;
    await this.studentsRepository.save(student);
  }

  async updateStatus(id: number, status: string): Promise<Student> {
    const student = await this.studentsRepository.findOne({
      where: { id, isActive: 1 }
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    student.status = status as StudentStatus;
    return this.studentsRepository.save(student);
  }

  async findBySchool(schoolId: number): Promise<any[]> {
    return this.findBySchoolId(schoolId);
  }

  async findByClass(classId: number): Promise<any[]> {
    // Get students basic data
    const students = await this.studentsRepository.find({
      where: { 
        currentClassId: classId, 
        isActive: 1 
      },
      order: { createdAt: 'DESC' }
    });

    // Get user data for each student
    const studentsWithUserData = await Promise.all(
      students.map(async (student) => {
        const user = await this.usersRepository.findOne({
          where: { id: student.userId }
        });

        return {
          id: student.id,
          userId: student.userId,
          schoolId: student.schoolId,
          studentId: student.studentId,
          rollNumber: student.rollNumber,
          admissionNumber: student.admissionNumber,
          enrollNumber: student.enrollNumber,
          enrollmentNumber: student.enrollNumber, // Add this for frontend compatibility
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          email: user?.email || '',
          mobile: user?.mobile || '',
          dateOfBirth: student.dateOfBirth,
          gender: student.gender,
          bloodGroup: student.bloodGroup,
          parentName: student.parentName,
          parentPhone: student.parentPhone,
          parentEmail: student.parentEmail,
          enrollmentDate: student.enrollmentDate,
          currentClassId: student.currentClassId,
          academicYear: student.academicYear,
          status: student.status,
          isActive: student.isActive,
          createdAt: student.createdAt,
          updatedAt: student.updatedAt
        };
      })
    );

    return studentsWithUserData;
  }

  async resetPassword(studentId: string, newPassword: string): Promise<any> {
    // First find the student record to get userId
    const student = await this.studentsRepository.findOne({
      where: { id: parseInt(studentId), isActive: 1 },
      relations: ['user']
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Get the user from the student record
    const user = student.user;
    
    if (!user) {
      throw new NotFoundException('User not found for this student');
    }

    console.log('Resetting password for student:', { 
      studentId: student.id,
      userId: user.id, 
      email: user.email 
    });

    // Update password - the @BeforeUpdate hook in entity will hash it
    user.password = newPassword;
    await this.usersRepository.save(user);

    console.log('✅ Password reset successfully for student:', user.email);

    return {
      success: true,
      message: 'Password reset successfully',
      studentId: student.id,
      userId: user.id,
      email: user.email
    };
  }

  async exportToCSV(schoolId: number): Promise<string> {
    try {
      console.log('[Students Service] Exporting students for schoolId:', schoolId);
      
      // Get all students with their details
      const students = await this.findBySchoolId(schoolId);
      
      if (students.length === 0) {
        return 'No students found to export';
      }

      // CSV Header
      const headers = [
        'Student ID',
        'Roll Number',
        'Admission Number',
        'Enrollment Number',
        'First Name',
        'Last Name',
        'Email',
        'Mobile',
        'Date of Birth',
        'Gender',
        'Blood Group',
        'Current Class',
        'Status',
        'Parent Name',
        'Parent Phone',
        'Parent Email',
        'Emergency Contact',
        'Enrollment Date',
        'Academic Year',
        'Previous School'
      ];

      // Create CSV rows
      const rows = students.map(student => [
        this.escapeCSV(student.studentId || ''),
        this.escapeCSV(student.rollNumber || ''),
        this.escapeCSV(student.admissionNumber || ''),
        this.escapeCSV(student.enrollNumber || ''),
        this.escapeCSV(student.firstName || ''),
        this.escapeCSV(student.lastName || ''),
        this.escapeCSV(student.email || ''),
        this.escapeCSV(student.mobile || ''),
        student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : '',
        this.escapeCSV(student.gender || ''),
        this.escapeCSV(student.bloodGroup || ''),
        this.escapeCSV(student.className || ''),
        this.escapeCSV(student.status || ''),
        this.escapeCSV(student.parentName || ''),
        this.escapeCSV(student.parentPhone || ''),
        this.escapeCSV(student.parentEmail || ''),
        this.escapeCSV(student.emergencyContact || ''),
        student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : '',
        this.escapeCSV(student.academicYear || ''),
        this.escapeCSV(student.previousSchool || '')
      ].join(','));

      // Combine headers and rows
      const csv = [headers.join(','), ...rows].join('\n');
      
      console.log('[Students Service] CSV generated successfully with', students.length, 'students');
      return csv;
      
    } catch (error) {
      console.error('[Students Service] Error in exportToCSV:', error);
      throw error;
    }
  }

  private escapeCSV(value: string): string {
    if (value === null || value === undefined) {
      return '';
    }
    // Convert to string and escape quotes
    const stringValue = String(value);
    // If value contains comma, quote, or newline, wrap in quotes and escape internal quotes
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  }
}

