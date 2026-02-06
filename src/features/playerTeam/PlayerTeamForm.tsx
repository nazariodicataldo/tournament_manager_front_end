import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
/* import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"; */
import { useQuery } from "@tanstack/react-query";
import { PlayerService } from "../player/player.service";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { capitalizeFirstLetter } from "@/lib/utils";

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
}

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
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(schema), //collego zod a react hook form
  });

  //Query per prendere i dati del team specifico
  const { data: players = [] } = useQuery({
    queryKey: ["player_team", { id: +teamId! }],
    queryFn: () => PlayerService.free_agents(),
  });

  //funzione chiamata alla submit del form, che esegue la mutation per creare un nuovo giocatore
  function handleActionTeam(data: FormType) {
    mutate({id: data.playerId, data: {teamId: +teamId, number: data.number}});  //data contiene i valori del form, che vengono passati alla mutation per creare un nuovo giocatore
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleActionTeam)} className="space-y-4">
        <h2 className="text-lg font-medium mb-4">
          Aggiungi Giocatore alla Squadra
        </h2>

        {/* Players */}
        <div className="flex flex-col gap-1">
          <label htmlFor="playerId" className="font-medium">
            Giocatore
          </label>
          <NativeSelect className="w-full" id="playerId" {...register("playerId", { valueAsNumber: true })}>
            {players.map(player => (
              <NativeSelectOption key={player.id} value={player.id.toString()}>
                {capitalizeFirstLetter(player.firstName)} {capitalizeFirstLetter(player.lastName)}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          {errors.playerId && (
            <p className="text-sm text-red-400" aria-live="polite">
              {errors.playerId.message}
            </p>
          )}
        </div>
        {/* <div className="flex flex-col gap-1">
          <label htmlFor="playerId" className="font-medium">
            Giocatore
          </label>
          <Combobox
            value={"ciao"}
            onValueChange={(val) =>
              val !== null &&
              setValue("playerId", parseInt(val), { shouldDirty: true })
            } //quando cambio il valore del combobox, aggiorno il valore di playerId in react-hook-form con l'id del giocatore selezionato
            items={players.map((p) => ({
              label: `${p.firstName} ${p.lastName}`,
              value: p.id.toString(),
            }))}
            id="playerId"
            {...register("playerId")}
          >
            <ComboboxInput placeholder="Seleziona un giocatore" showClear />
            <ComboboxContent>
              <ComboboxEmpty>Giocatore non trovato</ComboboxEmpty>
              <ComboboxList>
                {(player) => (
                  <ComboboxItem key={player.value} value={player.value}>
                    {player.label}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          {errors.playerId && (
            <p className="text-sm text-red-400" aria-live="polite">
              {errors.playerId.message}
            </p>
          )}
        </div> */}

        {/* Number */}
        <div className="flex flex-col gap-1">
          <label htmlFor="number" className="font-medium">
            Numero di maglia
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
