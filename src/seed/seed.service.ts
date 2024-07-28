import { Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";
import { PokeResponse } from "./interfaces/poke-api-response.interface";
import { url } from "inspector";

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance;

  async execSeed() {
    const { data } = await axios.get<PokeResponse>(
      "https://pokeapi.co/api/v2/pokemon?limit=1&offset=0"
    );
    const results = data.results;

    data.results.forEach(({ name, url }) => {
      const segments = url.split("/");
      // console.log({ name, url });
      console.log(segments[6]);
      const no: number = +segments[6];
      console.warn({ name, no });
    });

    return data.results;
  }
}
