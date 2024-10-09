import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { Seed } from "./migrations/infrastructure/seed";
import { createCategory } from "./migrations/infrastructure/Repositories/createCategory";
import { createStatus } from "./migrations/infrastructure/Repositories/createStatus";
import { createStatusType } from "./migrations/infrastructure/Repositories/createStatusType";
import { createSubCategory } from "./migrations/infrastructure/Repositories/createSubCategory";
import { CharacterRepository } from "./characters/infrastructure/Repositories/characterAPIRepository";
import { EpisodesRepository } from "./episodes/infrastructure/Repositories/episodesRepository";
import { createCharactersInEpisodes } from "./migrations/infrastructure/Repositories/createCharactersInEpisodes";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const seeder = new Seed(new createCategory(),
  new createStatus(),
  new createStatusType(),
  new createSubCategory(),
  new CharacterRepository(),
  new EpisodesRepository(),
  new createCharactersInEpisodes());

  await seeder.seed();

  app.setGlobalPrefix("api");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  const config = new DocumentBuilder()
    .setTitle("API Rick y Morty")
    .setDescription("Esta API servirá para gestionar a los personajes y episodios de Rick y Morty")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  await app.listen(parseInt(process.env.PORT) || 3000);
}
bootstrap();
