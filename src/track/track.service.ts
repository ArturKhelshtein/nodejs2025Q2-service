import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { tracks } from './track.store';

@Injectable()
export class TrackService {
  create(dto: CreateTrackDto): Track {
    const track: Track = {
      id: randomUUID(),
      name: dto.name,
      artistId: dto.artistId,
      albumId: dto.albumId,
      duration: dto.duration,
    };
    tracks.push(track);

    return track;
  }

  findAll(): Track[] {
    return tracks;
  }

  findOne(id: string): Track | 'not_found' {
    const track = tracks.find((t) => t.id === id);

    if (!track) {
      return 'not_found';
    }

    return track;
  }

  update(id: string, dto: UpdateTrackDto): Track | 'not_found' {
    const track = tracks.find((t) => t.id === id);

    if (!track) {
      return 'not_found';
    }

    track.name = dto.name;
    track.artistId = dto.artistId;
    track.albumId = dto.albumId;
    track.duration = dto.duration;

    return track;
  }

  remove(id: string): boolean | 'not_found' {
    const index = tracks.findIndex((t) => t.id === id);

    if (index === -1) {
      return 'not_found';
    }

    tracks.splice(index, 1);

    return true;
  }
}
