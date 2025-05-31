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
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateTrackDto) {
    return this.trackService.create(dto);
  }

  @Get()
  findAll() {
    return this.trackService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!isUuid(id)) {
      throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
    }

    const track = this.trackService.findOne(id);

    if (track === 'not_found') {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }

    return track;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTrackDto) {
    if (!isUuid(id)) {
      throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
    }

    const track = this.trackService.update(id, dto);

    if (track === 'not_found') {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }

    return track;
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    if (!isUuid(id)) {
      throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
    }

    const track = this.trackService.remove(id);

    if (track === 'not_found') {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }

    return track;
  }
}
