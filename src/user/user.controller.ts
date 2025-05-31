import { validate as isUuid } from 'uuid';
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateUserDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...createdUser } = this.userService.create(dto);

    return createdUser;
  }

  @Get()
  findAll() {
    const result = this.userService.findAll().map((u) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = u;
      return rest;
    });

    return result;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!isUuid(id)) {
      throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
    }

    const result = this.userService.findOne(id);

    if (result === 'not_found') {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = result;

    return user;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePasswordDto) {
    if (!isUuid(id)) {
      throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
    }

    const result = this.userService.updatePassword(id, dto);

    if (result === 'not_found') {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (result === 'wrong_password') {
      throw new HttpException('Something wrong', HttpStatus.FORBIDDEN);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = result;

    return user;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    if (!isUuid(id)) {
      throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
    }

    const user = this.userService.remove(id);

    if (user === 'not_found') {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return;
  }
}
