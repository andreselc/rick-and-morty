import { SaveAllEpisodesPort } from "../domain/ports/saveAllEpisodes.Port";

export class SaveAllEpisodesApplication implements SaveAllEpisodesPort {
    adapter: SaveAllEpisodesPort;


    constructor(adapter:SaveAllEpisodesPort) {
        this.adapter = adapter;
    }

    async saveAllEpisodes() {
        await this.adapter.saveAllEpisodes();
    }

}