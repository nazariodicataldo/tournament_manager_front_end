import { ServerTeamToTeam, type ServerTeam, type Team } from "../team/team.type";

export type TeamTournament = {
  teamId: number;
  tournamentId: number;
  team: Team;
  createdAt: string;
  updatedAt: string;
};

export type ServerTeamTournament = {
  team_id: number;
  tournament_id: number;
  team: ServerTeam;
  created_at: string;
  updated_at: string;
};

export function ServerTeamTournamentToTeamTournament(
  input: ServerTeamTournament,
): TeamTournament {
  const { team_id, tournament_id, team, created_at, updated_at} = input;

  return {
    teamId: team_id,
    tournamentId: tournament_id,
    team: ServerTeamToTeam(team),
    createdAt: created_at,
    updatedAt: updated_at,
  };
}

export function TeamTournamentToServerTeamTournament(
  input: Partial<TeamTournament>,
): Partial<Omit<ServerTeamTournament, "id" | "team" | "tournament">> {
  const { teamId, tournamentId, createdAt, updatedAt, ...rest } = input;

  return {
    ...rest,
    team_id: teamId,
    tournament_id: tournamentId,
    created_at: createdAt,
    updated_at: updatedAt,
  };
}
