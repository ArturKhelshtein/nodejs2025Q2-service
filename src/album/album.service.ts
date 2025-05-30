import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { albums } from './album.store';

@Injectable()
export class AlbumService {
  create(dto: CreateAlbumDto): Album {
    const album: Album = {
      id: randomUUID(),
      name: dto.name,
      year: dto.year,
      artistId: dto.artistId,
    };
    albums.push(album);

    return album;
  }

  findAll(): Album[] {
    return albums;
  }

  findOne(id: string): Album | 'not_found' {
    const album = albums.find((a) => a.id === id);

    if (!album) {
      return 'not_found';
    }

    return album;
  }

  update(id: string, dto: UpdateAlbumDto): Album | 'not_found' {
    const album = albums.find((a) => a.id === id);

    if (!album) {
      return 'not_found';
    }

    album.name = dto.name;
    album.year = dto.year;
    album.artistId = dto.artistId;

    return album;
  }

  remove(id: string): boolean | 'not_found' {
    const index = albums.findIndex((a) => a.id === id);

    if (index === -1) {
      return 'not_found';
    }

    albums.splice(index, 1);

    return true;
  }
}
