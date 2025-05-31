import { Injectable } from '@nestjs/common';
import { favorites } from './favorites.store';
import { tracks } from 'src/track/track.store';
import { albums } from 'src/album/album.store';
import { artists } from 'src/artist/artist.store';

@Injectable()
export class FavoritesService {
  findAll() {
    return favorites;
  }

  addTrack(id: string): boolean | 'unprocessable' {
    const track = tracks.find((t) => t.id === id);

    if (!track) {
      return 'unprocessable';
    }

    if (favorites.tracks.some((t) => t.id === track.id)) {
      return true;
    }

    favorites.tracks.push(track);

    return true;
  }

  removeTrack(id: string): boolean | 'not_found' {
    const index = favorites.tracks.findIndex((t) => t.id === id);

    if (index === -1) {
      return 'not_found';
    }

    favorites.tracks.splice(index, 1);
    return true;
  }

  addAlbum(id: string): boolean | 'unprocessable' {
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

  removeAlbum(id: string): boolean | 'not_found' {
    const index = favorites.albums.findIndex((a) => a.id === id);

    if (index === -1) {
      return 'not_found';
    }

    favorites.albums.splice(index, 1);
    return true;
  }

  addArtist(id: string): boolean | 'unprocessable' {
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

  removeArtist(id: string): boolean | 'not_found' {
    const index = favorites.artists.findIndex((a) => a.id === id);

    if (index === -1) {
      return 'not_found';
    }

    favorites.artists.splice(index, 1);
    return true;
  }
}
