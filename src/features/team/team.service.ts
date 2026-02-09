import { myFetch } from "@/lib/backend";
import {
  ServerTeamToTeam,
  TeamToServerTeam,
  type ServerTeam,
  type Team,
} from "./team.type";
import myEnv from "@/lib/env";

export class TeamService {
  static async list(): Promise<Team[]> {
    const teams = await myFetch<ServerTeam[]>(`${myEnv.backendApiUrl}/teams`);

    return teams.map(ServerTeamToTeam);
  }

  static async get(id: Team["id"]): Promise<Team> {
    const team = await myFetch<ServerTeam>(
      `${myEnv.backendApiUrl}/teams/${id}`,
    );
    return ServerTeamToTeam(team);
  }

  static async create({
    data,
  }: {
    data: Omit<Team, "id" | "updatedAt" | "createdAt" | "players">;
  }): Promise<Team> {
    const team = await myFetch<ServerTeam>(`${myEnv.backendApiUrl}/teams`, {
      method: "POST",
      body: JSON.stringify(TeamToServerTeam(data)),
    });

    return ServerTeamToTeam(team);
  }

  static async update({
    id,
    data,
  }: {
    id: number;
    data: Partial<Omit<Team, "id" | "updatedAt" | "createdAt" | "players">>;
  }): Promise<Team> {
    //Con Partial rendo tutti i campi del tipo opzionali
    const team = await myFetch<ServerTeam>(
      `${myEnv.backendApiUrl}/teams/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(TeamToServerTeam(data)),
      },
    );

    return ServerTeamToTeam(team);
  }

  static async delete(id: Team["id"]): Promise<void> {
    await myFetch<null>(`${myEnv.backendApiUrl}/teams/${id}`, {
      method: "DELETE",
    });
  }
}
