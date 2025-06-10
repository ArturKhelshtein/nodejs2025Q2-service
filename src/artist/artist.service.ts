import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PrismaService } from 'src/prisma/prisma.service';

type Artist = Awaited<ReturnType<PrismaClient['artist']['findUnique']>>;

@Injectable()
export class ArtistService {
  constructor(
    private readonly emitter: EventEmitter2,
    private prisma: PrismaService,
  ) {}

  async create(dto: CreateArtistDto): Promise<Artist> {
    const artist: Artist = {
      id: randomUUID(),
      name: dto.name,
      grammy: dto.grammy,
    };

    return await this.prisma.artist.create({ data: artist });
  }

  async findAll(): Promise<Artist[]> {
    return await this.prisma.artist.findMany();
  }

  async findOne(id: string): Promise<Artist | 'not_found'> {
    const artist = await this.prisma.artist.findUnique({ where: { id } });

    if (!artist) {
      return 'not_found';
    }

    return artist;
  }

  async update(
    id: string,
    dto: UpdateArtistDto,
  ): Promise<Artist | 'not_found'> {
    const artist = await this.prisma.artist.findUnique({ where: { id } });

    if (!artist) {
      return 'not_found';
    }

    artist.name = dto.name;
    artist.grammy = dto.grammy;

    return await this.prisma.artist.update({ where: { id }, data: artist });
  }

  async remove(id: string): Promise<boolean | 'not_found'> {
    const artist = await this.prisma.artist.findUnique({ where: { id } });

    if (!artist) {
      return 'not_found';
    }

    await this.prisma.artist.delete({ where: { id } });
    this.emitter.emit('artist.deleted', id);

    return true;
  }
}
