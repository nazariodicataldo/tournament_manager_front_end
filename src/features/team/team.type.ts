import type { IconName } from "lucide-react/dynamic";
import {
  ServerPlayerToPlayer,
  type Player,
  type ServerPlayer,
} from "../player/player.type";

export type Team = {
  id: number;
  name: string;
  icon: IconName;
  color: string;
  players: Player[];
  createdAt: string;
  updatedAt: string;
};

export type ServerTeam = {
  id: number;
  name: string;
  icon: IconName;
  color: string;
  players: ServerPlayer[];
  created_at: string;
  updated_at: string;
};

export function ServerTeamToTeam(input: ServerTeam): Team {
  const { created_at, updated_at, players, ...rest } = input;

  const players_mapped = players.map(ServerPlayerToPlayer);

  return {
    ...rest,
    players: players_mapped,
    createdAt: created_at,
    updatedAt: updated_at,
  };
}

export function TeamToServerTeam(
  input: Partial<Team>,
): Partial<Omit<ServerTeam, "id">> {
  const { createdAt, updatedAt, players, ...rest } = input;

  //Map dell'array di giocatori -> da player a serverPlayer
  const players_mapped = players?.map((player) => {
    const { firstName, lastName, teamId, createdAt, updatedAt, ...rest } = player;

    return {
      ...rest,
      first_name: firstName,
      last_name: lastName,
      team: input,
      team_id: teamId,
      created_at: createdAt,
      updated_at: updatedAt,
    } as ServerPlayer;
  });

  return {
    ...rest,
    players: players_mapped,
    created_at: createdAt,
    updated_at: updatedAt,
  };
}
