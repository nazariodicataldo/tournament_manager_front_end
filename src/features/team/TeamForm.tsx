import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Team } from "./team.type";
import { Loader2 } from "lucide-react";
import { DynamicIcon, iconNames, type IconName } from "lucide-react/dynamic";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

/* Mi creo lo scheme della validazione */
const schema = z.object({
  name: z
    .string()
    .min(2, "Il nome deve contenere almeno 2 caratteri")
    .max(30, "Il nome non può superare i 30 caratteri"),
  color: z
    .string("Il colore deve essere una stringa")
    .min(7, "Il colore deve essere specificato")
    .max(7, "Il colore non può superare i 7 caratteri")
    .regex(/^#([0-9A-Fa-f]{6})$/, "Deve essere un codice colore HEX valido"),
  icon: z
    .custom<IconName>()
    .refine(
      (val): val is IconName =>
        iconNames.slice(0, 30).includes(val as IconName),
      {
        message: "Icona non valida",
      },
    ),
});

/* Mi creo il tipo dato dallo schema di validazione */
type FormType = z.infer<typeof schema>;

//Tipo delle props del componente
type TeamFormProps = {
  mutate: (args: { data: FormType; id?: number }) => void;
  isPending?: boolean;
  defaultValues?: Team;
};

const TeamForm = ({ mutate, defaultValues, isPending }: TeamFormProps) => {
  //Mi prendo le funzioni di react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(schema), //collego zod a react hook form
    defaultValues,
  });

  //funzione chiamata alla submit del form, che esegue la mutation per creare un nuovo giocatore
  function handleActionTeam(data: FormType) {
    mutate({
      data: {
        ...data,
        icon: data.icon as IconName,
      },
      id: defaultValues?.id,
    }); //data contiene i valori del form, che vengono passati alla mutation per creare un nuovo giocatore
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleActionTeam)} className="space-y-4">
        <h2 className="text-lg font-medium mb-4">
          {defaultValues ? "Aggiorna Torneo" : "Crea Nuovo Torneo"}
        </h2>

        {/* Name */}
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="font-medium">
            Nome della squadra
          </label>
          <Input id="name" {...register("name")} placeholder="Juventus" />
          {errors.name && (
            <p className="text-sm text-red-400" aria-live="polite">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Color */}
        <div className="flex flex-col gap-1">
          <label htmlFor="color" className="font-medium">
            Colore della squadra
          </label>
          <Input type="color" id="color" {...register("color")} />
          {errors.color && (
            <p className="text-sm text-red-400" aria-live="polite">
              {errors.color.message}
            </p>
          )}
        </div>

        {/* Icon*/}
        <div className="flex flex-col gap-1">
          <label htmlFor="icon" className="font-medium">
            Icona della squadra
          </label>
          <Combobox
            defaultValue={defaultValues?.icon as string}
            defaultInputValue={defaultValues?.icon as string}
            onValueChange={(value) => setValue("icon", value as IconName)}
            items={iconNames.slice(0, 30)}
            id="icon"
            {...register("icon")}
          >
            <ComboboxInput placeholder="Seleziona un'icona" showClear />
            <ComboboxContent>
              <ComboboxEmpty>Icona non trovata</ComboboxEmpty>
              <ComboboxList>
                {iconNames.slice(0, 30).map((iconName) => (
                  <ComboboxItem key={iconName} value={iconName}>
                    <DynamicIcon name={iconName} className="mr-2" /> {iconName}
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          {errors.icon && (
            <p className="text-sm text-red-400" aria-live="polite">
              {errors.icon.message}
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
            "Aggiorna Squadra"
          ) : (
            "Crea Squadra"
          )}
        </Button>
      </form>
    </>
  );
};
export default TeamForm;
