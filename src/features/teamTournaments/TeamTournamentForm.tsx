import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { TeamTournamentService } from "./teamTournament.service";
import { MultiSelectCombobox } from "@/components/MultiSelectCombox";

/* Mi creo lo scheme della validazione */
const schema = z
  .object({
    teamId: z
      .array(z.number().positive(), {
        error: "Array vuoto",
      })
      .min(1, "Devi selezionare almeno una squadra"),
  })

/* Mi creo il tipo dato dallo schema di validazione */
type FormType = z.infer<typeof schema>;

//Tipo delle props del componente
type TeamTournamentFormProps = {
  mutate: ({
    tournamentId,
    teamId,
  }: {
    teamId: number;
    tournamentId: number;
  }) => void;
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
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(schema), //collego zod a react hook form
  });

  //funzione chiamata alla submit del form, che esegue la mutation per creare un nuovo giocatore
  function handleActionTeam(data: FormType) {
    //se l'utente inserisce più squadre, itero sull'array risultante
    data.teamId.forEach((team) => {
      mutate({
        tournamentId: +tournamentId!,
        teamId: team,
      }); //data contiene i valori del form, che vengono passati alla mutation per creare un nuovo giocatore
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleActionTeam)} className="space-y-4">
        <h2 className="text-lg font-medium mb-4">Aggiungi Squadra al Torneo</h2>

        {/* Team */}
        <div className="flex flex-col gap-1">
          <label htmlFor="team" className="font-medium flex gap-1">
            Squadra
            <span className="text-red-400">*</span>
          </label>
          <>
            <MultiSelectCombobox
              teams={teams}
              value={watch("teamId") || []}
              onBlur={(value) =>
                setValue("teamId", value, { shouldValidate: true })
              }
              placeholder="Seleziona squadre..."
              searchPlaceholder="Cerca squadra..."
              className="w-full"
            />
          </>
          {errors.teamId && errors.teamId.message !== "Array vuoto" && (
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
