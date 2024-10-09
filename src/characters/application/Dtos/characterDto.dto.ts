import { Injectable } from '@nestjs/common';
import { Expose } from 'class-transformer';

@Injectable()
export class CharacterDto {
  @Expose()
  id: number;

  @Expose()
  name: string ;

  @Expose()
  species: string;

  @Expose()
  status: string;
  
}