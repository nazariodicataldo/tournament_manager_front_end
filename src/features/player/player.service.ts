import { myFetch } from "@/lib/backend";
import {
  ServerPlayerToPlayer,
  PlayerToServerPlayer,
  type ServerPlayer,
  type Player,
} from "./player.type";
import myEnv from "@/lib/env";

export class PlayerService {
  static async list(): Promise<Player[]> {
    const players = await myFetch<ServerPlayer[]>(
      `${myEnv.backendApiUrl}/players`,
    );

    return players.map(ServerPlayerToPlayer);
  }

  static async free_agents(): Promise<Player[]> {
    const players = await myFetch<ServerPlayer[]>(
      `${myEnv.backendApiUrl}/players/free_agents`,
    );

    return players.map(ServerPlayerToPlayer);
  }

  static async get(id: Player["id"]): Promise<Player> {
    const player = await myFetch<ServerPlayer>(
      `${myEnv.backendApiUrl}/players/${id}`,
    );
    return ServerPlayerToPlayer(player);
  }

  static async create({
    data,
  }: {
    data: Omit<Player, "id" | "createdAt" | "updatedAt">;
  }): Promise<Player> {
    const player = await myFetch<ServerPlayer>(
      `${myEnv.backendApiUrl}/players`,
      {
        method: "POST",
        body: JSON.stringify(PlayerToServerPlayer(data)),
      },
    );

    return ServerPlayerToPlayer(player);
  }

  static async update({
    id,
    data,
  }: {
    id?: number;
    data: Partial<Omit<Player, "id">>;
  }): Promise<Player> {
    //Con Partial rendo tutti i campi del tipo opzionali
    const player = await myFetch<ServerPlayer>(
      `${myEnv.backendApiUrl}/players/${id!}`,
      {
        method: "PATCH",
        body: JSON.stringify(PlayerToServerPlayer(data)),
      },
    );

    return ServerPlayerToPlayer(player);
  }

  static async delete(id: Player["id"]): Promise<void> {
    await myFetch<null>(`${myEnv.backendApiUrl}/players/${id}`, {
      method: "DELETE",
    });
  }
}
