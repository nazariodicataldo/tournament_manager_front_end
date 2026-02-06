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
  players: Player[]; //opzionale perché quando creo una squadra non passo i giocatori
  createdAt: string;
  updatedAt: string;
};

export type ServerTeam = {
  id: number;
  name: string;
  icon: IconName;
  color: string;
  players: ServerPlayer[]; //opzionale perchè una squadra potrebbe non avere giocatori e tornare dall'API senza giocatori
  created_at: string;
  updated_at: string;
};

export function ServerTeamToTeam(input: ServerTeam): Team {
  const { created_at, updated_at, players, ...rest } = input;

  const players_mapped = players?.map(ServerPlayerToPlayer);

  return {
    ...rest,
    players: players_mapped ?? [],
    createdAt: created_at,
    updatedAt: updated_at,
  };
}

export function TeamToServerTeam(
  input: Partial<Team>,
): Partial<Omit<ServerTeam, "id" | "players">> {
  const { createdAt, updatedAt, ...rest } = input;

  return {
    ...rest,
    created_at: createdAt,
    updated_at: updatedAt,
  };
}
