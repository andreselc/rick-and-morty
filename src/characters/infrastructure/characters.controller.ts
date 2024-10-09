import { Controller, Post, Body, Res, HttpCode, Get, Query, Delete, Param, Patch, UsePipes, ValidationPipe, BadRequestException, NotFoundException, Put } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { GetAllCharacters } from './../../characters/application/getAllCharacters.application';
import { KillACharacter } from './../../characters/application/killACharacter.application';
import { CharacterRepositoryMethods } from '../../characters/infrastructure/Repositories/characterRepositoryMethods';
import { CreateCharacterDto } from './../../characters/application/Dtos/createCharacter.dto';
import { CharacterDto } from './../../characters/application/Dtos/characterDto.dto';
import { UpdateCharacterDto } from '../application/Dtos/updateCharacter.dtos';

@Controller()
@ApiTags("Characters")
export class CharactersController {

  constructor(
    private getAllCharacters: GetAllCharacters,
    private killACharacter: KillACharacter,
    private charactersRepository: CharacterRepositoryMethods,
  ) {
    this.charactersRepository = new CharacterRepositoryMethods();
    this.killACharacter = new KillACharacter(this.charactersRepository);
  }

  @Get("getAllCharacters")
   @ApiQuery({ name: 'type', required: false, type: String })
   @ApiQuery({ name: 'species', required: false, type: String })
   @ApiQuery({ name: 'page', required: false, type: Number })
   @HttpCode(200)
   findAllCharacters(
    @Query('type') type?: string,
    @Query('species') species?: string,
    @Query('page') page: number = 1,
   ) :Promise<CharacterDto[]> {
    return this.getAllCharacters.getCharacters({ type, species }, page );
  }

  @Post("addCharacter")
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(201)
  async addCharacter(@Body() body: CreateCharacterDto, @Res() res: Response) {
    try {
      const prisma = new PrismaClient();
      const speciesValidation = await prisma.sub_Category.findFirst({
        where: { name: body.species },
      });

      if (!speciesValidation) {
        throw new NotFoundException('Species not found');
      }

      const statusValidation = await prisma.status.findFirst({
        where: { name: body.status },
      });

      if (!statusValidation) {
        throw new NotFoundException('Status not found');
      }

      const characterValidation = await prisma.character.findFirst({
        where: { name: body.name, type: body.type, sub_category_id: speciesValidation.id, status_id: statusValidation.id },
      });

      let key = -1;
      if (characterValidation) {
        key = characterValidation.id;
      }

      const character = await this.charactersRepository.create(key, body);;
      return res.status(201).json({
        statusCode: 201,
        message: 'Character created successfully',
        data: character,
      });
    } catch (error) {
      throw new BadRequestException(`Something went wrong: ${error.message}`);
    }
  }

  @Put("/:id")
  updateUser() {
   
  }


  @Patch("updatePartially/:id")
  @UsePipes(new ValidationPipe ({ transform: true}))
  @HttpCode(200)
  @ApiBody({ type: UpdateCharacterDto })
  async updatePartiallyACharacter(@Body() body: UpdateCharacterDto, @Param("id") id: number,@Res() res: Response) {
      try {
        const prisma = new PrismaClient();
        const character = await prisma.character.findUnique({ where: { id } });

        if (!character) {
          throw new NotFoundException('Character not found');
        }

        if (body.name) {
          const nameValidation = await prisma.character.findFirst({
            where: { name: body.name, id: { not: id } },
          });

          if (nameValidation) {
            throw new BadRequestException('Character name already exists');
          }
        }

        if (body.species) {
          const speciesValidation = await prisma.sub_Category.findFirst({
            where: { name: body.species },
          });

          if (!speciesValidation) {
            throw new NotFoundException('Species not found');
          }

          body.sub_category_id = speciesValidation.id;
        }

        await this.charactersRepository.update(body);
        return res.status(200).json({
          statusCode: 200,
          message: 'Character updated successfully',
          data: body,
        });
      } catch (error) {
        throw new BadRequestException(`Something went wrong: ${error.message}`);
      }
  }


  @Delete("suspendCharacter/:id")
  @HttpCode(200)
  async suspendCharacter(@Param("id") id: number, @Res() res: Response) {
    if (typeof id !== 'number' || id < 1 || id > 2147483647) {
      throw new BadRequestException(`Invalid ID: ${id}`);
    }

    try {
      await this.killACharacter.execute(id);
      return res.status(200).json({
        statusCode: 200,
        message: `Character with ID ${id} has been suspended`,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`Character with ID ${id} not found`);
      }
      throw error;
    }
  }
}