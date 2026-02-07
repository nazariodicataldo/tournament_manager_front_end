import { myFetch } from "@/lib/backend";
import {
  ServerGameToGame,
  GameToServerGame,
  type ServerGame,
  type Game,
} from "./game.type";
import myEnv from "@/lib/env";

export class GameService {
  static async list(): Promise<Game[]> {
    const games = await myFetch<ServerGame[]>(
      `${myEnv.backendApiUrl}/games`,
    );

    return games.map(ServerGameToGame);
  }

  static async get(id: Game["id"]): Promise<Game> {
    const game = await myFetch<ServerGame>(
      `${myEnv.backendApiUrl}/games/${id}`,
    );
    return ServerGameToGame(game);
  }

  static async create({
    data,
  }: {
    data: Omit<Game, "id">;
  }): Promise<Game> {
    const game = await myFetch<ServerGame>(
      `${myEnv.backendApiUrl}/games`,
      {
        method: "POST",
        body: JSON.stringify(GameToServerGame(data)),
      },
    );

    return ServerGameToGame(game);
  }

  static async update({
    id,
    data,
  }: {
    id?: number;
    data: Partial<Omit<Game, "id">>;
  }): Promise<Game> {
    //Con Partial rendo tutti i campi del tipo opzionali
    const game = await myFetch<ServerGame>(
      `${myEnv.backendApiUrl}/games/${id!}`,
      {
        method: "PATCH",
        body: JSON.stringify(GameToServerGame(data)),
      },
    );

    return ServerGameToGame(game);
  }

  static async delete(id: Game["id"]): Promise<void> {
    await myFetch<null>(`${myEnv.backendApiUrl}/games/${id}`, {
      method: "DELETE",
    });
  }
}
