import { Injectable } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { isNumber, IsOptional, IsString } from "class-validator";

export class UpdateCharacterDto {

    @ApiProperty()
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    type?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    status?: string;
  
    @ApiProperty()
    @IsOptional()
    @IsString()
    species?: string;
}