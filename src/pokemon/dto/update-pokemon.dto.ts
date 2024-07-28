import { PartialType } from "@nestjs/mapped-types";
import { CreatePokemonDto } from "./create-pokemon.dto";
import { IsArray } from "class-validator";

export class UpdatePokemonDto extends PartialType(CreatePokemonDto) {
  // @IsArray()
  // moves: string;
}
