import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCharacterToEpisodeDto {
  @IsOptional()
  @IsNumber()
  timeId?: number;

  @IsNotEmpty()
  @IsString()
  timeInit: string;

  @IsNotEmpty()
  @IsString()
  timeFinished: string;
}