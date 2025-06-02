import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  artistId?: string;

  @IsString()
  @IsOptional()
  albumId?: string;

  @IsNumber()
  @IsNotEmpty()
  duration: number;
}
