import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CharacterToEpisodeDto {
  @Expose()
  @IsNumber()
  characterId: number;

  @Expose()
  @IsNumber()
  episodeId: number;

  @Expose()
  @IsString()
  timeInit: string;

  @Expose()
  @IsString()
  timeFinished: string;
}