import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TeamService } from "../team/team.service";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { capitalizeFirstLetter } from "@/lib/utils";

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
    .number({ error: "Devi selezionare un numero di maglia valido" })
    .min(1, {message: "Il numero minimo è 1"})
    .max(99, {message: "Il numero massimo è 99"})
    .optional(),
  /*     .min(1, "Il numero deve essere almeno 1")
    .max(99, "Il numero non può superare 99"), */
  teamId: z.number().optional(),
});

/* Mi creo il tipo dato dallo schema di validazione */
export type PlayerFormType = z.infer<typeof schema>;

//Ruoli disponibili
const roles = [
  { value: "portiere", label: "Portiere" },
  { value: "difensore", label: "Difensore" },
  { value: "centrocampista", label: "Centrocampista" },
  { value: "attaccante", label: "Attaccante" },
];

//Tipo delle props del componente
type PlayerFormProps = {
  mutate: ({
    data,
    id,
  }: {
    data: Omit<PlayerFormType, "id">;
    id?: number;
  }) => void;
  isPending?: boolean;
  defaultValues?: PlayerFormType & { id: number };
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
    setValue,
    watch,
    formState: { errors },
  } = useForm<PlayerFormType>({
    resolver: zodResolver(schema), //collego zod a react hook form
    defaultValues,
  });

  //funzione chiamata alla submit del form, che esegue la mutation per creare un nuovo giocatore
  function handleActionPlayer(data: PlayerFormType) {
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
          <label htmlFor="firstName" className="font-medium flex gap-1">
            Nome
            <span className="text-red-400">*</span>
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
          <label htmlFor="lastName" className="font-medium flex gap-1">
            Cognome
            <span className="text-red-400">*</span>
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
          <label htmlFor="role" className="font-medium flex gap-1">
            Ruolo
            <span className="text-red-400">*</span>
          </label>
          <>
            <Select
              onValueChange={(value) => {
                if (value) {
                  setValue(
                    "role",
                    value as
                      | "portiere"
                      | "difensore"
                      | "centrocampista"
                      | "attaccante",
                  );
                }
              }}
              items={roles}
              id="role"
              defaultValue={defaultValues?.role}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleziona ruolo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </>
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
          <>
            <Select
              onValueChange={(value) => {
                if (value) {
                  setValue("teamId", parseInt(value as string));
                }
              }}
              items={teams.map((team) => ({
                label: team.name,
                value: team.id,
              }))}
              id="team"
              defaultValue={
                teams.find((team) => team.id === defaultValues?.teamId)?.name
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleziona squadra" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {teams
                    .map((team) => ({ label: team.name, value: team.id }))
                    .map((team) => (
                      <SelectItem key={team.value} value={team.value}>
                        {capitalizeFirstLetter(team.label)}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </>
          {errors.teamId && (
            <p className="text-sm text-red-400" aria-live="polite">
              {errors.teamId.message}
            </p>
          )}
        </div>

        {/* Number */}
        {(watch("teamId") || defaultValues?.teamId) && (
          <div className="flex flex-col gap-1">
            <label htmlFor="number" className="font-medium">
              Numero di maglia
            </label>
            <Input
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
        )}

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
