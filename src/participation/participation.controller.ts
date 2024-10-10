import { Controller, Post, Body, Res, HttpCode, Get, Query, Delete, Param, Patch, UsePipes, ValidationPipe, BadRequestException, NotFoundException, Put } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';

@Controller()
@ApiTags("Participation")
export class ParticipationController {

  constructor(

  ) {
 
  }

  @Get("getParticipations")
   @ApiQuery({ name: 'season', required: false, type: Number })
   @ApiQuery({ name: 'page', required: false, type: Number })
   @HttpCode(200)
   getParticipations()  {
  
  }

    @Post("addParticipation")
    @UsePipes(new ValidationPipe({ transform: true }))
    @HttpCode(201)
    async addParticipation(@Body() body, @Res() res: Response) {
    
    }

    @Patch("updateParticipation/:id")
    @UsePipes(new ValidationPipe({ transform: true }))
    @HttpCode(200)
    async updateParticipation(@Body() body, @Param("id") id: number, @Res() res: Response) {
    
    }

    @Delete("deleteCharacterFromParticipation/:id")
    @HttpCode(200)
    async deleteCharacterFromParticipation (@Param("id") id:  number, @Res() res: Response) {
   
  }
}