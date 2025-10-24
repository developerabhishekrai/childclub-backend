"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const mailer_1 = require("@nestjs-modules/mailer");
const schedule_1 = require("@nestjs/schedule");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const schools_module_1 = require("./schools/schools.module");
const classes_module_1 = require("./classes/classes.module");
const subjects_module_1 = require("./subjects/subjects.module");
const students_module_1 = require("./students/students.module");
const teachers_module_1 = require("./teachers/teachers.module");
const teacher_subjects_module_1 = require("./teacher-subjects/teacher-subjects.module");
const tasks_module_1 = require("./tasks/tasks.module");
const submissions_module_1 = require("./submissions/submissions.module");
const attendance_module_1 = require("./attendance/attendance.module");
const assignments_module_1 = require("./assignments/assignments.module");
const goals_module_1 = require("./goals/goals.module");
const curriculum_module_1 = require("./curriculum/curriculum.module");
const notifications_module_1 = require("./notifications/notifications.module");
const reports_module_1 = require("./reports/reports.module");
const uploads_module_1 = require("./uploads/uploads.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const calendar_module_1 = require("./calendar/calendar.module");
const contact_module_1 = require("./contact/contact.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT) || 3306,
                username: process.env.DB_USERNAME || 'root',
                password: process.env.DB_PASSWORD || '',
                database: process.env.DB_DATABASE || 'childclub',
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: false,
                logging: process.env.NODE_ENV === 'development',
            }),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'childclub-secret-key',
                signOptions: { expiresIn: '24h' },
            }),
            mailer_1.MailerModule.forRoot({
                transport: {
                    host: process.env.SMTP_HOST || 'smtp.gmail.com',
                    port: parseInt(process.env.SMTP_PORT) || 587,
                    secure: false,
                    auth: {
                        user: process.env.SMTP_USER || '',
                        pass: process.env.SMTP_PASS || '',
                    },
                },
                defaults: {
                    from: process.env.SMTP_FROM || 'noreply@childclub.com',
                },
            }),
            schedule_1.ScheduleModule.forRoot(),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            schools_module_1.SchoolsModule,
            classes_module_1.ClassesModule,
            subjects_module_1.SubjectsModule,
            students_module_1.StudentsModule,
            teachers_module_1.TeachersModule,
            teacher_subjects_module_1.TeacherSubjectsModule,
            tasks_module_1.TasksModule,
            submissions_module_1.SubmissionsModule,
            attendance_module_1.AttendanceModule,
            assignments_module_1.AssignmentsModule,
            goals_module_1.GoalsModule,
            curriculum_module_1.CurriculumModule,
            notifications_module_1.NotificationsModule,
            reports_module_1.ReportsModule,
            uploads_module_1.UploadsModule,
            dashboard_module_1.DashboardModule,
            calendar_module_1.CalendarModule,
            contact_module_1.ContactModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map