import { validate as isUuid } from 'uuid';
import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('favs')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly prisma: PrismaService,
  ) {}

  private async getFirstUserId(): Promise<string> {
    let user = await this.prisma.user.findFirst();
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          login: 'default-user',
          password: 'default-password',
        },
      });
    }
    return user.id;
  }

  @Get()
  async findAll() {
    const userId = await this.getFirstUserId();
    return await this.favoritesService.findAll(userId);
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  async addTrack(@Param('id') id: string) {
    const userId = await this.getFirstUserId();
    if (!isUuid(id)) {
      throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
    }

    const result = await this.favoritesService.addTrack(userId, id);

    if (result === 'unprocessable') {
      throw new HttpException(
        'Track not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return;
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrack(@Param('id') id: string) {
    if (!isUuid(id)) {
      throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
    }

    const userId = await this.getFirstUserId();
    const result = await this.favoritesService.removeTrack(userId, id);

    if (result === 'not_found') {
      throw new HttpException('Track not in favorites', HttpStatus.NOT_FOUND);
    }

    return;
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  async addAlbum(@Param('id') id: string) {
    if (!isUuid(id)) {
      throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
    }

    const userId = await this.getFirstUserId();
    const result = await this.favoritesService.addAlbum(userId, id);

    if (result === 'unprocessable') {
      throw new HttpException(
        'Track not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return;
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAlbum(@Param('id') id: string) {
    if (!isUuid(id)) {
      throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
    }

    const userId = await this.getFirstUserId();
    const result = await this.favoritesService.removeAlbum(userId, id);

    if (result === 'not_found') {
      throw new HttpException('Track not in favorites', HttpStatus.NOT_FOUND);
    }

    return;
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  async addArtist(@Param('id') id: string) {
    if (!isUuid(id)) {
      throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
    }

    const userId = await this.getFirstUserId();
    const result = await this.favoritesService.addArtist(userId, id);

    if (result === 'unprocessable') {
      throw new HttpException(
        'Track not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return;
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeArtist(@Param('id') id: string) {
    if (!isUuid(id)) {
      throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
    }

    const userId = await this.getFirstUserId();
    const result = await this.favoritesService.removeArtist(userId, id);

    if (result === 'not_found') {
      throw new HttpException('Track not in favorites', HttpStatus.NOT_FOUND);
    }

    return;
  }
}
