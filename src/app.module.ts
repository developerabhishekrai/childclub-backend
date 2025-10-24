import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { ScheduleModule } from '@nestjs/schedule';

// Core modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SchoolsModule } from './schools/schools.module';
import { ClassesModule } from './classes/classes.module';
import { SubjectsModule } from './subjects/subjects.module';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';
import { TeacherSubjectsModule } from './teacher-subjects/teacher-subjects.module';
import { TasksModule } from './tasks/tasks.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { AttendanceModule } from './attendance/attendance.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { GoalsModule } from './goals/goals.module';
import { CurriculumModule } from './curriculum/curriculum.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReportsModule } from './reports/reports.module';
import { UploadsModule } from './uploads/uploads.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CalendarModule } from './calendar/calendar.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Database
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'childclub',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // Disable synchronization since database already exists
      logging: process.env.NODE_ENV === 'development',
    }),
    
    // JWT
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'childclub-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
    
    // Mailer
    MailerModule.forRoot({
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
    
    // Schedule
    ScheduleModule.forRoot(),
    
    // Feature modules
    AuthModule,
    UsersModule,
    SchoolsModule,
    ClassesModule,
    SubjectsModule,
    StudentsModule,
    TeachersModule,
    TeacherSubjectsModule,
    TasksModule,
    SubmissionsModule,
    AttendanceModule,
    AssignmentsModule,
    GoalsModule,
    CurriculumModule,
    NotificationsModule,
    ReportsModule,
    UploadsModule,
    DashboardModule,
    CalendarModule,
    ContactModule,
  ],
})
export class AppModule {}
