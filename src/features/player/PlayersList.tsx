import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { PlayerService } from "./player.service";
import PlayerCard, { type PlayerTeam } from "./PlayerCard";
import CreateDialog from "@/components/CreateDialog";
import PlayerForm from "./PlayerForm";
import { useDialogContext } from "@/contexts/DialogContext";
import EmptyError from "@/components/EmptyError";
import type { Player } from "./player.type";
import EmptyResult from "@/components/EmptyResult";

const PlayersList = () => {
  const {
    data: players = [],
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["players"],
    queryFn: PlayerService.list,
  });

  //ci prendiamo dal contesto della dialog le funzioni per aprire/chiudere la dialog e settare il messaggio
  const { setOpenDialog, setMessage /* setOpenForm */ } = useDialogContext();

  const queryClient = useQueryClient(); //essenziqale per invalidare la query dei giocatori dopo la creazione di un nuovo giocatore
  const { mutate: createPlayer, isPending: isCreating } = useMutation({
    mutationFn: PlayerService.create, //funzione che chiama l'endpoint per creare un giocatore
    onError: (error: Error) => {
      setMessage(error.message);
      setOpenDialog(true);
    },
    onSuccess: () => {
      setMessage("Giocatore creato con successo!");
      /* setOpenForm(false); */
      setOpenDialog(true);
      queryClient.invalidateQueries({
        //invalidazione della query dei giocatori per rifetchare la lista aggiornata dopo la creazione di un nuovo giocatore
        queryKey: ["players"],
      });
    },
  });

  return (
    <>
      <header className="mt-8 flex justify-between items-center">
        <h1 className="text-2xl text-primary font-semibold">
          Tutti i giocatori
        </h1>
        <CreateDialog
          text="Aggiungi giocatore"
          children={<PlayerForm mutate={createPlayer} isPending={isCreating} />}
        />
      </header>

      {/* Stato errore */}
      {isError && (
        <EmptyError<Player[]>
          title={"Errore durante il carimento dei giocatori"}
          error={error}
          refetch={() => refetch()}
        />
      )}

      {/* Stato con 0 giocatori */}
      {!isError && !isPending && players.length === 0 && (
        <EmptyResult
          title="Nessun giocatore trovato"
          description="Al momento non ci sono giocatori salvati nel database"
          text="Crea giocatore"
          children={<PlayerForm isPending={isCreating} mutate={createPlayer} />}
        />
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Stato Loading */}
        {isPending &&
          new Array(16)
            .fill("")
            .map((_, pos) => (
              <Skeleton key={pos} className="max-w-sm aspect-video" />
            ))}

        {/* Rendering cards */}
        {!isPending &&
          !isError &&
          players.map((player) => (
            <PlayerCard key={player.id} item={player as PlayerTeam} />
          ))}
      </section>
    </>
  );
};

export default PlayersList;
