import { EpisodeDto } from "src/episodes/application/Dtos/episodeDto.dto";
import { CreateEpisodeDto } from "src/episodes/application/Dtos/createepisode.dto";
import { UpdateEpisodeDto } from "src/episodes/application/Dtos/updateEpisode.dto";

export interface IRepositoryEpisode { 
    create(id: number, episode: CreateEpisodeDto): Promise<EpisodeDto>;
    update(id: number, episode: UpdateEpisodeDto): void;
    findById(id: number): Promise<EpisodeDto>;
}