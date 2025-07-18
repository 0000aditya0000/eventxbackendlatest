import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Event } from '../event/event.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
// import { AuthGuard } from '../auth/guards/auth.guard';
import { MailSender } from '../mailSender';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Event]), AuthModule],
  controllers: [UserController], // Declare the controller
  providers: [UserService, MailSender], // Declare the service and other providers
  exports: [UserService], // Export the service if it needs to be used in other modules
})
export class UserModule {}
