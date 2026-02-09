import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Game } from "./game.type";
import { Loader2 } from "lucide-react";

/* Mi creo lo scheme della validazione */
const schema = z
  .object({
    goalA: z
      .number()
      .min(0, "La squadra non può segnare meno di 0 gol")
      .max(10, "La squadra non può segnare più di 10 gol"),
    goalB: z
      .number()
      .min(0, "La squadra non può segnare meno di 0 gol")
      .max(10, "La squadra non può segnare più di 10 gol"),
  })
  .refine((data) => data.goalA !== data.goalB, {
    message: "La partita non può finire in pareggio",
    path: ["goalB"],
  });

/* Mi creo il tipo dato dallo schema di validazione */
type FormType = z.infer<typeof schema>;

//Tipo delle props del componente
type GameFormProps = {
  mutate: ({
    id,
    data,
  }: {
    id: number;
    data: { goalA: number; goalB: number; status: Game["status"] };
  }) => void;
  isPending?: boolean;
  game: Game;
};

const GameForm = ({ mutate, isPending, game }: GameFormProps) => {
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
      id: game.id,
      data: { goalA: +data.goalA, goalB: +data.goalB, status: "played" },
    }); //data contiene i valori del form, che vengono passati alla mutation per creare un nuovo giocatore
  }

  return (
    <form onSubmit={handleSubmit(handleActionTeam)} className="space-y-4">
      <h2 className="text-lg font-medium mb-4">
        Aggiorna il risultato di {game.teamA?.name} {game.teamB?.name}
      </h2>

      {/* Goal squadra A */}
      <div className="flex flex-col gap-1">
        <label htmlFor="goalA" className="font-medium">
          Goal segnati dalla squadra A
        </label>
        <Input
          id="goalA"
          min={0}
          max={10}
          type="number"
          {...register("goalA", { valueAsNumber: true })}
          placeholder="1"
        />
        {errors.goalA && (
          <p className="text-sm text-red-400" aria-live="polite">
            {errors.goalA.message}
          </p>
        )}
      </div>

      {/* Goal squadra B */}
      <div className="flex flex-col gap-1">
        <label htmlFor="goalB" className="font-medium">
          Goal segnati dalla squadra B
        </label>
        <Input
          id="number"
          min={0}
          max={10}
          type="number"
          {...register("goalB", { valueAsNumber: true })}
          placeholder="1"
        />
        {errors.goalB && (
          <p className="text-sm text-red-400" aria-live="polite">
            {errors.goalB.message}
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
          "Aggiorna risultato"
        )}
      </Button>
    </form>
  );
};

export default GameForm;
