import { Request as ExpressRequest } from 'express';
import {
  Controller, Get, Patch, Body, UseGuards, Request, Req, UseInterceptors, UploadedFile, Post,
  Delete,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('me')
  async getMyProfile(@Request() req) {
    return this.userService.getMyProfile(req.user.id);
  }

  @Patch('me')
  async updateMyProfile(@Request() req, @Body() updateData: any) {
    return this.userService.updateMyProfile(req.user.id, updateData);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowed = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/png',
          'image/jpeg',
        ];
        if (allowed.includes(file.mimetype)) cb(null, true);
        else cb(new Error('Invalid file type'), false);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: ExpressRequest & { user: any },
  ) {
    if (!file) {
      throw new BadRequestException('File not provided. Did you set form-data key to "file"?');
    }
    return this.userService.uploadDocument(req.user.id, file);
  }

  @Delete('document')
  async deleteDocument(@Req() req: ExpressRequest & { user: any }) {
    return this.userService.deleteDocument(req.user.id);
  }

  @Patch('document')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowed = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/png',
          'image/jpeg',
        ];
        if (allowed.includes(file.mimetype)) cb(null, true);
        else cb(new Error('Invalid file type'), false);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async updateDocument(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: ExpressRequest & { user: any },
  ) {
    return this.userService.updateDocument(req.user.id, file);
  }
}
