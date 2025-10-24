import { Repository } from 'typeorm';
import { Assignment } from './entities/assignment.entity';
import { AssignmentTarget } from './entities/assignment-target.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { FilterAssignmentDto } from './dto/filter-assignment.dto';
import { Student } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { TeacherClass } from '../teachers/entities/teacher-class.entity';
export declare class AssignmentsService {
    private assignmentRepository;
    private assignmentTargetRepository;
    private studentRepository;
    private teacherRepository;
    private teacherClassRepository;
    constructor(assignmentRepository: Repository<Assignment>, assignmentTargetRepository: Repository<AssignmentTarget>, studentRepository: Repository<Student>, teacherRepository: Repository<Teacher>, teacherClassRepository: Repository<TeacherClass>);
    create(createAssignmentDto: CreateAssignmentDto, userId: number, schoolId: number): Promise<Assignment>;
    findAll(schoolId: number, filters?: FilterAssignmentDto): Promise<any[]>;
    findOne(id: number, schoolId: number): Promise<any>;
    update(id: number, updateAssignmentDto: UpdateAssignmentDto, schoolId: number): Promise<Assignment>;
    remove(id: number, schoolId: number): Promise<void>;
    getAssignmentsByClass(classId: number, schoolId: number): Promise<any[]>;
    getAssignmentsByStudent(studentId: number, schoolId: number): Promise<any[]>;
    getAssignmentsByTeacher(teacherId: number, schoolId: number): Promise<any[]>;
    getAssignmentsByCreator(createdBy: number, schoolId: number): Promise<any[]>;
    getAssignmentsForTeacher(userId: number, schoolId: number): Promise<any[]>;
    getAssignmentsForTeacherSpecificStudents(userId: number, schoolId: number): Promise<any[]>;
}
