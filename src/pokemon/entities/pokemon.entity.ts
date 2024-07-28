import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Pokemon extends Document {
  // id:string // mongo lo proporciona
  @Prop({
    unique: true,
    index: true,
  })
  name: string;

  @Prop({
    unique: true,
    index: true,
  })
  no: number;

  @Prop({})
  moves: string[];
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
