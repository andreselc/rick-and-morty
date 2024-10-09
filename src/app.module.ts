import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';  
import { CharactersController } from './characters/infrastructure/characters.controller';
import { CharactersModule } from './characters/characters.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    CharactersModule,
  ],
  controllers: [CharactersController],
  providers: [],
})
export class AppModule {}
