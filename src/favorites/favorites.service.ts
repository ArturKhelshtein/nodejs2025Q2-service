import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly userId = 'default-user-id';

  async findAll(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        favoriteArtists: true,
        favoriteAlbums: true,
        favoriteTracks: true,
      },
    });

    if (!user) throw new Error('User not found');

    return {
      artists: user.favoriteArtists,
      albums: user.favoriteAlbums,
      tracks: user.favoriteTracks,
    };
  }

  async addTrack(
    userId: string,
    trackId: string,
  ): Promise<boolean | 'unprocessable'> {
    const track = await this.prisma.track.findUnique({
      where: { id: trackId },
    });
    if (!track) return 'unprocessable';

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        favoriteTracks: {
          connect: { id: trackId },
        },
      },
    });

    return true;
  }

  async removeTrack(
    userId: string,
    trackId: string,
  ): Promise<boolean | 'not_found'> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        favoriteTracks: {
          where: { id: trackId },
        },
      },
    });

    if (!user || user.favoriteTracks.length === 0) return 'not_found';

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        favoriteTracks: {
          disconnect: { id: trackId },
        },
      },
    });

    return true;
  }

  async addAlbum(
    userId: string,
    albumId: string,
  ): Promise<boolean | 'unprocessable'> {
    const album = await this.prisma.album.findUnique({
      where: { id: albumId },
    });
    if (!album) return 'unprocessable';

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        favoriteAlbums: {
          connect: { id: albumId },
        },
      },
    });

    return true;
  }

  async removeAlbum(
    userId: string,
    albumId: string,
  ): Promise<boolean | 'not_found'> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        favoriteAlbums: {
          where: { id: albumId },
        },
      },
    });

    if (!user || user.favoriteAlbums.length === 0) return 'not_found';

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        favoriteAlbums: {
          disconnect: { id: albumId },
        },
      },
    });

    return true;
  }

  async addArtist(
    userId: string,
    artistId: string,
  ): Promise<boolean | 'unprocessable'> {
    const artist = await this.prisma.artist.findUnique({
      where: { id: artistId },
    });
    if (!artist) return 'unprocessable';

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        favoriteArtists: {
          connect: { id: artistId },
        },
      },
    });

    return true;
  }

  async removeArtist(
    userId: string,
    artistId: string,
  ): Promise<boolean | 'not_found'> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        favoriteArtists: {
          where: { id: artistId },
        },
      },
    });

    if (!user || user.favoriteArtists.length === 0) return 'not_found';

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        favoriteArtists: {
          disconnect: { id: artistId },
        },
      },
    });

    return true;
  }

  @OnEvent('artist.deleted')
  async handleArtistDeleted(artistId: string) {
    const users = await this.prisma.user.findMany({
      where: {
        favoriteArtists: { some: { id: artistId } },
      },
    });

    for (const user of users) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          favoriteArtists: { disconnect: { id: artistId } },
        },
      });
    }
  }

  @OnEvent('album.deleted')
  async handleAlbumDeleted(albumId: string) {
    const users = await this.prisma.user.findMany({
      where: {
        favoriteAlbums: { some: { id: albumId } },
      },
    });

    for (const user of users) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          favoriteAlbums: { disconnect: { id: albumId } },
        },
      });
    }
  }

  @OnEvent('track.deleted')
  async handleTrackDeleted(trackId: string) {
    const users = await this.prisma.user.findMany({
      where: {
        favoriteTracks: { some: { id: trackId } },
      },
    });

    for (const user of users) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          favoriteTracks: { disconnect: { id: trackId } },
        },
      });
    }
  }
}
