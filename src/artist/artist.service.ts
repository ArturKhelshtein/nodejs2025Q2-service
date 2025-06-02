import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { artists } from './artist.store';

@Injectable()
export class ArtistService {
  constructor(private readonly emitter: EventEmitter2) {}

  async create(dto: CreateArtistDto): Promise<Artist> {
    const artist: Artist = {
      id: randomUUID(),
      name: dto.name,
      grammy: dto.grammy,
    };
    artists.push(artist);

    return artist;
  }

  async findAll(): Promise<Artist[]> {
    return artists;
  }

  async findOne(id: string): Promise<Artist | 'not_found'> {
    const artist = artists.find((a) => a.id === id);

    if (!artist) {
      return 'not_found';
    }

    return artist;
  }

  async update(
    id: string,
    dto: UpdateArtistDto,
  ): Promise<Artist | 'not_found'> {
    const artist = artists.find((a) => a.id === id);

    if (!artist) {
      return 'not_found';
    }

    artist.name = dto.name;
    artist.grammy = dto.grammy;

    return artist;
  }

  async remove(id: string): Promise<boolean | 'not_found'> {
    const index = artists.findIndex((a) => a.id === id);

    if (index === -1) {
      return 'not_found';
    }

    artists.splice(index, 1);
    this.emitter.emit('artist.deleted', id);

    return true;
  }
}
