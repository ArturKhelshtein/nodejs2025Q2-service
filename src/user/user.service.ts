import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { users } from './user.store';

@Injectable()
export class UserService {
  create(dto: CreateUserDto): User {
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

  findAll(): User[] {
    return users;
  }

  findOne(id: string): User | 'not_found' {
    const user = users.find((u) => u.id === id);

    if (!user) {
      return 'not_found';
    }

    return user;
  }

  updatePassword(
    id: string,
    dto: UpdatePasswordDto,
  ): User | 'not_found' | 'wrong_password' {
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

  remove(id: string): boolean | 'not_found' {
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      return 'not_found';
    }

    users.splice(index, 1);

    return true;
  }
}
