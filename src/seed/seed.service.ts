import { BadRequestException, Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";
import { PokeResponse } from "./interfaces/poke-api-response.interface";
import { url } from "inspector";
import { InjectModel } from "@nestjs/mongoose";
import { Pokemon } from "src/pokemon/entities/pokemon.entity";
import { Model } from "mongoose";
import { AxiosAdapter } from "../common/adapters/axios-adapter";

@Injectable()
export class SeedService {
  // private readonly axios: AxiosInstance;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ) {}

  async execSeed() {
    await this.pokemonModel.deleteMany({});
    const data = await this.http.get<PokeResponse>(
      "https://pokeapi.co/api/v2/pokemon?limit=650&offset=0"
    );

    /**  op1*/
    // const insertPromeseArray: any[] = [];
    // data.results.forEach(async ({ name, url }) => {
    //   const segments = url.split("/");
    //   console.log(segments[6]);
    //   const no: number = +segments[6];
    //   insertPromeseArray.push(
    //     this.pokemonModel.create({
    //       name: name.toUpperCase(),
    //       no,
    //     })
    //   );
    // });
    // await Promise.all(insertPromeseArray);

    /** op2 */
    const pokemonInsertMany = [];
    data.results.forEach(({ name, url }) => {
      const segments = url.split("/");
      const no: number = +segments[6];
      pokemonInsertMany.push({ no, name: name.toUpperCase() });
    });
    await this.pokemonModel.insertMany(pokemonInsertMany);
    return `see exec`;
  }
}
