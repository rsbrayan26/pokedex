import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreatePokemonDto } from "./dto/create-pokemon.dto";
import { UpdatePokemonDto } from "./dto/update-pokemon.dto";
import { Pokemon } from "./entities/pokemon.entity";
import { isValidObjectId, Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class PokemonService {
  /**
   *
   */
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleUpperCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleException(error);
    }
  }

  findAll() {
    return this.pokemonModel.find();
  }

  async findOne(searchPokemon: string) {
    let pokemon: Pokemon;

    if (!isNaN(+searchPokemon)) {
      pokemon = await this.pokemonModel.findOne({ no: searchPokemon });
    }

    if (!pokemon && isValidObjectId(searchPokemon)) {
      pokemon = await this.pokemonModel.findById(searchPokemon);
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: searchPokemon.toLocaleUpperCase().trim(),
      });
    }

    if (!pokemon) {
      throw new NotFoundException(`Pokemon con nombre o id no se encuentra`);
    }
    // return `This action returns a #${id} pokemon`;
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.pokemonModel.findOne({ name: term });
    if (!pokemon)
      throw new NotFoundException(
        `Pokémon con el nombre ${term} no encontrado`
      );
    // console.log(pokemon);

    const existName = await this.pokemonModel.findOne({
      name: updatePokemonDto.name,
      _id: { $ne: pokemon.id },
    });
    if (existName)
      throw new BadRequestException(
        `Ya existe un pokemoncon el nombre ${updatePokemonDto.name}`
      );

    const existNo = await this.pokemonModel.findOne({
      no: updatePokemonDto.no,
      _id: { $ne: pokemon.id },
    });
    if (existNo)
      throw new BadRequestException(
        `Ya existe un pokemon con el numero ${updatePokemonDto.no}`
      );

    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLocaleUpperCase();
    }

    try {
      await pokemon.updateOne(updatePokemonDto, { new: true });
      return {
        message: `Pokémon actualizado correctamente`,
        pokemon: updatePokemonDto,
      };
    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(id: string) {
    // try {
    //   const pokemon = await this.pokemonModel.findById(id);
    //   await pokemon.deleteOne();
    //   return { message: `Pokemon ${pokemon.name} eliminado` };
    // } catch (error) {
    //   this.handleException(error);
    // }
    const { deletedCount, acknowledged } = await this.pokemonModel.deleteOne({
      _id: id,
    });
    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon con id ${id} no encontrado`);
    }

    return { message: `Pokemon eliminado` };
  }

  private handleException(error: any) {
    if (error.code === 11000)
      throw new BadRequestException(
        `Pokemon exists in DB ${JSON.stringify(error.keyValue)}`
      );
    console.log(error);
    throw new InternalServerErrorException(`Check server logs`);
  }
}
