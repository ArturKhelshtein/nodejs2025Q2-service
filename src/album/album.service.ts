import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { albums } from './album.store';

@Injectable()
export class AlbumService {
  constructor(private readonly emitter: EventEmitter2) {}

  async create(dto: CreateAlbumDto): Promise<Album> {
    const album: Album = {
      id: randomUUID(),
      name: dto.name,
      year: dto.year,
      artistId: dto.artistId,
    };
    albums.push(album);

    return album;
  }

  async findAll(): Promise<Album[]> {
    return albums;
  }

  async findOne(id: string): Promise<Album | 'not_found'> {
    const album = albums.find((a) => a.id === id);

    if (!album) {
      return 'not_found';
    }

    return album;
  }

  async update(id: string, dto: UpdateAlbumDto): Promise<Album | 'not_found'> {
    const album = albums.find((a) => a.id === id);

    if (!album) {
      return 'not_found';
    }

    album.name = dto.name;
    album.year = dto.year;
    album.artistId = dto.artistId;

    return album;
  }

  async remove(id: string): Promise<boolean | 'not_found'> {
    const index = albums.findIndex((a) => a.id === id);

    if (index === -1) {
      return 'not_found';
    }

    albums.splice(index, 1);
    this.emitter.emit('album.deleted', id);

    return true;
  }

  @OnEvent('artist.deleted')
  handleArtistDeleted(artistId: string) {
    albums.forEach((a) => {
      if (a.artistId === artistId) {
        a.artistId = null;
      }
    });
  }
}
