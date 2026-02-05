import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Ellipsis, Shirt } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { capitalizeFirstLetter } from "@/lib/utils";
import type { Player } from "./player.type";
import type { Team } from "../team/team.type";
import DeleteDialog from "@/components/DeleteDialog";
import { PlayerService } from "@/features/player/player.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDialogContext } from "@/contexts/DialogContext";
import UpdateDialog from "@/components/UpdateDialog";
import PlayerForm from "./PlayerForm";

export type PlayerTeam = Player & { team: Team };

const PlayerCard = ({ item }: { item: PlayerTeam }) => {
  const DialogContext = useDialogContext();

  const { setOpenDialog, setMessage, /* setOpenForm  */} = DialogContext;

  const queryClient = useQueryClient();

  //Mutation per eliminare un giocatore
  const { mutate: deletePlayer, isPending: isDeleting } = useMutation({
    mutationFn: PlayerService.delete, //funzione che chiama l'endpoint per eliminare un giocatore
    onSettled: () => {
        //qualunque sia l'esito della mutation, mostro la dialog di messaggio e chiudo il form
        /* setOpenForm(false); */
        setOpenDialog(true);
      },
    onError: (error: Error) => {
      setMessage(error.message);
    },
    onSuccess: () => {
      setMessage("Giocatore eliminato con successo!");
      queryClient.invalidateQueries({
        //invalidazione della query dei giocatori per rifetchare la lista aggiornata dopo l'eliminazione di un giocatore
        queryKey: ["players"],
      });
    },
  });

  //Mutation per aggiornare un giocatore
  const { mutate: updatePlayer, isPending: isUpdating,  } = useMutation({
      mutationFn: PlayerService.update, //funzione che chiama l'endpoint per creare un giocatore
      onError: (error: Error) => {
        setMessage(error.message);
        setOpenDialog(true);
      },
      onSuccess: () => {
        setMessage("Giocatore aggiornato con successo!");
        /* setOpenForm(false); */
        setOpenDialog(true);
        queryClient.invalidateQueries({
          //invalidazione della query dei giocatori per rifetchare la lista aggiornata dopo l'aggiornamento di un giocatore
          queryKey: ["players"],
        });
      },
    });

  return (
    <Card key={item.id} className="w-full max-w-sm border gap-4 relative ">
      <CardHeader className="flex justify-between">
        <CardTitle className="flex items-center gap-4">
          <h2 className="text-xl font-medium">
            {item.firstName} {item.lastName}
          </h2>
        </CardTitle>
        <Popover>
          <PopoverTrigger
            nativeButton={false}
            render={
              <Button variant={"ghost"} className="relative z-10">
                <Ellipsis size={64} />
              </Button>
            }
          />
          <PopoverContent className={"w-40 flex flex-col gap-2"}>
            {/* Dialog per l'aggiornamento */}
            <UpdateDialog
              children={
                <PlayerForm
                  isPending={isUpdating}
                  mutate={(args) => updatePlayer({ ...args, id: item.id })}
                  defaultValues={item}
                />
              }
            />
            {/* Dialog per l'eliminazione */}
            <DeleteDialog isPending={isDeleting} mutate={deletePlayer} id={item.id} />
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent>
        <CardDescription className="flex flex-col gap-2">
          <p className="flex text-lg text-neutral-500 items-center gap-1">
            {capitalizeFirstLetter(item.role)}
          </p>
        </CardDescription>
      </CardContent>
      <CardFooter className="flex">
        <p className="flex items-center text-[16px] w-full pt-3 gap-1 border-t border-b-neutral-500">
          {!item.teamId ? (
            <span className="italic text-neutral-500">Nessun team</span>
          ) : (
            <>
              <DynamicIcon
                name={item.team.icon}
                size={20}
                style={{ color: item.team.color }}
              />
              <span style={{ color: item.team.color }}>{item.team.name}</span>
            </>
          )}
        </p>

        {item.teamId && (
          <p
            style={{ color: item.team.color }}
            className="flex items-center text-[16px] w-full pt-3 gap-1 border-t border-b-neutral-500"
          >
            <Shirt size={20} /> {item.number}
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default PlayerCard;
