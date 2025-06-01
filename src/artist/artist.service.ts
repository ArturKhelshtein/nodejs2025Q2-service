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

  create(dto: CreateArtistDto) {
    const artist: Artist = {
      id: randomUUID(),
      name: dto.name,
      grammy: dto.grammy,
    };
    artists.push(artist);

    return artist;
  }

  findAll(): Artist[] {
    return artists;
  }

  findOne(id: string): Artist | 'not_found' {
    const artist = artists.find((a) => a.id === id);

    if (!artist) {
      return 'not_found';
    }

    return artist;
  }

  update(id: string, dto: UpdateArtistDto): Artist | 'not_found' {
    const artist = artists.find((a) => a.id === id);

    if (!artist) {
      return 'not_found';
    }

    artist.name = dto.name;
    artist.grammy = dto.grammy;

    return artist;
  }

  remove(id: string): boolean | 'not_found' {
    const index = artists.findIndex((a) => a.id === id);

    if (index === -1) {
      return 'not_found';
    }

    artists.splice(index, 1);
    this.emitter.emit('artist.deleted', id);

    return true;
  }
}
