import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
/* import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"; */
import type { Tournament } from "./tournament.type";
import { Loader2 } from "lucide-react";

/* Mi creo lo scheme della validazione */
const schema = z.object({
  name: z
    .string()
    .min(2, "Il nome deve contenere almeno 2 caratteri")
    .max(30, "Il nome non può superare i 30 caratteri"),
  year: z
    .number("L'anno deve essere un numero")
    .min(1900, "L'anno deve essere maggiore di 1900")
    .max(2100, "L'anno non può superare 2100"),
  place: z
    .string()
    .min(2, "Il luogo deve contenere almeno 2 caratteri")
    .max(40, "Il luogo non può superare i 40 caratteri"),
  /* status: z
    .enum(["draft", "ready", "in_progress", "completed"], "Stato non valido")
    .optional(), */
  participantsNumber: z
    .number("Devi inserire un numero di maglia")
    .min(2, "Il numero deve essere almeno 2")
    .max(16, "Il numero non può superare 16"),
});

/* Mi creo il tipo dato dallo schema di validazione */
type FormType = z.infer<typeof schema>;

//Ruoli disponibili
/* const status = [
  {
    text: "Bozza",
    value: "draft",
  },
  { text: "Pronto", value: "ready" },
  { text: "In Corso", value: "in_progress" },
  { text: "Completato", value: "completed" },
]; */

//Tipo delle props del componente
type TournamentFormProps = {
  mutate: (args: { data: FormType; id?: number }) => void;
  isPending?: boolean;
  defaultValues?: Tournament;
};

const TournamentForm = ({
  mutate,
  defaultValues,
  isPending,
}: TournamentFormProps) => {
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
  function handleActionTournament(data: FormType) {
    mutate({ data, id: defaultValues?.id }); //data contiene i valori del form, che vengono passati alla mutation per creare un nuovo giocatore
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(handleActionTournament)}
        className="space-y-4"
      >
        <h2 className="text-lg font-medium mb-4">
          {defaultValues ? "Aggiorna Torneo" : "Crea Nuovo Torneo"}
        </h2>

        {/* Name */}
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="font-medium">
            Nome del torneo
          </label>
          <Input id="name" {...register("name")} placeholder="Coppa Italia" />
          {errors.name && (
            <p className="text-sm text-red-400" aria-live="polite">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Year */}
        <div className="flex flex-col gap-1">
          <label htmlFor="year" className="font-medium">
            Anno di inizio
          </label>
          <Input
            type="number"
            id="year"
            {...register("year", { valueAsNumber: true })}
            placeholder="2026"
          />
          {errors.year && (
            <p className="text-sm text-red-400" aria-live="polite">
              {errors.year.message}
            </p>
          )}
        </div>

        {/* Place */}
        <div className="flex flex-col gap-1">
          <label htmlFor="place" className="font-medium">
            Località del torneo
          </label>
          <Input id="place" {...register("place")} placeholder="Roma" />
          {errors.place && (
            <p className="text-sm text-red-400" aria-live="polite">
              {errors.place.message}
            </p>
          )}
        </div>

        {/* Status */}
        {/* {defaultValues && ( //Stato non modificabile in fase di creazione, ma solo in fase di aggiornamento
          <div className="flex flex-col gap-1">
            <label htmlFor="status" className="font-medium">
              Stato del torneo
            </label>
            <NativeSelect
              className="w-full"
              id="status"
              {...register("status")}
            >
              {status.map((status) => (
                <NativeSelectOption key={status.value} value={status.value}>
                  {status.text}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            {errors.status && (
              <p className="text-sm text-red-400" aria-live="polite">
                {errors.status.message}
              </p>
            )}
          </div>
        )} */}

        {/* Participants Number */}
        <div className="flex flex-col gap-1">
          <label htmlFor="participantsNumber" className="font-medium">
            Numero di partecipanti
          </label>
          <Input
            min={1}
            max={99}
            type="number"
            id="participantsNumber"
            {...register("participantsNumber", { valueAsNumber: true })}
            placeholder="1"
          />
          {errors.participantsNumber && (
            <p className="text-sm text-red-400" aria-live="polite">
              {errors.participantsNumber.message}
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
            "Aggiorna Torneo"
          ) : (
            "Crea Torneo"
          )}
        </Button>
      </form>
    </>
  );
};
export default TournamentForm;
