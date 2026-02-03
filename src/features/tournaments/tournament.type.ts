export type Tournament = {
  id: number;
  name: string;
  year: number;
  place: string;
  status: "draft" | "ready" | "in_progress" | "completed";
  participantsNumber: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export type ServerTournament = {
  id: number;
  name: string;
  year: number;
  place: string;
  status: "draft" | "ready" | "in_progress" | "completed";
  participants_number: number;
  description: string;
  created_at: string;
  updated_at: string;
};

export function ServerTournamentToTournament(
  input: ServerTournament,
): Tournament {
  const { participants_number, created_at, updated_at, ...rest } = input;

  return {
    ...rest,
    participantsNumber: participants_number,
    createdAt: created_at,
    updatedAt: updated_at,
  };
}

export function tournamentToServerTournament(
  input: Partial<Tournament>,
): Partial<Omit<ServerTournament, "id">> {
  //Se non ti passo la I, prendi Map come tipo
  const { participantsNumber, createdAt, updatedAt, ...rest } = input;

  return {
    ...rest,
    participants_number: participantsNumber,
    created_at: createdAt,
    updated_at: updatedAt,
  };
}
