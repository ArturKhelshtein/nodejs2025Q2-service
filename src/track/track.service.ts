import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaService } from 'src/prisma/prisma.service';

type Track = Awaited<ReturnType<PrismaClient['track']['findUnique']>>;

@Injectable()
export class TrackService {
  constructor(
    private readonly emitter: EventEmitter2,
    private prisma: PrismaService,
  ) {}

  async create(dto: CreateTrackDto): Promise<Track> {
    const track: Track = {
      id: randomUUID(),
      name: dto.name,
      artistId: dto.artistId,
      albumId: dto.albumId,
      duration: dto.duration,
    };

    return await this.prisma.track.create({ data: track });
  }

  async findAll(): Promise<Track[]> {
    return await this.prisma.track.findMany();
  }

  async findOne(id: string): Promise<Track | 'not_found'> {
    const track = await this.prisma.track.findUnique({ where: { id } });

    if (!track) {
      return 'not_found';
    }

    return track;
  }

  async update(id: string, dto: UpdateTrackDto): Promise<Track | 'not_found'> {
    const track = await this.prisma.track.findUnique({ where: { id } });

    if (!track) {
      return 'not_found';
    }

    track.name = dto.name;
    track.artistId = dto.artistId;
    track.albumId = dto.albumId;
    track.duration = dto.duration;

    return await this.prisma.track.update({ where: { id }, data: track });
  }

  async remove(id: string): Promise<boolean | 'not_found'> {
    const track = await this.prisma.track.findUnique({ where: { id } });

    if (!track) {
      return 'not_found';
    }

    await this.prisma.track.delete({ where: { id } });
    this.emitter.emit('track.deleted', id);

    return true;
  }

  @OnEvent('artist.deleted')
  async handleArtistDeleted(artistId: string) {
    await this.prisma.track.updateMany({
      where: { artistId },
      data: { artistId: null },
    });
  }

  @OnEvent('album.deleted')
  async handleAlbumDeleted(albumId: string) {
    await this.prisma.track.updateMany({
      where: { albumId },
      data: { albumId: null },
    });
  }
}
