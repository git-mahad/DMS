import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Post,
  Delete,
  Res,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';
import { UpdateUserInfoDto } from 'src/auth/dto/update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import * as path from 'path';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('users/:id')
  async getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(+id);
  }

  @Patch('users/:id/status')
  async updateUserStatus(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.adminService.updateUserStatus(+id, isActive);
  }

  @Patch('users/:id/info')
  async updateUserInfo(
    @Param('id') id: string,
    @Body() body: UpdateUserInfoDto,
  ) {
    return this.adminService.updateUserInfo(+id, body);
  }

  // document apis

  @Get('users/:id/document/status')
  async checkIfUserHasDocument(@Param('id') id: string) {
    return this.adminService.hasUploadedDocument(+id);
  }

  @Get('users/:id/document')
  async getDocumentByUserId(@Param('id') id: string, @Res() res: Response) {
    const doc = await this.adminService.getDocumentByUserId(+id);
    const fullPath = path.join(process.cwd(), doc.filepath);
    return res.sendFile(fullPath);
  }

  @Get('documents')
  async getAllUsersWithDocuments() {
    return this.adminService.getUsersWithDocuments();
  }

  @Patch('users/:id/document')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async updateUserDocument(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new NotFoundException('File not provided');
    return this.adminService.updateDocument(+id, file);
  }

  @Delete('users/:id/document')
  async deleteUserDocument(@Param('id') id: string) {
    return this.adminService.deleteDocument(+id);
  }

  @Post('users/:id/document')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async addDocumentToUser(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new NotFoundException('File not provided');
    return this.adminService.addDocument(+id, file);
  }
}
