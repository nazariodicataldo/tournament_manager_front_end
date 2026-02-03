import { myFetch } from "@/lib/backend";
import { ServerTournamentToTournament, type ServerTournament, type Tournament } from "./tournament.type";
import myEnv from "@/lib/env";

export class TournamentClass {
    static async list(): Promise<Tournament[]> {
    const tournaments = await myFetch<ServerTournament[]>(`${myEnv.backendApiUrl}/tournaments`);

    return tournaments.map(ServerTournamentToTournament);
  }
}