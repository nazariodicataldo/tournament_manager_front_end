import { ServerTeamToTeam, type ServerTeam, type Team } from "../team/team.type";

export type Game = {
  id: number;
  start?: string;
  round: "ottavi" | "quarti" | "semifinale" | "finale";
  status?: "waiting" | "ready" | "played";
  teamAId?: number;
  teamA?: Team;
  teamBId?: number;
  teamB?: Team;
  goalA?: number;
  goalB?: number;
  nextGameId?: number;
  winnerId?: number;
  winner?: Team;
  tournamentId?: number;
  createdAt: string;
  updatedAt: string;
};

export type ServerGame = {
  id: number;
  start?: string;
  round: "ottavi" | "quarti" | "semifinale" | "finale";
  status: "waiting" | "ready" | "played"; //di default è 'waiting'
  team_a_id?: number;
  team_a?: ServerTeam;
  team_b_id?: number;
  team_b?: ServerTeam;
  goal_a?: number;
  goal_b?: number;
  next_game_id?: number;
  winner_id?: number;
  winner?: ServerTeam;
  tournament_id?: number;
  created_at: string;
  updated_at: string;
};

export function ServerGameToGame(input: ServerGame): Game {
  const {
    team_a_id,
    team_a,
    team_b_id,
    team_b,
    goal_a,
    goal_b,
    winner_id,
    winner,
    next_game_id,
    tournament_id,
    created_at,
    updated_at,
    ...rest
  } = input;

  return {
    ...rest,
    teamAId: team_a_id,
    teamA: team_a ? ServerTeamToTeam(team_a) : undefined,
    teamBId: team_b_id,
    teamB: team_b ? ServerTeamToTeam(team_b) : undefined,
    goalA: goal_a,
    goalB: goal_b,
    winnerId: winner_id,
    winner: winner ? ServerTeamToTeam(winner) : undefined,
    nextGameId: next_game_id,
    tournamentId: tournament_id,
    createdAt: created_at,
    updatedAt: updated_at,
  };
}

export function GameToServerGame(
  input: Partial<Game>,
): Partial<Omit<ServerGame, "id" | "team_a" | "team_b" | "winner">> {
  const {
    teamAId,
    teamBId,
    goalA,
    goalB,
    winnerId,
    nextGameId,
    tournamentId,
    createdAt,
    updatedAt,
    ...rest
  } = input;

  return {
    ...rest,
    status: rest.status ?? "waiting",
    team_a_id: teamAId,
    team_b_id: teamBId,
    goal_a: goalA,
    goal_b: goalB,
    winner_id: winnerId,
    next_game_id: nextGameId,
    tournament_id: tournamentId,
    created_at: createdAt,
    updated_at: updatedAt,
  };
}
