import { Injectable } from "@nestjs/common";
import { HttpAdapter } from "../interfaces/http-adaptar.interface";
import axios, { AxiosInstance } from "axios";

@Injectable()
export class AxiosAdapter implements HttpAdapter {
  private axios: AxiosInstance = axios;

  async get<T>(url: string): Promise<T> {
    try {
      const { data } = await this.axios.get<T>(url);
      return data;
    } catch (error) {
      throw new Error(`Este es un error-check logs`);
    }
  }
}
