import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
    .max(2029, "L'anno non può superare 2100"),
  place: z
    .string()
    .min(2, "Il luogo deve contenere almeno 2 caratteri")
    .max(40, "Il luogo non può superare i 40 caratteri"),
  participantsNumber: z
    .number("Devi inserire un numero valido")
    .min(2, "Il numero deve essere almeno 2")
    .max(16, "Il numero non può superare 16"),
});

/* Mi creo il tipo dato dallo schema di validazione */
type FormType = z.infer<typeof schema>;

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
    mutate({
      data: { ...data },
      id: defaultValues?.id,
    }); //data contiene i valori del form, che vengono passati alla mutation per creare un nuovo giocatore
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
          <label htmlFor="name" className="font-medium flex gap-1">
            Nome del torneo
            <span className="text-red-400">*</span>
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
          <label htmlFor="year" className="font-medium flex gap-1">
            Anno di inizio
            <span className="text-red-400">*</span>
          </label>
          <Input
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
          <label htmlFor="place" className="font-medium flex gap-1">
            Località del torneo
            <span className="text-red-400">*</span>
          </label>
          <Input id="place" {...register("place")} placeholder="Roma" />
          {errors.place && (
            <p className="text-sm text-red-400" aria-live="polite">
              {errors.place.message}
            </p>
          )}
        </div>

        {/* Participants Number */}
        {/* Il numero di partecipanti è modificabile solo quando lo status del torneo è in draft */}
        {/* Oppure se i defaultValues non ci sono e quindi sono in fase di create */}
        {(!defaultValues || defaultValues?.status === "draft") && (
          <div className="flex flex-col gap-1">
            <label htmlFor="participantsNumber" className="font-medium flex gap-1">
              Numero di partecipanti
              <span className="text-red-400">*</span>
            </label>
            <Input
              id="participantsNumber"
              {...register("participantsNumber", { valueAsNumber: true })}
              placeholder="2"
            />
            {errors.participantsNumber && (
              <p className="text-sm text-red-400" aria-live="polite">
                {errors.participantsNumber.message}
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
