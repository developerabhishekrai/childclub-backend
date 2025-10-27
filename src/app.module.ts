import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';

// Conditional import of MailerModule - only if credentials exist
let MailerModuleClass = null;
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  try {
    const mailerModule = require('@nestjs-modules/mailer');
    MailerModuleClass = mailerModule.MailerModule;
  } catch (e) {
    console.log('MailerModule not available');
  }
}

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
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // Configuration - MUST be first
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Database - Use ConfigService for proper env variable loading

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT', '3306')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: configService.get<string>('NODE_ENV') === 'development',
      }),
    }),
    
    // JWT - Use ConfigService for proper env variable loading
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || 'childclub-secret-key',
        signOptions: { expiresIn: '24h' },
      }),
    }),
    
    // Mailer Module - Only import if credentials are configured
    ...(MailerModuleClass ? [MailerModuleClass.forRoot({
      transport: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false
        }
      },
      defaults: {
        from: process.env.SMTP_FROM || 'noreply@childclub.com',
      },
    })] : []),
    
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
