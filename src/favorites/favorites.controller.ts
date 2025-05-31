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

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  addTrack(@Param('id') id: string) {
    if (!isUuid(id)) {
      throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
    }

    const result = this.favoritesService.addTrack(id);

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
  removeTrack(@Param('id') id: string) {
    if (!isUuid(id)) {
      throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
    }

    const result = this.favoritesService.removeTrack(id);

    if (result === 'not_found') {
      throw new HttpException('Track not in favorites', HttpStatus.NOT_FOUND);
    }

    return;
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  addAlbum(@Param('id') id: string) {
    if (!isUuid(id)) {
      throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
    }

    const result = this.favoritesService.addAlbum(id);

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
  removeAlbum(@Param('id') id: string) {
    if (!isUuid(id)) {
      throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
    }

    const result = this.favoritesService.removeAlbum(id);

    if (result === 'not_found') {
      throw new HttpException('Track not in favorites', HttpStatus.NOT_FOUND);
    }

    return;
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  addArtist(@Param('id') id: string) {
    if (!isUuid(id)) {
      throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
    }

    const result = this.favoritesService.addArtist(id);

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
  removeArtist(@Param('id') id: string) {
    if (!isUuid(id)) {
      throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
    }

    const result = this.favoritesService.removeArtist(id);

    if (result === 'not_found') {
      throw new HttpException('Track not in favorites', HttpStatus.NOT_FOUND);
    }

    return;
  }
}
