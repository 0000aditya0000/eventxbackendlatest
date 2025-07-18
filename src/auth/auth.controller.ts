import {
  Controller,
  Post,
  Req,
  UseGuards,
  Headers,
  Body,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { LoginUserSwagger } from './swagger.auth';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @LoginUserSwagger()
  async login(@Body() credentials: { email: string; password: string }) {
    return this.authService.login(credentials);
  }

  @Post('logout')
  async logout(@Headers('authorization') authHeader: string) {
    try {
      const token = authHeader?.split(' ')[1];
      if (!token) {
        throw new HttpException('Missing token', 401);
      }
      return await this.authService.logout(token);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Logout failed', 500);
    }
  }

  @Post('protected')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  protected(@Req() req) {
    return { message: `Welcome ${req.user.email}` };
  }
}
