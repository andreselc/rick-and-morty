import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';  
import { CharactersController } from './characters/infrastructure/characters.controller';
import { CharactersModule } from './characters/characters.module';
import { EpisodesController } from './episodes/infrastructure/episodes.controller';
import { EpisodesModule } from './episodes/episodes.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    CharactersModule,
    EpisodesModule

  ],
  controllers: [CharactersController,
    EpisodesController
  ],
  providers: [],
})
export class AppModule {}
