export class UpdateCharacterDto {
    id?: number;
    name?: string;
    type?: string;
    status?: string;
    sub_category_id?: number;
    species: string;
    episodes?: string[];
}