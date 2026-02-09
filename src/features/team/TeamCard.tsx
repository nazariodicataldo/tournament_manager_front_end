import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Ellipsis, Users } from "lucide-react";
import type { Team } from "./team.type";
import { DynamicIcon } from "lucide-react/dynamic";
import DeleteDialog from "@/components/DeleteDialog";
import { useDialogContext } from "@/contexts/DialogContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TeamService } from "./team.service";
import UpdateDialog from "@/components/UpdateDialog";
import TeamForm from "./TeamForm";

const TeamCard = ({ item }: { item: Team }) => {
  const DialogContext = useDialogContext();
  const { setOpenDialog, setMessage /* setOpenForm  */ } = DialogContext;

  const queryClient = useQueryClient();

  //Mutation per eliminare un torneo
  const { mutate: deleteTeam, isPending: isDeleting } = useMutation({
    mutationFn: TeamService.delete, //funzione che chiama l'endpoint per eliminare un torneo
    onSettled: () => {
      //qualunque sia l'esito della mutation, mostro la dialog di messaggio e chiudo il form
      /* setOpenForm(false); */
      setOpenDialog(true);
    },
    onError: (error: Error) => {
      setMessage(error.message);
    },
    onSuccess: () => {
      setMessage("Squadra eliminata con successo!");
      queryClient.invalidateQueries({
        //invalidazione della query delle squadre per rifetchare la lista aggiornata dopo l'eliminazione di una squadra
        queryKey: ["teams"],
      });
    },
  });

  //Mutation per aggiornare un torneo
  const { mutate: updateTeam, isPending: isUpdating } = useMutation({
    mutationFn: TeamService.update, //funzione che chiama l'endpoint per aggiornare un torneo
    onError: (error: Error) => {
      setMessage(error.message);
      setOpenDialog(true);
    },
    onSuccess: () => {
      setMessage("Squadra aggiornata con successo!");
      /* setOpenForm(false); */
      setOpenDialog(true);
      queryClient.invalidateQueries({
        //invalidazione della query delle squadre per rifetchare la lista aggiornata dopo l'aggiornamento di una squadra
        queryKey: ["teams"],
      });
    },
  });

  return (
    <Card
      key={item.id}
      style={{
        borderColor: item.color + "20",
        backgroundColor: item.color + "10",
      }}
      className="w-full max-w-sm border gap-4 relative "
    >
      <CardHeader className="flex justify-between">
        <CardTitle className="flex items-center gap-4">
          {item.icon && <DynamicIcon name={item.icon} size={48} />}
          <Link
            to={`/teams/${item.id}`}
            className="after:absolute after:inset-0"
          >
            <h2 className="text-xl font-medium">{item.name}</h2>
          </Link>
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
              text={"Modifica"}
              children={
                <TeamForm
                  isPending={isUpdating}
                  mutate={({ data }) => updateTeam({ id: item.id, data })}
                  defaultValues={item}
                />
              }
            />
            {/* Dialog per l'eliminazione */}
            <DeleteDialog
              isPending={isDeleting}
              mutate={deleteTeam}
              id={item.id}
            />
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardFooter>
        <p className="flex text-[16px] w-full pt-3 text-neutral-500 items-center gap-1 border-t border-b-neutral-500">
          <Users size={20} /> {item.players?.length} giocatori
        </p>
      </CardFooter>
    </Card>
  );
};

export default TeamCard;
