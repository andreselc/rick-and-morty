import { Expose } from 'class-transformer';

export class CreateCharacterDto {
  @Expose()
  name: string;

  @Expose()
  sub_category_id: number;

  @Expose()
  status_id: number;
  
}