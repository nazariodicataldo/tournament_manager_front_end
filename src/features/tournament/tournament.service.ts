import { myFetch } from "@/lib/backend";
import {
  ServerTournamentToTournament,
  tournamentToServerTournament,
  type ServerTournament,
  type Tournament,
} from "./tournament.type";
import myEnv from "@/lib/env";
import {
  ServerGameToGame,
  type Game,
  type ServerGame,
} from "../game/game.type";

export class TournamentService {
  static async list(): Promise<Tournament[]> {
    const tournaments = await myFetch<ServerTournament[]>(
      `${myEnv.backendApiUrl}/tournaments`,
    );

    return tournaments.map(ServerTournamentToTournament);
  }

  static async get(id: Tournament["id"]): Promise<Tournament> {
    const tournament = await myFetch<ServerTournament>(
      `${myEnv.backendApiUrl}/tournaments/${id}`,
    );
    return ServerTournamentToTournament(tournament);
  }

  static async games(id: Tournament["id"]): Promise<Game[]> {
    const games = await myFetch<ServerGame[]>(
      `${myEnv.backendApiUrl}/tournaments/${id}/games`,
    );

    return games.map(ServerGameToGame);
  }

  static async rounds(id: Tournament["id"]): Promise<{[round: string]: string}[]> {
    const rounds = await myFetch<{[round: string]: string}[]>(
      `${myEnv.backendApiUrl}/tournaments/${id}/rounds`,
    );

    return rounds;
  }

  static async create({
    data,
  }: {
    data: Omit<Tournament, "id" | "createdAt" | "updatedAt">;
  }): Promise<Tournament> {
    console.log(data);
    const tournament = await myFetch<ServerTournament>(
      `${myEnv.backendApiUrl}/tournaments`,
      {
        method: "POST",
        body: JSON.stringify(tournamentToServerTournament(data)),
      },
    );

    return ServerTournamentToTournament(tournament);
  }

  static async update({
    id,
    data,
  }: {
    id: number;
    data: Omit<Partial<Tournament>, "id" | "createdAt" | "updatedAt">;
  }): Promise<Tournament> {
    //Con Partial rendo tutti i campi del tipo opzionali
    const tournament = await myFetch<ServerTournament>(
      `${myEnv.backendApiUrl}/tournaments/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(tournamentToServerTournament(data)),
      },
    );

    return ServerTournamentToTournament(tournament);
  }

  static async delete(id: Tournament["id"]): Promise<void> {
    await myFetch<null>(`${myEnv.backendApiUrl}/tournaments/${id}`, {
      method: "DELETE",
    });
  }
}
