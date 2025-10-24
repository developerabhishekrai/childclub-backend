import { ClassesService, CreateClassDto, UpdateClassDto } from './classes.service';
export declare class ClassesController {
    private readonly classesService;
    constructor(classesService: ClassesService);
    createClass(createClassDto: CreateClassDto, req: any): Promise<import("./entities/class.entity").Class>;
    findAllClasses(req: any, schoolId?: string): Promise<import("./entities/class.entity").Class[]>;
    getClassStats(req: any): Promise<{
        total: number;
        active: number;
        inactive: number;
        completed: number;
    }>;
    getClassesByGrade(grade: string, req: any): Promise<import("./entities/class.entity").Class[]>;
    findClassById(id: string): Promise<import("./entities/class.entity").Class>;
    updateClass(id: string, updateClassDto: UpdateClassDto): Promise<import("./entities/class.entity").Class>;
    deleteClass(id: string): Promise<void>;
    addStudentToClass(classId: string, studentId: string): Promise<void>;
    removeStudentFromClass(classId: string, studentId: string): Promise<void>;
}
