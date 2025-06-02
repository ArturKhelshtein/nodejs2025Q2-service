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
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateArtistDto) {
    return await this.artistService.create(dto);
  }

  @Get()
  async findAll() {
    return await this.artistService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!isUuid(id)) {
      throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
    }

    const artist = await this.artistService.findOne(id);

    if (artist === 'not_found') {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    return artist;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateArtistDto) {
    if (!isUuid(id)) {
      throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
    }

    const artist = await this.artistService.update(id, dto);

    if (artist === 'not_found') {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    return artist;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    if (!isUuid(id)) {
      throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
    }

    const artist = await this.artistService.remove(id);

    if (artist === 'not_found') {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    return artist;
  }
}
