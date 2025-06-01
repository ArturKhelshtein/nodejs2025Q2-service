import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { tracks } from './track.store';

@Injectable()
export class TrackService {
  constructor(private readonly emitter: EventEmitter2) {}

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
    this.emitter.emit('track.deleted', id);

    return true;
  }

  @OnEvent('artist.deleted')
  handleArtistDeleted(artistId: string) {
    tracks.forEach((t) => {
      if (t.artistId === artistId) {
        t.artistId = null;
      }
    });
  }

  @OnEvent('album.deleted')
  handleAlbumDeleted(albumId: string) {
    tracks.forEach((t) => {
      if (t.albumId === albumId) {
        t.albumId = null;
      }
    });
  }
}
