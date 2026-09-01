import {
  Body,
  Controller,
  Get,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';

interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
    email: string;
    role: string;
  };
}

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getCurrentUser(@Req() req: AuthenticatedRequest) {
    return this.usersService.getUser(req.user.userId);
  }

  @Put('me')
  async updateCurrentUser(
    @Req() req: AuthenticatedRequest,
    @Body()
    data: {
      nom: string;
      telephone: string;
      avatar?: string | null;
      ancienPassword?: string;
      nouveauPassword?: string;
    },
  ) {
     console.log('========== PUT /users/me ==========');
  console.log('USER JWT :', req.user);
  console.log('BODY :', data);
  console.log('===================================');

    return this.usersService.updateUser(req.user.userId, data);
  }
}