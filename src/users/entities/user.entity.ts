import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserRole } from './user-role.enum';
import { UserStatus } from './user-status.enum';

// Re-export enums for external use
export { UserRole, UserStatus };

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'firstName', type: 'varchar', length: 100 })
  firstName: string;

  @Column({ name: 'lastName', type: 'varchar', length: 100 })
  lastName: string;

  @Column({ name: 'email', type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'mobile', type: 'varchar', length: 255, nullable: true, unique: true })
  mobile: string;

  @Column({ name: 'password', type: 'varchar', length: 255 })
  password: string;

  @Column({ name: 'role', type: 'enum', enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @Column({ name: 'status', type: 'enum', enum: UserStatus, default: UserStatus.PENDING })
  status: UserStatus;

  @Column({ name: 'profilePicture', type: 'varchar', length: 255, nullable: true })
  profilePicture: string;

  @Column({ name: 'city', type: 'varchar', length: 255, nullable: true })
  city: string;

  @Column({ name: 'state', type: 'varchar', length: 255, nullable: true })
  state: string;

  @Column({ name: 'country', type: 'varchar', length: 255, nullable: true })
  country: string;

  @Column({ name: 'postalCode', type: 'varchar', length: 255, nullable: true })
  postalCode: string;

  @Column({ name: 'emailVerified', type: 'tinyint', default: 0 })
  emailVerified: number;

  @Column({ name: 'mobileVerified', type: 'tinyint', default: 0 })
  mobileVerified: number;

  @Column({ name: 'lastLoginAt', type: 'datetime', nullable: true })
  lastLoginAt: Date;

  @Column({ name: 'lastLoginIp', type: 'varchar', length: 255, nullable: true })
  lastLoginIp: string;

  @Column({ name: 'dateOfBirth', type: 'datetime', nullable: true })
  dateOfBirth: Date;

  @Column({ name: 'address', type: 'varchar', length: 255, nullable: true })
  address: string;

  // School Admin specific fields
  @Column({ name: 'adminPosition', type: 'varchar', length: 100, nullable: true })
  adminPosition: string;

  @Column({ name: 'yearsOfExperience', type: 'varchar', length: 50, nullable: true })
  yearsOfExperience: string;

  @Column({ name: 'educationLevel', type: 'varchar', length: 100, nullable: true })
  educationLevel: string;

  @Column({ name: 'certifications', type: 'text', nullable: true })
  certifications: string;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime', precision: 6 })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime', precision: 6 })
  updatedAt: Date;

  // Hook to hash password before insert
  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      console.log('Password hashed on insert');
    }
  }

  // Hook to hash password before update (only if password changed)
  @BeforeUpdate()
  async hashPasswordBeforeUpdate() {
    // Only hash if password was modified
    // Check if password looks like it's already hashed (bcrypt hashes start with $2a$ or $2b$)
    if (this.password && !this.password.startsWith('$2a$') && !this.password.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      console.log('Password hashed on update');
    }
  }

  // Method to validate password using bcrypt
  async validatePassword(password: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      console.error('Password validation error:', error);
      return false;
    }
  }
}


