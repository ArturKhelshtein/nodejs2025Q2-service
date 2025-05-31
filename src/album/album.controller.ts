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
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateAlbumDto) {
    return this.albumService.create(dto);
  }

  @Get()
  findAll() {
    return this.albumService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!isUuid(id)) {
      throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
    }

    const album = this.albumService.findOne(id);

    if (album === 'not_found') {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }

    return album;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAlbumDto) {
    if (!isUuid(id)) {
      throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
    }

    const album = this.albumService.update(id, dto);

    if (album === 'not_found') {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }

    return album;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    if (!isUuid(id)) {
      throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
    }

    const album = this.albumService.remove(id);

    if (album === 'not_found') {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }

    return album;
  }
}
