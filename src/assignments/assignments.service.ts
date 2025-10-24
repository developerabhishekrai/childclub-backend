import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Assignment } from './entities/assignment.entity';
import { AssignmentTarget, TargetType } from './entities/assignment-target.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { FilterAssignmentDto } from './dto/filter-assignment.dto';
import { Student } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { TeacherClass } from '../teachers/entities/teacher-class.entity';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
    @InjectRepository(AssignmentTarget)
    private assignmentTargetRepository: Repository<AssignmentTarget>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
    @InjectRepository(TeacherClass)
    private teacherClassRepository: Repository<TeacherClass>,
  ) {}

  async create(createAssignmentDto: CreateAssignmentDto, userId: number, schoolId: number): Promise<Assignment> {
    const { assignedClasses, assignedStudents, assignedTeachers, ...assignmentData } = createAssignmentDto;

    // Validate that at least one target is assigned
    if (
      (!assignedClasses || assignedClasses.length === 0) &&
      (!assignedStudents || assignedStudents.length === 0) &&
      (!assignedTeachers || assignedTeachers.length === 0)
    ) {
      throw new BadRequestException('Must assign to at least one class, student, or teacher');
    }

    // Create assignment
    const assignment = this.assignmentRepository.create({
      ...assignmentData,
      schoolId,
      createdBy: userId,
    });

    const savedAssignment = await this.assignmentRepository.save(assignment);

    // Create assignment targets
    const targets: Partial<AssignmentTarget>[] = [];

    if (assignedClasses && assignedClasses.length > 0) {
      assignedClasses.forEach((classId) => {
        targets.push({
          assignmentId: savedAssignment.id,
          targetType: TargetType.CLASS,
          targetId: classId,
        });
      });
    }

    if (assignedStudents && assignedStudents.length > 0) {
      assignedStudents.forEach((studentId) => {
        targets.push({
          assignmentId: savedAssignment.id,
          targetType: TargetType.STUDENT,
          targetId: studentId,
        });
      });
    }

    if (assignedTeachers && assignedTeachers.length > 0) {
      assignedTeachers.forEach((teacherId) => {
        targets.push({
          assignmentId: savedAssignment.id,
          targetType: TargetType.TEACHER,
          targetId: teacherId,
        });
      });
    }

    await this.assignmentTargetRepository.save(targets);

    return savedAssignment;
  }

  async findAll(schoolId: number, filters?: FilterAssignmentDto): Promise<any[]> {
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

    // If filtering by target, get only assignments that match
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

    // Get targets for all assignments
    const assignmentIds = assignments.map((a) => a.id);
    if (assignmentIds.length === 0) {
      return [];
    }

    const targets = await this.assignmentTargetRepository.find({
      where: { assignmentId: In(assignmentIds) },
    });

    // Group targets by assignment
    const targetsByAssignment = targets.reduce((acc, target) => {
      if (!acc[target.assignmentId]) {
        acc[target.assignmentId] = { classes: [], students: [], teachers: [] };
      }
      if (target.targetType === TargetType.CLASS) {
        acc[target.assignmentId].classes.push(target.targetId);
      } else if (target.targetType === TargetType.STUDENT) {
        acc[target.assignmentId].students.push(target.targetId);
      } else if (target.targetType === TargetType.TEACHER) {
        acc[target.assignmentId].teachers.push(target.targetId);
      }
      return acc;
    }, {});

    // Attach targets to assignments
    return assignments.map((assignment) => ({
      ...assignment,
      assignedClasses: targetsByAssignment[assignment.id]?.classes || [],
      assignedStudents: targetsByAssignment[assignment.id]?.students || [],
      assignedTeachers: targetsByAssignment[assignment.id]?.teachers || [],
    }));
  }

  async findOne(id: number, schoolId: number): Promise<any> {
    const assignment = await this.assignmentRepository.findOne({
      where: { id, schoolId },
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    // Get targets
    const targets = await this.assignmentTargetRepository.find({
      where: { assignmentId: id },
    });

    const assignedClasses = targets.filter((t) => t.targetType === TargetType.CLASS).map((t) => t.targetId);
    const assignedStudents = targets.filter((t) => t.targetType === TargetType.STUDENT).map((t) => t.targetId);
    const assignedTeachers = targets.filter((t) => t.targetType === TargetType.TEACHER).map((t) => t.targetId);

    return {
      ...assignment,
      assignedClasses,
      assignedStudents,
      assignedTeachers,
    };
  }

  async update(id: number, updateAssignmentDto: UpdateAssignmentDto, schoolId: number): Promise<Assignment> {
    const assignment = await this.assignmentRepository.findOne({
      where: { id, schoolId },
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    const { assignedClasses, assignedStudents, assignedTeachers, ...assignmentData } = updateAssignmentDto;

    // Update assignment
    Object.assign(assignment, assignmentData);
    const updatedAssignment = await this.assignmentRepository.save(assignment);

    // Update targets if provided
    if (assignedClasses !== undefined || assignedStudents !== undefined || assignedTeachers !== undefined) {
      // Delete existing targets
      await this.assignmentTargetRepository.delete({ assignmentId: id });

      // Create new targets
      const targets: Partial<AssignmentTarget>[] = [];

      if (assignedClasses && assignedClasses.length > 0) {
        assignedClasses.forEach((classId) => {
          targets.push({
            assignmentId: id,
            targetType: TargetType.CLASS,
            targetId: classId,
          });
        });
      }

      if (assignedStudents && assignedStudents.length > 0) {
        assignedStudents.forEach((studentId) => {
          targets.push({
            assignmentId: id,
            targetType: TargetType.STUDENT,
            targetId: studentId,
          });
        });
      }

      if (assignedTeachers && assignedTeachers.length > 0) {
        assignedTeachers.forEach((teacherId) => {
          targets.push({
            assignmentId: id,
            targetType: TargetType.TEACHER,
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

  async remove(id: number, schoolId: number): Promise<void> {
    const assignment = await this.assignmentRepository.findOne({
      where: { id, schoolId },
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    await this.assignmentRepository.remove(assignment);
  }

  async getAssignmentsByClass(classId: number, schoolId: number): Promise<any[]> {
    return this.findAll(schoolId, { targetType: 'class' as any, targetId: classId });
  }

  async getAssignmentsByStudent(studentId: number, schoolId: number): Promise<any[]> {
    // First, find the student and get their currentClassId
    const student = await this.studentRepository.findOne({
      where: { userId: studentId, schoolId, isActive: 1 }
    });

    if (!student) {
      console.log(`[Assignments Service] No student found for userId: ${studentId}, schoolId: ${schoolId}`);
      return [];
    }

    console.log(`[Assignments Service] Student found - ID: ${student.id}, userId: ${student.userId}, currentClassId: ${student.currentClassId}, schoolId: ${student.schoolId}`);

    // Get assignments from school's scope
    const allAssignments = await this.findAll(schoolId);
    console.log(`[Assignments Service] Total assignments in school: ${allAssignments.length}`);

    // Filter assignments that are either:
    // 1. Assigned directly to this student (by student database ID, not userId)
    // 2. Assigned to student's class (if student has a class)
    const relevantAssignments = allAssignments.filter((assignment: any) => {
      // IMPORTANT: Assignments must have at least one target (class, student, or teacher)
      // If an assignment has NO targets at all, it should not be shown to anyone
      const hasTargets = (
        (assignment.assignedClasses && assignment.assignedClasses.length > 0) ||
        (assignment.assignedStudents && assignment.assignedStudents.length > 0) ||
        (assignment.assignedTeachers && assignment.assignedTeachers.length > 0)
      );

      if (!hasTargets) {
        console.log(`[Assignments Service] Assignment ${assignment.id} has NO targets - EXCLUDING`);
        return false;
      }

      // Check if student is directly assigned (using student database ID, not userId)
      if (assignment.assignedStudents && assignment.assignedStudents.length > 0) {
        if (assignment.assignedStudents.includes(student.id)) {
          console.log(`[Assignments Service] ✓ Assignment ${assignment.id} is directly assigned to student ID ${student.id}`);
          return true;
        }
      }

      // Check if student's class is assigned
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
    
    // Log details of relevant assignments for debugging
    relevantAssignments.forEach((assignment: any) => {
      console.log(`  - Assignment ${assignment.id}: "${assignment.title}" - Classes: [${assignment.assignedClasses}], Students: [${assignment.assignedStudents}]`);
    });

    return relevantAssignments;
  }

  async getAssignmentsByTeacher(teacherId: number, schoolId: number): Promise<any[]> {
    return this.findAll(schoolId, { targetType: 'teacher' as any, targetId: teacherId });
  }

  async getAssignmentsByCreator(createdBy: number, schoolId: number): Promise<any[]> {
    const query = this.assignmentRepository
      .createQueryBuilder('assignment')
      .where('assignment.schoolId = :schoolId', { schoolId })
      .andWhere('assignment.createdBy = :createdBy', { createdBy })
      .orderBy('assignment.dueDate', 'DESC');

    const assignments = await query.getMany();

    // Get targets for all assignments
    const assignmentIds = assignments.map((a) => a.id);
    if (assignmentIds.length === 0) {
      return [];
    }

    const targets = await this.assignmentTargetRepository.find({
      where: { assignmentId: In(assignmentIds) },
    });

    // Group targets by assignment
    const targetsByAssignment = targets.reduce((acc, target) => {
      if (!acc[target.assignmentId]) {
        acc[target.assignmentId] = { classes: [], students: [], teachers: [] };
      }
      if (target.targetType === TargetType.CLASS) {
        acc[target.assignmentId].classes.push(target.targetId);
      } else if (target.targetType === TargetType.STUDENT) {
        acc[target.assignmentId].students.push(target.targetId);
      } else if (target.targetType === TargetType.TEACHER) {
        acc[target.assignmentId].teachers.push(target.targetId);
      }
      return acc;
    }, {});

    // Attach targets to assignments
    return assignments.map((assignment) => ({
      ...assignment,
      assignedClasses: targetsByAssignment[assignment.id]?.classes || [],
      assignedStudents: targetsByAssignment[assignment.id]?.students || [],
      assignedTeachers: targetsByAssignment[assignment.id]?.teachers || [],
    }));
  }

  async getAssignmentsForTeacher(userId: number, schoolId: number): Promise<any[]> {
    console.log(`[Assignments Service] Getting assignments for teacher userId: ${userId}, schoolId: ${schoolId}`);

    // Find the teacher record
    const teacher = await this.teacherRepository.findOne({
      where: { userId, schoolId, isActive: 1 }
    });

    if (!teacher) {
      console.log(`[Assignments Service] No teacher found for userId: ${userId}`);
      return [];
    }

    console.log(`[Assignments Service] Teacher found: ${teacher.id}`);

    // Get all classes assigned to this teacher
    const teacherClasses = await this.teacherClassRepository.find({
      where: { teacherId: teacher.id, isActive: 1 }
    });

    const classIds = teacherClasses.map(tc => tc.classId);
    console.log(`[Assignments Service] Teacher has ${classIds.length} assigned classes:`, classIds);

    // Get all students in these classes
    let studentIds: number[] = [];
    if (classIds.length > 0) {
      const students = await this.studentRepository.find({
        where: { 
          currentClassId: In(classIds),
          schoolId,
          isActive: 1
        }
      });
      studentIds = students.map(s => s.id);
      console.log(`[Assignments Service] Found ${studentIds.length} students in teacher's classes`);
    }

    // Get all assignments for this school
    const allAssignments = await this.findAll(schoolId);
    console.log(`[Assignments Service] Total assignments in school: ${allAssignments.length}`);

    // Filter assignments that are:
    // 1. Created by this teacher, OR
    // 2. Assigned to this teacher's classes, OR
    // 3. Assigned to students in this teacher's classes
    const relevantAssignments = allAssignments.filter((assignment: any) => {
      // Check if teacher created this assignment
      if (assignment.createdBy === userId) {
        console.log(`[Assignments Service] Assignment ${assignment.id} created by teacher ${userId}`);
        return true;
      }

      // Check if assigned to any of teacher's classes
      if (classIds.length > 0 && assignment.assignedClasses && assignment.assignedClasses.length > 0) {
        const hasTeacherClass = assignment.assignedClasses.some((classId: number) => classIds.includes(classId));
        if (hasTeacherClass) {
          console.log(`[Assignments Service] Assignment ${assignment.id} assigned to teacher's class`);
          return true;
        }
      }

      // Check if assigned to any student in teacher's classes
      if (studentIds.length > 0 && assignment.assignedStudents && assignment.assignedStudents.length > 0) {
        const hasTeacherStudent = assignment.assignedStudents.some((studentId: number) => studentIds.includes(studentId));
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

  async getAssignmentsForTeacherSpecificStudents(userId: number, schoolId: number): Promise<any[]> {
    console.log(`[Assignments Service] Getting assignments for teacher's specific students - userId: ${userId}, schoolId: ${schoolId}`);

    // Find the teacher record
    const teacher = await this.teacherRepository.findOne({
      where: { userId, schoolId, isActive: 1 }
    });

    if (!teacher) {
      console.log(`[Assignments Service] No teacher found for userId: ${userId}`);
      return [];
    }

    console.log(`[Assignments Service] Teacher found: ${teacher.id}`);

    // Get all classes assigned to this teacher
    const teacherClasses = await this.teacherClassRepository.find({
      where: { teacherId: teacher.id, isActive: 1 }
    });

    const classIds = teacherClasses.map(tc => tc.classId);
    console.log(`[Assignments Service] Teacher has ${classIds.length} assigned classes:`, classIds);

    // Get all students in these classes
    let studentIds: number[] = [];
    if (classIds.length > 0) {
      const students = await this.studentRepository.find({
        where: { 
          currentClassId: In(classIds),
          schoolId,
          isActive: 1
        }
      });
      studentIds = students.map(s => s.id);
      console.log(`[Assignments Service] Found ${studentIds.length} students in teacher's classes`);
    }

    // Get all assignments for this school
    const allAssignments = await this.findAll(schoolId);
    console.log(`[Assignments Service] Total assignments in school: ${allAssignments.length}`);

    // Filter assignments that are:
    // 1. Created by this teacher AND assigned to specific students/classes, OR
    // 2. Assigned to this teacher's classes (by admin), OR
    // 3. Assigned to students in this teacher's classes (by admin)
    const relevantAssignments = allAssignments.filter((assignment: any) => {
      // Check if teacher created this assignment AND it has specific assignments
      if (assignment.createdBy === userId) {
        // Only show if it's assigned to specific students or classes
        const hasSpecificAssignments = 
          (assignment.assignedClasses && assignment.assignedClasses.length > 0) ||
          (assignment.assignedStudents && assignment.assignedStudents.length > 0);
        
        if (hasSpecificAssignments) {
          console.log(`[Assignments Service] Assignment ${assignment.id} created by teacher ${userId} with specific assignments`);
          return true;
        }
      }

      // Check if assigned to any of teacher's classes (by admin)
      if (classIds.length > 0 && assignment.assignedClasses && assignment.assignedClasses.length > 0) {
        const hasTeacherClass = assignment.assignedClasses.some((classId: number) => classIds.includes(classId));
        if (hasTeacherClass) {
          console.log(`[Assignments Service] Assignment ${assignment.id} assigned to teacher's class by admin`);
          return true;
        }
      }

      // Check if assigned to any student in teacher's classes (by admin)
      if (studentIds.length > 0 && assignment.assignedStudents && assignment.assignedStudents.length > 0) {
        const hasTeacherStudent = assignment.assignedStudents.some((studentId: number) => studentIds.includes(studentId));
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
}

