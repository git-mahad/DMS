import { Injectable, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import * as fs from 'fs';
import * as path from 'path';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getMyProfile(id: number): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  
  async updateMyProfile(id: number, updateData: Partial<User>): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, updateData);
    const updatedUser = await this.userRepository.save(user);
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async uploadDocument(id: number, file: Express.Multer.File): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
  
    user.documentPath = file.filename;
    await this.userRepository.save(user);
  
    return `File uploaded successfully: ${file.filename}`;
  }
  
  async deleteDocument(id: number): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user || !user.documentPath) throw new NotFoundException('Document not found');
  
    const filepath = path.join(__dirname, '..', '..', 'uploads', user.documentPath);
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
  
    user.documentPath = null;
    await this.userRepository.save(user);
  
    return 'Document deleted successfully';
  }
  
  async updateDocument(id: number, file: Express.Multer.File): Promise<string> {
    await this.deleteDocument(id);
    return this.uploadDocument(id, file);
  }
}
