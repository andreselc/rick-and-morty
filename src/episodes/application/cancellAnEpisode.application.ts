import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IRepositoryEpisode } from "../domain/ports/IRepositoryEpisode";

export class CancellAnEpisode {

    constructor(
        private readonly episodeRepository: IRepositoryEpisode) {}

    async execute(episodeId: number): Promise<void> {
        let episode = await this.episodeRepository.findById(episodeId);

        if (!episode) {
            throw new NotFoundException(`Episode with ID ${episodeId} not found`);
        }

        episode.status = 'cancelled';

        await this.episodeRepository.update(episodeId, episode);
    }
}