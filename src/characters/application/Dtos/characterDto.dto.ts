import { Injectable } from '@nestjs/common';
import { Episode } from '@prisma/client';
import { Expose } from 'class-transformer';

@Injectable()
export class CharacterDto {
  @Expose()
  id: number;

  @Expose()
  name: string ;

  @Expose()
  type: string ;

  @Expose()
  species: string;

  @Expose()
  status: string;

  @Expose()
  episodes: string[];
  
}