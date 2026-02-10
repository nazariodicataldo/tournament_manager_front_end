import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { capitalizeFirstLetter } from "@/lib/utils";
import { TeamTournamentService } from "./teamTournament.service";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* Mi creo lo scheme della validazione */
const schema = z.object({
  teamId: z
    .array(z.number().positive(), {
      error: "Devi selezionare almeno una squadra",
    })
    .min(1, "Devi selezionare almeno una squadra"),
});

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
  const { data: teams = [], isPending: isLoading } = useQuery({
    queryKey: ["free_teems", { id: tournamentId }],
    queryFn: () => TeamTournamentService.free_teams(+tournamentId),
  });

  //Mi prendo le funzioni di react-hook-form
  const {
    handleSubmit,
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
          <Select
            multiple
            onValueChange={(value) => {
              if (value) {
                setValue("teamId", [...value] as number[]);
              }
            }}
            items={teams.map((team) => ({ label: team.name, value: team.id }))}
            id="team"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleziona squadra" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {!isLoading &&
                  teams
                    .map((team) => ({ label: team.name, value: team.id }))
                    .map((team) => (
                      <SelectItem key={team.value} value={team.value}>
                        {capitalizeFirstLetter(team.label)}
                      </SelectItem>
                    ))}
              </SelectGroup>
            </SelectContent>
          </Select>
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
