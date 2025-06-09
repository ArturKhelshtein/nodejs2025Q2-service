import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<User> {
    const now = Date.now();

    return this.prisma.user.create({
      data: {
        login: dto.login,
        password: dto.password,
        version: 1,
        createdAt: now,
        updatedAt: now,
      },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<User | 'not_found'> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return 'not_found';
    }

    return user;
  }

  async updatePassword(
    id: string,
    dto: UpdatePasswordDto,
  ): Promise<User | 'not_found' | 'wrong_password'> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      return 'not_found';
    }

    if (user.password !== dto.oldPassword) {
      return 'wrong_password';
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        password: dto.newPassword,
        version: user.version + 1,
        updatedAt: Date.now(),
      },
    });
  }

  async remove(id: string): Promise<boolean | 'not_found'> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      return 'not_found';
    }

    await this.prisma.user.delete({ where: { id } });

    return true;
  }
}
