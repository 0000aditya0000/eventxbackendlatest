import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from './login.dto';

export const LoginUserSwagger = () => {
  return applyDecorators(
    ApiTags('user'),
    ApiOperation({ summary: 'User login' }),
    ApiBody({
      type: LoginDto,
      description: 'User credentials for login',
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' })
  );
};
