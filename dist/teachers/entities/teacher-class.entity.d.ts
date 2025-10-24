import { Teacher } from './teacher.entity';
import { Class } from '../../classes/entities/class.entity';
export declare class TeacherClass {
    id: number;
    teacherId: number;
    classId: number;
    isPrimary: number;
    isActive: number;
    createdAt: Date;
    updatedAt: Date;
    teacher: Teacher;
    class: Class;
}
