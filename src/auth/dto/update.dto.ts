import { IsOptional, IsEmail, IsEnum, IsString } from 'class-validator';
import { UserRole } from '../../auth/entities/user.entity';

export class UpdateUserInfoDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
