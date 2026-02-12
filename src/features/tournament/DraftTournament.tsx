import { AnimatedList } from "@/components/ui/animated-list";
import { Button } from "@/components/ui/button";
import { FolderTree, ShieldOff } from "lucide-react";
import type { TeamTournament } from "../teamTournaments/teamTournament.type";
import type { Tournament } from "./tournament.type";

type DraftTournamentProps = {
  tournament: Tournament;
  teamTournament?: TeamTournament[];
  removeTeam: ({
    teamId,
    tournamentId,
  }: {
    teamId: number;
    tournamentId: number;
  }) => void;
  isRemoving: boolean;
  updateStatus: ({
    id,
    data,
  }: {
    id: number;
    data: Omit<Partial<Tournament>, "id" | "createdAt" | "updatedAt">;
  }) => void;
  isUpdating: boolean;
};

const DraftTournament = ({
  tournament,
  teamTournament,
  removeTeam,
  isRemoving,
  updateStatus,
  isUpdating,
}: DraftTournamentProps) => {
  return (
    <div className="w-full">
      <AnimatedList className="mt-4">
        {teamTournament?.reverse().map((t) => (
          <div className="bg-secondary p-4 rounded-lg flex gap-2 items-center justify-between">
            <h3 className="font-semibold">{t.team.name}</h3>
            <Button
              variant={"destructive"}
              disabled={isRemoving}
              onClick={() =>
                removeTeam({
                  teamId: t.teamId,
                  tournamentId: tournament.id,
                })
              }
            >
              <ShieldOff />
              Rimuovi
            </Button>
          </div>
        ))}
      </AnimatedList>

      {/* Pulsante per generare gli abbinamenti tra squadre */}
      {/* di fatto cambio lo status del torneo da draft a ready */}
      <div className="flex justify-end w-full mt-16">
        <Button
          size={"lg"}
          disabled={
            isUpdating || (tournament.participantsNumber > teamTournament!.length)
          }
          onClick={() =>
            updateStatus({
              id: tournament.id,
              data: { status: "ready" },
            })
          }
        >
          <FolderTree />
          Genera abbinamenti
        </Button>
      </div>
    </div>
  );
};

export default DraftTournament;
