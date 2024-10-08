import { SaveAllSeasonsPort } from "../domain/ports/saveAllSeasonsPort";

export class SaveAllSeasonsApplication implements SaveAllSeasonsPort {
    adapter: SaveAllSeasonsPort;


    constructor(adapter:SaveAllSeasonsPort) {
        this.adapter = adapter;
    }

    async saveAllSeasons() {
        await this.adapter.saveAllSeasons();
    }

}