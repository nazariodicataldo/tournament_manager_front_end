import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PlayerService } from "../player/player.service";
import { capitalizeFirstLetter } from "@/lib/utils";
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
  playerId: z.number().min(1, "Devi selezionare un giocatore"),
  number: z
    .number("Devi inserire un numero di maglia")
    .min(1, "Il numero deve essere almeno 1")
    .max(99, "Il numero non può superare 99"),
});

/* Mi creo il tipo dato dallo schema di validazione */
type FormType = z.infer<typeof schema>;

export type MutationArgs = {
  data: Omit<FormType, "playerId"> & { teamId: number };
  id?: number;
};

//Tipo delle props del componente
type TeamFormProps = {
  mutate: (args: MutationArgs) => void;
  isPending?: boolean;
  teamId: number;
};

const PlayerTeamForm = ({ mutate, isPending, teamId }: TeamFormProps) => {
  //Mi prendo le funzioni di react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(schema), //collego zod a react hook form
  });

  //Query per prendere i dati del team specifico
  const { data: players = [], isPending: isLoading } = useQuery({
    queryKey: ["player_team", { id: +teamId! }],
    queryFn: () => PlayerService.free_agents(),
  });

  //funzione chiamata alla submit del form, che esegue la mutation per creare un nuovo giocatore
  function handleActionTeam(data: FormType) {
    mutate({
      id: data.playerId,
      data: { teamId: +teamId, number: data.number },
    }); //data contiene i valori del form, che vengono passati alla mutation per creare un nuovo giocatore
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleActionTeam)} className="space-y-4">
        <h2 className="text-lg font-medium mb-4">
          Aggiungi Giocatore alla Squadra
        </h2>

        {/* Players */}
        <div className="flex flex-col gap-1">
          <label htmlFor="playerId" className="font-medium flex gap-1">
            Giocatore
            <span className="text-red-400">*</span>
          </label>
          <Select
            onValueChange={(value) => {
              if (value) {
                setValue("playerId", parseInt(value as string));
              }
            }}
            items={players.map((player) => ({
              label: `${player.firstName} ${player.lastName}`,
              value: player.id,
            }))}
            id="team"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleziona giocatore" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {!isLoading &&
                  players
                    .map((player) => ({
                      label: `${player.firstName} ${player.lastName}`,
                      value: player.id,
                    }))
                    .map((player) => (
                      <SelectItem key={player.value} value={player.value}>
                        {capitalizeFirstLetter(player.label)}
                      </SelectItem>
                    ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {errors.playerId && (
            <p className="text-sm text-red-400" aria-live="polite">
              {errors.playerId.message}
            </p>
          )}
        </div>

        {/* Number */}
        <div className="flex flex-col gap-1">
          <label htmlFor="number" className="font-medium flex gap-1">
            Numero di maglia
            <span className="text-red-400">*</span>
          </label>
          <Input
            id="number"
            min={1}
            max={99}
            type="number"
            {...register("number", { valueAsNumber: true })}
            placeholder="1"
          />
          {errors.number && (
            <p className="text-sm text-red-400" aria-live="polite">
              {errors.number.message}
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
            "Aggiungi Giocatore"
          )}
        </Button>
      </form>
    </>
  );
};
export default PlayerTeamForm;
