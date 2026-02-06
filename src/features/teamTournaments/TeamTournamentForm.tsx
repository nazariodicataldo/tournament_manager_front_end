import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { useQuery } from "@tanstack/react-query";
import { capitalizeFirstLetter } from "@/lib/utils";
import { TeamTournamentService } from "./teamTournament.service";

/* Mi creo lo scheme della validazione */
const schema = z.object({
  teamId: z.number(),
});

/* Mi creo il tipo dato dallo schema di validazione */
type FormType = z.infer<typeof schema>;

//Tipo delle props del componente
type TeamTournamentFormProps = {
  mutate: ({ tournamentId, teamId }: { teamId: FormType['teamId'], tournamentId: number }) => void;
  isPending?: boolean;
  tournamentId: number;
};

const TeamTournamentForm = ({
  mutate,
  tournamentId,
  isPending,
}: TeamTournamentFormProps) => {
  //Query per prendere tutte le squadre e mostrarle nel select del form
  const { data: teams = [] } = useQuery({
    queryKey: ["free_teems", { id: tournamentId }],
    queryFn: () => TeamTournamentService.free_teams(+tournamentId),
  });

  //Mi prendo le funzioni di react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(schema), //collego zod a react hook form
  });

  //funzione chiamata alla submit del form, che esegue la mutation per creare un nuovo giocatore
  function handleActionTeam(data: FormType) {
    mutate({
      tournamentId: +tournamentId!,
      teamId: data.teamId
    }); //data contiene i valori del form, che vengono passati alla mutation per creare un nuovo giocatore
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleActionTeam)} className="space-y-4">
        <h2 className="text-lg font-medium mb-4">Aggiungi Squadra al Torneo</h2>

        {/* Team */}
        <div className="flex flex-col gap-1">
          <label htmlFor="team" className="font-medium">
            Ruolo
          </label>
          <NativeSelect
            className="w-full"
            id="team"
            {...register("teamId", { valueAsNumber: true })}
          >
            {teams.map((team) => (
              <NativeSelectOption key={team.id} value={team.id}>
                {capitalizeFirstLetter(team.name)}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          {errors.teamId && (
            <p className="text-sm text-red-400" aria-live="polite">
              {errors.teamId.message}
            </p>
          )}
        </div>

        <Button
          disabled={isPending}
          size={"lg"}
          type="submit"
          className="w-full mt-4"
        >
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Aggiungi squadra"
          )}
        </Button>
      </form>
    </>
  );
};
export default TeamTournamentForm;
