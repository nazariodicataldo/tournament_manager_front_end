import {
  ServerGameToGame,
  type Game,
  type ServerGame,
} from "../game/game.type";
import {
  ServerTeamToTeam,
  type ServerTeam,
  type Team,
} from "../team/team.type";

export type Tournament = {
  id: number;
  name: string;
  year: number;
  place: string;
  status?: "draft" | "ready" | "in_progress" | "completed";
  winner?: Team;
  participantsNumber: number;
  createdAt: string;
  updatedAt: string;
};

export type TournamentDashboard = {
  winner?: Team;
  totalGoals?: number;
  count?: number;
  lastGame?: Game;
};

export type ServerTournament = {
  id: number;
  name: string;
  year: number;
  place: string;
  status: "draft" | "ready" | "in_progress" | "completed";
  winner?: ServerTeam;
  participants_number: number;
  created_at: string;
  updated_at: string;
};

export type ServerTournamentDashboard = {
  winner?: ServerTeam;
  total_goals?: number;
  count?: number;
  last_game?: ServerGame;
};

export function ServerTournamentToTournament(
  input: ServerTournament,
): Tournament {
  const { participants_number, created_at, winner, updated_at, ...rest } =
    input;

  return {
    ...rest,
    winner: winner ? ServerTeamToTeam(winner) : undefined,
    participantsNumber: participants_number,
    createdAt: created_at,
    updatedAt: updated_at,
  };
}

export function ServerTournamentDashboardToTournamentDashboard(
  input: ServerTournamentDashboard,
): TournamentDashboard {
  const { winner, total_goals, last_game, ...rest } = input;

  return {
    ...rest,
    winner: winner ? ServerTeamToTeam(winner) : undefined,
    totalGoals: total_goals,
    lastGame: last_game ? ServerGameToGame(last_game) : undefined,
  };
}

export function tournamentToServerTournament(
  input: Partial<Tournament>,
): Partial<Omit<ServerTournament, "id" | "winner">> {
  const { participantsNumber, createdAt, updatedAt, ...rest } = input;

  return {
    ...rest,
    status: input.status ?? "draft",
    participants_number: participantsNumber,
    created_at: createdAt,
    updated_at: updatedAt,
  };
}

export function TournamentDashboardToServerTournamentDashboard(
  input: TournamentDashboard,
): Omit<ServerTournamentDashboard, "winner" | "last_game"> {
  const { totalGoals, ...rest } = input;

  return {
    ...rest,
    total_goals: totalGoals,
  };
}
