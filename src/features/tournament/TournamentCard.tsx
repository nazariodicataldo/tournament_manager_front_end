import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Ban,
  Calendar,
  Check,
  Ellipsis,
  MapPin,
  Play,
  Timer,
  Trophy,
  Users,
} from "lucide-react";
import type { JSX } from "react";
import type { Tournament } from "./tournament.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDialogContext } from "@/contexts/DialogContext";
import { TournamentService } from "./tournament.service";
import DeleteDialog from "@/components/DeleteDialog";
import UpdateDialog from "@/components/UpdateDialog";
import TournamentForm from "./TournamentForm";

const TournamentCard = ({ item }: { item: Tournament }) => {
  const DialogContext = useDialogContext();
  const { setOpenDialog, setMessage /* setOpenForm  */ } = DialogContext;

  const queryClient = useQueryClient();

  //Mutation per eliminare un torneo
  const { mutate: deleteTournament, isPending: isDeleting } = useMutation({
    mutationFn: TournamentService.delete, //funzione che chiama l'endpoint per eliminare un torneo
    onSettled: () => {
      //qualunque sia l'esito della mutation, mostro la dialog di messaggio e chiudo il form
      /* setOpenForm(false); */
      setOpenDialog(true);
    },
    onError: (error: Error) => {
      setMessage(error.message);
    },
    onSuccess: () => {
      setMessage("Torneo eliminato con successo!");
      queryClient.invalidateQueries({
        //invalidazione della query dei tornei per rifetchare la lista aggiornata dopo l'eliminazione di un torneo
        queryKey: ["tournaments"],
      });
    },
  });

  //Mutation per aggiornare un torneo
  const { mutate: updateTournament, isPending: isUpdating } = useMutation({
    mutationFn: TournamentService.update, //funzione che chiama l'endpoint per aggiornare un torneo
    onError: (error: Error) => {
      setMessage(error.message);
      setOpenDialog(true);
    },
    onSuccess: () => {
      setMessage("Torneo aggiornato con successo!");
      /* setOpenForm(false); */
      setOpenDialog(true);
      queryClient.invalidateQueries({
        //invalidazione della query dei tornei per rifetchare la lista aggiornata dopo l'aggiornamento di un torneo
        queryKey: ["tournaments"],
      });
    },
  });

  function returnStatus(status: string | undefined): JSX.Element {
    switch (status) {
      case "draft":
        return (
          <>
            <Timer size={20} />
            Non ancora iniziato
          </>
        );

      case "ready":
        return (
          <>
            <Check size={20} />
            Torneo sta per cominciare
          </>
        );

      case "in_progress":
        return (
          <>
            <Play size={20} />
            Torneo in corso
          </>
        );

      case "completed":
        return (
          <>
            <Trophy size={20} />
            Torneo concluso
          </>
        );

      default:
        return (
          <>
            <Ban size={20} />
            Stato sconosciuto
          </>
        );
    }
  }
  return (
    <Card
      key={item.id}
      className="w-full max-w-sm border-primary border gap-4 relative bg-accent/20"
    >
      <CardHeader className="flex justify-between">
        <CardTitle>
          <Link
            to={`/tournaments/${item.id}`}
            className="after:absolute after:inset-0"
          >
            <h2 className="text-xl text-primary font-medium">{item.name}</h2>
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
              children={
                <TournamentForm
                  isPending={isUpdating}
                  mutate={(args) => updateTournament({ ...args, id: item.id })}
                  defaultValues={item}
                />
              }
            />
            {/* Dialog per l'eliminazione */}
            <DeleteDialog
              isPending={isDeleting}
              mutate={deleteTournament}
              id={item.id}
            />
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent>
        <CardDescription className="flex flex-col gap-2">
          <p className="flex text-sm font-semibold text-neutral-500 items-center gap-1">
            {returnStatus(item.status)}
          </p>

          <p className="flex text-sm text-neutral-500 items-center gap-1">
            <Users size={20} /> {item.participantsNumber} squadre
          </p>
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        {/* Anno di inizio */}
        <p className="flex text-[16px] w-full pt-3 text-neutral-500 items-center gap-1 border-t border-b-neutral-500">
          <Calendar size={20} /> Inizio: {item.year}
        </p>
        {/* Luogo del torneo */}
        <p className="flex text-[16px] w-full pt-3 text-neutral-500 items-center gap-1 border-t border-b-neutral-500">
          <MapPin size={20} /> Luogo: {item.place}
        </p>
      </CardFooter>
    </Card>
  );
};

export default TournamentCard;
