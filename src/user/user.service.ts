import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { users } from 'src/db';

@Injectable()
export class UserService {
  async create(dto: CreateUserDto): Promise<User> {
    const now = Date.now();
    const user: User = {
      id: randomUUID(),
      login: dto.login,
      password: dto.password,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };
    users.push(user);

    return user;
  }

  async findAll(): Promise<User[]> {
    return users;
  }

  async findOne(id: string): Promise<User | 'not_found'> {
    const user = users.find((u) => u.id === id);

    if (!user) {
      return 'not_found';
    }

    return user;
  }

  async updatePassword(
    id: string,
    dto: UpdatePasswordDto,
  ): Promise<User | 'not_found' | 'wrong_password'> {
    const user = users.find((u) => u.id === id);

    if (!user) {
      return 'not_found';
    }

    if (user.password !== dto.oldPassword) {
      return 'wrong_password';
    }

    user.password = dto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    return user;
  }

  async remove(id: string): Promise<boolean | 'not_found'> {
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      return 'not_found';
    }

    users.splice(index, 1);

    return true;
  }
}
