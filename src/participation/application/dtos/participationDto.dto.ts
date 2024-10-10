import { Injectable } from '@nestjs/common';
import { Expose, Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { SeasonDto } from 'src/episodes/application/Dtos/seasonDto.dto';

@Injectable()
export class ParticipationDto {
    @Expose()
    @IsString()
    nameCharacter: string;
  
    @Expose()
    @ValidateNested()
    @Type(() => SeasonDto)
    seasonDetails: SeasonDto;
  }