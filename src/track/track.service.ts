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

  async create(dto: CreateTrackDto): Promise<Track> {
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

  async findAll(): Promise<Track[]> {
    return tracks;
  }

  async findOne(id: string): Promise<Track | 'not_found'> {
    const track = tracks.find((t) => t.id === id);

    if (!track) {
      return 'not_found';
    }

    return track;
  }

  async update(id: string, dto: UpdateTrackDto): Promise<Track | 'not_found'> {
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

  async remove(id: string): Promise<boolean | 'not_found'> {
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
