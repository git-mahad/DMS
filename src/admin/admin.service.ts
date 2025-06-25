import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async getAllUsers(): Promise<Partial<User>[]> {
    const users = await this.userRepository.find();
    return users.map(({ password, ...user }) => user);
  }

  async updateUserStatus(id: number, isActive: boolean): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    user.isActive = isActive;

    const updatedUser = await this.userRepository.save(user);
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async getUserById(id: number): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUserInfo(id: number, updateData: Partial<Pick<User, 'name' | 'email' | 'role'>>
  ): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (updateData.email && updateData.email !== user.email) {
      const existing = await this.userRepository.findOne({
        where: { email: updateData.email },
      });
      if (existing) {
        throw new ConflictException('Email already in use');
      }
    }

    Object.assign(user, updateData);

    const updatedUser = await this.userRepository.save(user);
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async hasUploadedDocument(id: number): Promise<{ hasUploaded: boolean }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return { hasUploaded: !!user.documentPath };
  }

  async getDocumentByUserId(id: number): Promise<{ filename: string; filepath: string }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user || !user.documentPath) {
      throw new NotFoundException('Document not found');
    }
    return {
      filename: user.documentPath,
      filepath: `uploads/${user.documentPath}`,
    };
  }

  async getUsersWithDocuments(): Promise<Partial<User>[]> {
    const users = await this.userRepository.find({
      where: {
        documentPath: Not(IsNull()),
      },
    });
    return users.map(({ password, ...user }) => user);
  }

  async updateDocument(id: number, file: Express.Multer.File): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (user.documentPath) {
      const oldPath = path.join('uploads', user.documentPath);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    user.documentPath = file.filename;
    await this.userRepository.save(user);
    return `Document updated: ${file.filename}`;
  }

  async deleteDocument(id: number): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user || !user.documentPath) throw new NotFoundException('Document not found');

    const filePath = path.join('uploads', user.documentPath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    user.documentPath = null;
    await this.userRepository.save(user);
    return 'Document deleted successfully';
  }

  async addDocument(id: number, file: Express.Multer.File): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    user.documentPath = file.filename;
    await this.userRepository.save(user);
    return `Document added: ${file.filename}`;
  }
}
