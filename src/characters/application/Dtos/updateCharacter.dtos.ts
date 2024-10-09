import { Injectable } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { isNumber, IsString } from "class-validator";

export class UpdateCharacterDto {

    @Expose()
    @ApiProperty({ required: false })
    id?: number;

    @IsString()
    @Expose()
    @ApiProperty({ required: false })
    name?: string;

    @IsString()
    @Expose()
    @ApiProperty({ required: false })
    type?: string;

    @IsString()
    @Expose()
    @ApiProperty({ required: false })
    status?: string;

    @Expose()
    @ApiProperty({ required: false })
    sub_category_id?: number;

    @IsString()
    @Expose()
    @ApiProperty({ required: false })
    species: string;

    @Expose()
    @ApiProperty({ required: false })
    episodes?: string[];
}