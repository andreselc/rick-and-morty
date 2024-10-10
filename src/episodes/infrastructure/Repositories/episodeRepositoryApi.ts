import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { CreateEpisodeDto } from "src/episodes/application/Dtos/createEpisode.dto";
import { EpisodeDto } from "src/episodes/application/Dtos/episodeDto.dto";
import { UpdateEpisodeDto } from "src/episodes/application/Dtos/updateEpisode.dto";
import { IRepositoryEpisode } from "src/episodes/domain/ports/IRepositoryEpisode";

export class EpisodesRepositoryMethods implements IRepositoryEpisode {
    prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async create(seasonKey: number , episode: CreateEpisodeDto): Promise<EpisodeDto> {

        const status = await this.prisma.status.findFirst({
        where: { name: episode.status },
        });

        const newEpisode = await this.prisma.episode.create({
            data: {
                name: episode.name,
                duration: episode.duration,
                sub_category_id: seasonKey,
                status_id: status.id,       
                },
                
            });
        let episodeOutput = new EpisodeDto();
        episodeOutput.name = newEpisode.name;
        episodeOutput.duration = newEpisode.duration;
        episodeOutput.status = status.name;
        episodeOutput.season = newEpisode.sub_category_id;

    return episodeOutput;

    }

    async update(id_episode: number, updateData: UpdateEpisodeDto): Promise<void> {
        
        const existingEpisode = await this.prisma.episode.findUnique({
            where: { id: id_episode },
        });

        if (!existingEpisode) {
            throw new NotFoundException("Episode not found.");
        }

        if (updateData.name)
            existingEpisode.name = updateData.name;

        if(updateData.status){
            const status = await this.prisma.status.findFirst({
                where: { name: updateData.status },
            });
        existingEpisode.status_id = status.id;
        }
        if(updateData.season){
            const realSeason = `Season ${updateData.season}`  
            const numberSeason = await this.prisma.sub_Category.findFirst({
                where: { name: realSeason },
            });
            if (!numberSeason) {
                throw new NotFoundException("Season not found.");
            }
            else {
                existingEpisode.sub_category_id = numberSeason.id;
            }
        }

        await this.prisma.episode.update({
            where: { id:existingEpisode.id },
            data: existingEpisode,
        });

}

        async findById(id: number): Promise<EpisodeDto> {
            if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
                return {
                    id: -1,
                    name: "Episode not found",
                    duration: "Episode not found",
                    status: "Episode not found",
                    season: 0,
                    characters: [],
                };
            }
            const episode = await this.prisma.episode.findUnique({
                where: { id },
            });
    
            if (!episode) { 
                return {
                    id: -1,
                    name: "Episode not found",
                    duration: "Episode not found",
                    status: "Episode not found",
                    season: 0,
                    characters: [],
                };
            }
    
            const status = await this.prisma.status.findUnique({
                where: { id: episode.status_id },
            });
    
            //hallar todos los personajes en un episodio
            const characters = await this.prisma.episodeCharacter.findMany({
                where: { episode_id: episode.id },
            });
    
            let charactersArray: string[] = [];
    
            for(let i = 0; i < charactersArray.length; i++) {
                const character = await this.prisma.character.findUnique({
                    where: { id: characters[i].episode_id },
                });

                charactersArray.push(episode.name);
            }
    
            const episodeDto = new EpisodeDto();
            episodeDto.id = episode.id;
            episodeDto.name = episode.name;
            episodeDto.duration = episode.duration;
            episodeDto.characters = charactersArray;
            episodeDto.status = status.name;
    
        return episodeDto;
    }

}