import { Expose } from 'class-transformer';

export class CreateEpisodeDto {
  @Expose()
  name: string;

  @Expose()
  duration: number;

  @Expose()
  sub_category_id: number;

  @Expose()
  status_id: number;
}