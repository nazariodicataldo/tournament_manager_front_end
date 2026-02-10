export type Player = {
  id: number;
  firstName: string;
  lastName: string;
  role: "portiere" | "difensore" | "centrocampista" | "attaccante";
  number?: number;
  teamId?: number;
  createdAt: string;
  updatedAt: string;
};

export type ServerPlayer = {
  id: number;
  first_name: string;
  last_name: string;
  role: "portiere" | "difensore" | "centrocampista" | "attaccante";
  number?: number;
  team_id?: number;
  created_at: string;
  updated_at: string;
};

export function ServerPlayerToPlayer(input: ServerPlayer): Player {
  const { first_name, last_name, team_id, created_at, updated_at, ...rest } =
    input;

  return {
    ...rest,
    firstName: first_name,
    lastName: last_name,
    teamId: team_id,
    createdAt: created_at,
    updatedAt: updated_at,
  };
}

export function PlayerToServerPlayer(
  input: Partial<Player>,
): Partial<Omit<ServerPlayer, "id">> {
  const { firstName, lastName, teamId, createdAt, updatedAt, ...rest } = input;

  return {
    ...rest,
    first_name: firstName,
    last_name: lastName,
    team_id: teamId,
    created_at: createdAt,
    updated_at: updatedAt,
  };
}
