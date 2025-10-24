import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { FilterAssignmentDto } from './dto/filter-assignment.dto';
export declare class AssignmentsController {
    private readonly assignmentsService;
    constructor(assignmentsService: AssignmentsService);
    create(createAssignmentDto: CreateAssignmentDto, req: any): Promise<import("./entities/assignment.entity").Assignment>;
    findAll(req: any, filters: FilterAssignmentDto): Promise<any[]>;
    findByClass(classId: number, req: any): Promise<any[]>;
    findByStudent(studentId: number, req: any): Promise<any[]>;
    findByTeacher(teacherId: number, req: any): Promise<any[]>;
    findByCreator(creatorId: number, req: any): Promise<any[]>;
    findMyTeacherAssignments(req: any): Promise<any[]>;
    findOne(id: number, req: any): Promise<any>;
    update(id: number, updateAssignmentDto: UpdateAssignmentDto, req: any): Promise<import("./entities/assignment.entity").Assignment>;
    remove(id: number, req: any): Promise<void>;
}
