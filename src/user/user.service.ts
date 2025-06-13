import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserDto } from './dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

type User = Awaited<ReturnType<PrismaClient['user']['findUnique']>>;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private toDto(user: User): UserDto {
    return new UserDto(user);
  }

  async create(dto: CreateUserDto): Promise<UserDto> {
    const cratedUser = await this.prisma.user.create({
      data: {
        login: dto.login,
        password: dto.password,
        version: 1,
      },
      select: {
        id: true,
        login: true,
        password: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return this.toDto(cratedUser);
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<UserDto | 'not_found'> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return 'not_found';
    }

    return this.toDto(user);
  }

  async updatePassword(
    id: string,
    dto: UpdatePasswordDto,
  ): Promise<UserDto | 'not_found' | 'wrong_password'> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      return 'not_found';
    }

    if (user.password !== dto.oldPassword) {
      return 'wrong_password';
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: dto.newPassword,
        version: user.version + 1,
      },
    });

    return this.toDto(updatedUser);
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
