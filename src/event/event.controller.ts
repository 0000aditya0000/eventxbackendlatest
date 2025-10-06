import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  createEventSwagger,
  updateEventSwagger,
  getEventByIdSwagger,
  deleteEventByIdSwagger,
  getUserEventsSwagger,
  searchEventsSwagger,
  getEventTypeSwagger,
  getEventsByStatusSwagger,
  findEventsSwagger,
  getEventsByCreatorSwagger,
  getNearbyEventsSwagger,
} from './event.swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { EventService } from './event.service';
import { UpdateEventDto } from './events.dto';
import { User } from '../user/decorators/user.decorator';

@ApiBearerAuth()
@Controller('events')
@ApiTags('events')
@UseGuards(AuthGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post('create_event')
  @createEventSwagger()
  async createEvent(@Body() eventData) {
    return this.eventService.createEvent(eventData);
  }

  @Get('search')
  @searchEventsSwagger()
  async searchEvents(
    @Query('location') location?: string,
    @Query('name') name?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return this.eventService.searchEvents(location, name, startDate, endDate);
  }

  @Get('status')
  @getEventsByStatusSwagger()
  async getEventByStatus(
    @User('role') role: string,
    @Query('status') type: string = 'all',
    @Query('genre') genre?: string
  ) {
    const isAdmin = role === 'admin';
    return this.eventService.getEventsByStatus(type, isAdmin, genre);
  }

  @Get('userEventList/:userId')
  @getUserEventsSwagger()
  async getUserEvents(@Param('userId') userId: number) {
    return this.eventService.getUserEvents(userId);
  }

  @Get('types/genre')
  @getEventTypeSwagger()
  async getEventTypes() {
    return this.eventService.getEventTypes();
  }

  @Get('find')
  @findEventsSwagger()
  async findEvents(
    @User('role') role: string,
    @Query('keyword') keyword?: string,
    @Query('type') type?: 'trending' | 'upcoming'
  ) {
    const isAdmin = role === 'admin';
    return this.eventService.findEvents(keyword, type, isAdmin);
  }

  @Get('nearby')
  @getNearbyEventsSwagger()
  async getNearby(
    @User('role') role: string,
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('radius') radiusKm?: number
  ) {
    const isAdmin = role === 'admin';
    return this.eventService.getNearbyEvents(
      latitude,
      longitude,
      radiusKm,
      isAdmin
    );
  }

  @Get(':id?')
  @getEventByIdSwagger()
  async getEventById(
    @Param('id') id?: number,
    @Query('user_id') userId?: number // Accept user_id as a query parameter
  ) {
    return this.eventService.getEventById(id, userId);
  }

  @Delete(':id')
  @deleteEventByIdSwagger()
  async deleteEventById(@Param('id') id: number) {
    this.eventService.deleteEventById(id);
  }

  @Patch(':id')
  @updateEventSwagger()
  async updateEventById(
    @Param('id') id: number,
    @Body() eventData: UpdateEventDto,
    @User('role') role: string
  ) {
    const isAdmin = role === 'admin';
    return this.eventService.updateEvent(id, eventData, isAdmin);
  }

  @Get('creator/:userId')
  @ApiBearerAuth()
  @getEventsByCreatorSwagger()
  async getEventsByCreator(@Param('userId') userId: number) {
    return this.eventService.getEventsByCreator(userId);
  }
}
