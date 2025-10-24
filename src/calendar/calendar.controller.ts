import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  Request,
  Query,
  ParseIntPipe
} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('calendar')
@UseGuards(JwtAuthGuard)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post()
  async create(@Body() createEventDto: CreateCalendarEventDto, @Request() req) {
    const userId = req.user.userId;
    const schoolId = req.user.schoolId;
    return await this.calendarService.create(createEventDto, userId, schoolId);
  }

  @Get()
  async findAll(@Request() req) {
    const schoolId = req.user.schoolId;
    return await this.calendarService.findAll(schoolId);
  }

  @Get('upcoming')
  async findUpcoming(@Request() req, @Query('limit') limit?: string) {
    const schoolId = req.user.schoolId;
    const limitNum = limit ? parseInt(limit) : 5;
    return await this.calendarService.findUpcoming(schoolId, limitNum);
  }

  @Get('range')
  async findByDateRange(
    @Request() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    const schoolId = req.user.schoolId;
    return await this.calendarService.findByDateRange(
      schoolId,
      new Date(startDate),
      new Date(endDate)
    );
  }

  @Get('count')
  async countUpcoming(@Request() req) {
    const schoolId = req.user.schoolId;
    const count = await this.calendarService.countUpcoming(schoolId);
    return { count };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const schoolId = req.user.schoolId;
    return await this.calendarService.findOne(id, schoolId);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateCalendarEventDto,
    @Request() req
  ) {
    const userId = req.user.userId;
    const schoolId = req.user.schoolId;
    return await this.calendarService.update(id, updateEventDto, userId, schoolId);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = req.user.userId;
    const schoolId = req.user.schoolId;
    await this.calendarService.remove(id, userId, schoolId);
    return { message: 'Event deleted successfully' };
  }

  @Patch(':id/cancel')
  async cancel(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = req.user.userId;
    const schoolId = req.user.schoolId;
    return await this.calendarService.cancel(id, userId, schoolId);
  }

  @Patch(':id/postpone')
  async postpone(
    @Param('id', ParseIntPipe) id: number,
    @Body('newDate') newDate: string,
    @Request() req
  ) {
    const userId = req.user.userId;
    const schoolId = req.user.schoolId;
    return await this.calendarService.postpone(id, new Date(newDate), userId, schoolId);
  }
}

