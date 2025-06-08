import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { favorites, tracks, albums, artists } from 'src/db';
import { Favorite } from './entities/favorite.entity';

@Injectable()
export class FavoritesService {
  async findAll(): Promise<Favorite> {
    return favorites;
  }

  async addTrack(id: string): Promise<boolean | 'unprocessable'> {
    const track = tracks.find((t) => t.id === id);

    if (!track) {
      return 'unprocessable';
    }

    const alreadyExists = favorites.tracks.some((t) => t.id === track.id);

    if (!alreadyExists) {
      favorites.tracks.push(track);
    }

    return true;
  }

  async removeTrack(id: string): Promise<boolean | 'not_found'> {
    const index = favorites.tracks.findIndex((t) => t.id === id);

    if (index === -1) {
      return 'not_found';
    }

    favorites.tracks.splice(index, 1);
    return true;
  }

  async addAlbum(id: string): Promise<boolean | 'unprocessable'> {
    const album = albums.find((a) => a.id === id);

    if (!album) {
      return 'unprocessable';
    }

    if (favorites.albums.some((a) => a.id === album.id)) {
      return true;
    }

    favorites.albums.push(album);

    return true;
  }

  async removeAlbum(id: string): Promise<boolean | 'not_found'> {
    const index = favorites.albums.findIndex((a) => a.id === id);

    if (index === -1) {
      return 'not_found';
    }

    favorites.albums.splice(index, 1);
    return true;
  }

  async addArtist(id: string): Promise<boolean | 'unprocessable'> {
    const artist = artists.find((a) => a.id === id);

    if (!artist) {
      return 'unprocessable';
    }

    if (favorites.artists.some((a) => a.id === artist.id)) {
      return true;
    }

    favorites.artists.push(artist);

    return true;
  }

  async removeArtist(id: string): Promise<boolean | 'not_found'> {
    const index = favorites.artists.findIndex((a) => a.id === id);

    if (index === -1) {
      return 'not_found';
    }

    favorites.artists.splice(index, 1);
    return true;
  }

  @OnEvent('artist.deleted')
  handleArtistDeleted(id: string) {
    favorites.artists = favorites.artists.filter((a) => a.id !== id);
  }

  @OnEvent('album.deleted')
  handleAlbumDeleted(id: string) {
    favorites.albums = favorites.albums.filter((a) => a.id !== id);
  }

  @OnEvent('track.deleted')
  handleTrackDeleted(id: string) {
    favorites.tracks = favorites.tracks.filter((t) => t.id !== id);
  }
}
