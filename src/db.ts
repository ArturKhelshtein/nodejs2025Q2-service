import { Artist } from './artist/entities/artist.entity';
import { Album } from './album/entities/album.entity';
import { Favorite } from './favorites/entities/favorite.entity';
import { Track } from './track/entities/track.entity';
import { User } from './user/entities/user.entity';

export const artists: Artist[] = [];
export const albums: Album[] = [];
export const tracks: Track[] = [];
export const users: User[] = [];
export const favorites: Favorite = {
  tracks: [],
  albums: [],
  artists: [],
};
