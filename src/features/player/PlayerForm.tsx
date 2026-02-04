import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TeamService } from "../team/team.service";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { useQuery } from "@tanstack/react-query";
import { capitalizeFirstLetter } from "@/lib/utils";
import type { Player } from "./player.type";
import { Loader2 } from "lucide-react";

/* Mi creo lo scheme della validazione */
const schema = z.object({
  firstName: z
    .string()
    .min(2, "Il nome deve contenere almeno 2 caratteri")
    .max(30, "Il nome non può superare i 30 caratteri"),
  lastName: z
    .string()
    .min(2, "Il cognome deve contenere almeno 2 caratteri")
    .max(30, "Il cognome non può superare i 30 caratteri"),
  role: z.enum(
    ["portiere", "difensore", "centrocampista", "attaccante"],
    "Ruolo non valido",
  ),
  number: z
    .number("Devi inserire un numero di maglia")
    .min(1, "Il numero deve essere almeno 1")
    .max(99, "Il numero non può superare 99"),
  teamId: z.number().min(1, "Devi selezionare una squadra"),
});

/* Mi creo il tipo dato dallo schema di validazione */
type FormType = z.infer<typeof schema>;

//Ruoli disponibili
const roles = ["portiere", "difensore", "centrocampista", "attaccante"];

//Tipo delle props del componente
type PlayerFormProps = {
  mutate: (args: { data: FormType; id?: number }) => void;
  isPending?: boolean;
  defaultValues?: Player;
};

const PlayerForm = ({ mutate, defaultValues, isPending }: PlayerFormProps) => {
  //Query per prendere tutte le squadre e mostrarle nel select del form
  const { data: teams = [] } = useQuery({
    queryKey: ["teams"],
    queryFn: TeamService.list,
  });

  //Mi prendo le funzioni di react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(schema), //collego zod a react hook form
    defaultValues,
  });

  //funzione chiamata alla submit del form, che esegue la mutation per creare un nuovo giocatore
  function handleActionPlayer(data: FormType) {
    mutate({ data, id: defaultValues?.id }); //data contiene i valori del form, che vengono passati alla mutation per creare un nuovo giocatore
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleActionPlayer)} className="space-y-4">
        <h2 className="text-lg font-medium mb-4">
          {defaultValues ? "Aggiorna Giocatore" : "Crea Nuovo Giocatore"}
        </h2>

        {/* First name */}
        <div className="flex flex-col gap-1">
          <label htmlFor="firstName" className="font-medium">
            Nome
          </label>
          <Input
            id="firstName"
            {...register("firstName")}
            placeholder="Mario"
          />
          {errors.firstName && (
            <p className="text-sm text-red-400" aria-live="polite">
              {errors.firstName.message}
            </p>
          )}
        </div>

        {/* Last name */}
        <div className="flex flex-col gap-1">
          <label htmlFor="lastName" className="font-medium">
            Cognome
          </label>
          <Input id="lastName" {...register("lastName")} placeholder="Rossi" />
          {errors.lastName && (
            <p className="text-sm text-red-400" aria-live="polite">
              {errors.lastName.message}
            </p>
          )}
        </div>

        {/* Role */}
        <div className="flex flex-col gap-1">
          <label htmlFor="role" className="font-medium">
            Ruolo
          </label>
          <NativeSelect className="w-full" id="role" {...register("role")}>
            {roles.map((role) => (
              <NativeSelectOption key={role} value={role}>
                {capitalizeFirstLetter(role)}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          {errors.role && (
            <p className="text-sm text-red-400" aria-live="polite">
              {errors.role.message}
            </p>
          )}
        </div>

        {/* Teams */}
        <div className="flex flex-col gap-1">
          <label htmlFor="teamId" className="font-medium">
            Squadra
          </label>
          <NativeSelect
            className="w-full"
            id="teamId"
            {...register("teamId", { valueAsNumber: true })}
          >
            <NativeSelectOption value={0}>Seleziona squadra</NativeSelectOption>
            {teams.map((team) => (
              <NativeSelectOption key={team.id} value={team.id}>
                {team.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          {errors.teamId && (
            <p className="text-sm text-red-400" aria-live="polite">
              {errors.teamId.message}
            </p>
          )}
        </div>

        {/* Number */}
        <div className="flex flex-col gap-1">
          <label htmlFor="number" className="font-medium">
            Numero di maglia
          </label>
          <Input
            min={1}
            max={99}
            type="number"
            id="number"
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
          ) : defaultValues ? (
            "Aggiorna Giocatore"
          ) : (
            "Crea Giocatore"
          )}
        </Button>
      </form>
    </>
  );
};
export default PlayerForm;
