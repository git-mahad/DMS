import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getMyProfile(@Request() req) {
    return this.userService.getMyProfile(req.user.id);
  }

  @Patch('me')
  async updateMyProfile(@Request() req, @Body() updateData: any) {
    return this.userService.updateMyProfile(req.user.id, updateData);
  }
}
