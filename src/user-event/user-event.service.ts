import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEvent } from './user-event.entity';
import { User } from '../user/user.entity';
import { Event } from '../event/event.entity';

@Injectable()
export class UserEventService {
  constructor(
    @InjectRepository(UserEvent)
    private readonly userEventRepository: Repository<UserEvent>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>
  ) {}

  async registerUserToEvent(
    user_id: number,
    event_id: number
  ): Promise<{ message: string; data?: UserEvent; statusCode: number }> {
    const user = await this.userRepository.findOne({ where: { id: user_id } });
    if (!user) {
      return { statusCode: 422, message: `User with ID ${user_id} not found` };
    }

    const event = await this.eventRepository.findOne({
      where: { id: event_id },
    });
    if (!event) {
      return {
        statusCode: 422,
        message: `Event with ID ${event_id} not found`,
      };
    }
    const existingUserEvent = await this.userEventRepository.findOne({
      where: { user: { id: user_id }, event: { id: event_id } },
    });
    if (existingUserEvent) {
      return {
        statusCode: 409,
        message: `User with ID ${user_id} is already registered for event with ID ${event_id}`,
      };
    }

    const userEvent = this.userEventRepository.create({ user, event });
    const savedUserEvent = await this.userEventRepository.save(userEvent);

    return {
      statusCode: 200,
      message: 'User registered to event successfully',
      data: savedUserEvent,
    };
  }

  async getUserEvents(
    user_id: number,
    status: 'ongoing' | 'past' | 'upcoming' | 'all' = 'all',
    genre?: string
  ): Promise<{
    statusCode: number;
    message: string;
    data: any[];
    count: number;
  }> {
    const user = await this.userRepository.findOne({
      where: { id: user_id },
      select: ['id'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} does not exist`);
    }

    const now = new Date();

    const query = this.userEventRepository
      .createQueryBuilder('user_event')
      .leftJoinAndSelect('user_event.event', 'event')
      .where('user_event.user_id = :userId', { userId: user_id });

    if (status === 'ongoing') {
      query.andWhere(
        'event.event_start_date <= :now AND event.event_end_date >= :now',
        { now }
      );
    } else if (status === 'upcoming') {
      query.andWhere('event.event_start_date > :now', { now });
    } else if (status === 'past') {
      query.andWhere('event.event_end_date < :now', { now });
    }

    if (genre) {
      query.andWhere('LOWER(event.event_type) = LOWER(:genre)', { genre });
    }

    const userEvents = await query.getMany();

    const bookedEvents = userEvents.map((ue) => ({
      event_start_date: ue.event.event_start_date,
      event_end_date: ue.event.event_end_date,
      event_name: ue.event.event_name,
      event_type: ue.event.event_type,
      status: ue.event.status,
      location: ue.event.location,
    }));
    return {
      statusCode: HttpStatus.OK,
      message: 'Events found successfully',
      data: bookedEvents,
      count: bookedEvents.length,
    };
  }

  async getEventUsers(
    event_id: number
  ): Promise<{ message: string; data?: any; statusCode: number }> {
    const event = await this.eventRepository.findOne({
      where: { id: event_id },
    });
    if (!event) {
      return {
        statusCode: 422,
        message: `Event with ID ${event_id} does not exist`,
      };
    }

    const [users, count] = await this.userEventRepository.findAndCount({
      where: { event: { id: event_id } },
      relations: ['user'],
    });

    if (count === 0) {
      return {
        statusCode: 422,
        message: `No users found for event with ID ${event_id}`,
      };
    }

    const userData = users.map((userEvent) => {
      const user = userEvent.user;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        age: user.age,
        image: user.image,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };
    });

    return {
      statusCode: 200,
      message: 'Users retrieved successfully',
      data: {
        event: event,
        users: userData,
        totalUserCount: count,
      },
    };
  }
}
