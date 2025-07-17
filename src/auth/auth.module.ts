import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Session } from './session.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Session, User])],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService], // Allow use in guards, etc.
})
export class AuthModule {}
