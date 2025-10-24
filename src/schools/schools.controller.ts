import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSchoolDto } from './dto/create-school.dto';
import { ApproveSchoolDto } from './dto/approve-school.dto';
import { RejectSchoolDto } from './dto/reject-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { UserRole } from '../users/entities/user.entity';

@Controller('schools')
@UseGuards(JwtAuthGuard)
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Get()
  async findAll(
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Request() req?: any,
  ) {
    return this.schoolsService.findAll({
      status,
      type,
      search,
      page: page || 1,
      limit: limit || 10,
      userRole: req?.user?.role,
      schoolId: req?.user?.schoolId,
    });
  }

  @Get('pending/count')
  async getPendingCount(@Request() req: any) {
    // Only super admin can view pending count
    if (req.user.role !== UserRole.SUPER_ADMIN) {
      throw new HttpException('Insufficient permissions', HttpStatus.FORBIDDEN);
    }
    
    return this.schoolsService.getPendingCount();
  }

  @Get('me')
  async findMySchool(@Request() req: any) {
    // Get school by user ID from JWT token (proper relation)
    const userId = req.user.userId || req.user.id;
    return this.schoolsService.findByUserId(parseInt(userId));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.schoolsService.findOne(parseInt(id));
  }

  @Post()
  async create(
    @Body() createSchoolDto: CreateSchoolDto,
    @Request() req: any,
  ) {
    // School admins can create schools, super admin can also create
    if (req.user.role !== UserRole.SCHOOL_ADMIN && req.user.role !== UserRole.SUPER_ADMIN) {
      throw new HttpException('Only school admins can register schools', HttpStatus.FORBIDDEN);
    }
    
    return this.schoolsService.create(createSchoolDto, req.user.id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSchoolDto: UpdateSchoolDto,
    @Request() req: any,
  ) {
    // Only super admin or school admin can update
    if (req.user.role !== UserRole.SUPER_ADMIN && req.user.role !== UserRole.SCHOOL_ADMIN) {
      throw new HttpException('Insufficient permissions', HttpStatus.FORBIDDEN);
    }
    
    return this.schoolsService.update(parseInt(id), updateSchoolDto, req.user.id);
  }

  @Post(':id/approve')
  async approveSchool(
    @Param('id') id: string,
    @Body() approveSchoolDto: ApproveSchoolDto,
    @Request() req: any,
  ) {
    // Only super admin can approve schools
    if (req.user.role !== UserRole.SUPER_ADMIN) {
      throw new HttpException('Only super admin can approve schools', HttpStatus.FORBIDDEN);
    }
    
    return this.schoolsService.approveSchool(parseInt(id), req.user.id, approveSchoolDto.comments);
  }

  @Post(':id/reject')
  async rejectSchool(
    @Param('id') id: string,
    @Body() rejectSchoolDto: RejectSchoolDto,
    @Request() req: any,
  ) {
    // Only super admin can reject schools
    if (req.user.role !== UserRole.SUPER_ADMIN) {
      throw new HttpException('Only super admin can reject schools', HttpStatus.FORBIDDEN);
    }
    
    return this.schoolsService.rejectSchool(parseInt(id), req.user.id, rejectSchoolDto.reason);
  }

  @Post(':id/suspend')
  async suspendSchool(
    @Param('id') id: string,
    @Body() rejectSchoolDto: RejectSchoolDto,
    @Request() req: any,
  ) {
    // Only super admin can suspend schools
    if (req.user.role !== UserRole.SUPER_ADMIN) {
      throw new HttpException('Only super admin can suspend schools', HttpStatus.FORBIDDEN);
    }
    
    return this.schoolsService.suspendSchool(parseInt(id), req.user.id, rejectSchoolDto.reason);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    // Only super admin can delete schools
    if (req.user.role !== UserRole.SUPER_ADMIN) {
      throw new HttpException('Only super admin can delete schools', HttpStatus.FORBIDDEN);
    }
    
    return this.schoolsService.remove(parseInt(id));
  }
}

