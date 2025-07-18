import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventController } from './event/event.controller';
import { Event } from './event/event.entity';
import { UserController } from './user/user.controller';
import { User } from './user/user.entity';
import { AdminModule } from './admin/admin.module';
import { UserEventModule } from './user-event/user-event.module';
import { UserEvent } from './user-event/user-event.entity';
import { MailSender } from './mailSender';
import { ConfigModule } from '@nestjs/config';
import { EventModule } from './event/event.module';
import { UserModule } from './user/user.module';
import { AuthService } from './auth/auth.service';
import { Session } from './auth/session.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Event, User, UserEvent, Session],
      synchronize: true,
      ssl:
        process.env.NODE_ENV === 'production'
          ? false
          : { rejectUnauthorized: false },
    }),
    TypeOrmModule.forFeature([Event, User, UserEvent, Session]),
    AdminModule,
    UserModule,
    EventModule,
    UserEventModule,
    AuthModule,
  ],
  controllers: [AppController, EventController, UserController],
  providers: [AppService, AuthService, MailSender],
})
export class AppModule {}
