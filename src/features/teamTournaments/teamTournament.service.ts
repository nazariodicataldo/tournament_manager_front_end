import { myFetch } from "@/lib/backend";
import myEnv from "@/lib/env";
import {
  ServerTeamTournamentToTeamTournament,
  TeamTournamentToServerTeamTournament,
  type ServerTeamTournament,
  type TeamTournament,
} from "./teamTournament.type";
import { ServerTeamToTeam, type ServerTeam, type Team } from "../team/team.type";

export class TeamTournamentService {
  static async free_teams(
    tournamenId: TeamTournament["tournamentId"],
  ): Promise<Team[]> {
    const teams = await myFetch<ServerTeam[]>(
      `${myEnv.backendApiUrl}/tournaments/${tournamenId}/free_teams`,
    );

    return teams.map(ServerTeamToTeam);
  }

  static async list(id: number): Promise<TeamTournament[]> {
    const teamTournaments = await myFetch<ServerTeamTournament[]>(
      `${myEnv.backendApiUrl}/tournaments/${id}/teams`,
    );

    return teamTournaments.map(ServerTeamTournamentToTeamTournament);
  }

  static async create({
    teamId,
    tournamentId,
  }: {
    teamId: TeamTournament["teamId"];
    tournamentId: TeamTournament["tournamentId"];
  }): Promise<TeamTournament> {
    const teamTournament = await myFetch<ServerTeamTournament>(
      `${myEnv.backendApiUrl}/tournaments/${tournamentId}/teams`,
      {
        method: "POST",
        body: JSON.stringify(
          TeamTournamentToServerTeamTournament({ teamId, tournamentId }),
        ),
      },
    );

    return ServerTeamTournamentToTeamTournament(teamTournament);
  }

  /* static async update({
    data,
  }: {
    data: Omit<Tournament, "id" | "createdAt" | "updatedAt">;
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
  } */

  static async delete({
    teamId,
    tournamentId,
  }: {
    teamId: number;
    tournamentId: number;
  }): Promise<void> {
    await myFetch<null>(
      `${myEnv.backendApiUrl}/tournaments/${tournamentId}/teams/${teamId}`,
      {
        method: "DELETE",
      },
    );
  }
}
