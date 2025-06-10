import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { PrismaService } from 'src/prisma/prisma.service';

type Album = Awaited<ReturnType<PrismaClient['album']['findUnique']>>;

@Injectable()
export class AlbumService {
  constructor(
    private readonly emitter: EventEmitter2,
    private prisma: PrismaService,
  ) {}

  async create(dto: CreateAlbumDto): Promise<Album> {
    const album: Album = {
      id: randomUUID(),
      name: dto.name,
      year: dto.year,
      artistId: dto.artistId,
    };

    return await this.prisma.album.create({ data: album });
  }

  async findAll(): Promise<Album[]> {
    return await this.prisma.album.findMany();
  }

  async findOne(id: string): Promise<Album | 'not_found'> {
    const album = await this.prisma.album.findUnique({ where: { id } });

    if (!album) {
      return 'not_found';
    }

    return album;
  }

  async update(id: string, dto: UpdateAlbumDto): Promise<Album | 'not_found'> {
    const album = await this.prisma.album.findUnique({ where: { id } });

    if (!album) {
      return 'not_found';
    }

    album.name = dto.name;
    album.year = dto.year;
    album.artistId = dto.artistId;

    return await this.prisma.album.update({ where: { id }, data: album });
  }

  async remove(id: string): Promise<boolean | 'not_found'> {
    const album = await this.prisma.album.findUnique({ where: { id } });

    if (!album) {
      return 'not_found';
    }

    await this.prisma.album.delete({ where: { id } });
    this.emitter.emit('album.deleted', id);

    return true;
  }

  @OnEvent('artist.deleted')
  async handleArtistDeleted(artistId: string) {
    await this.prisma.album.updateMany({
      where: { artistId },
      data: { artistId: null },
    });
  }
}
