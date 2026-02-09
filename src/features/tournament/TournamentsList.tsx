import CreateDialog from "@/components/CreateDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { TournamentService } from "@/features/tournament/tournament.service";
import TournamentCard from "@/features/tournament/TournamentCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TournamentForm from "./TournamentForm";
import { useDialogContext } from "@/contexts/DialogContext";
import EmptyError from "@/components/EmptyError";
import type { Tournament } from "./tournament.type";
import EmptyResult from "@/components/EmptyResult";

const TournamentsList = () => {
  const {
    data: tournaments = [],
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tournaments"],
    queryFn: () => TournamentService.list(),
  });

  const { setOpenDialog, setMessage /* setOpenForm */ } = useDialogContext();

  const queryClient = useQueryClient(); //essenziqale per invalidare la query dei giocatori dopo la creazione di un nuovo giocatore
  const { mutate: createTournament, isPending: isCreating } = useMutation({
    mutationFn: TournamentService.create, //funzione che chiama l'endpoint per creare un giocatore
    onSettled: () => {
      //qualunque sia l'esito della mutation, mostro la dialog di messaggio e chiudo il form
      /* setOpenForm(false); */
      setOpenDialog(true);
    },
    onError: (error: Error) => {
      setMessage(error.message);
    },
    onSuccess: () => {
      setMessage("Torneo creato con successo!");
      /* setOpenForm(false); */
      queryClient.invalidateQueries({
        //invalidazione della query dei tornei per rifetchare la lista aggiornata dopo la creazione di un nuovo torneo
        queryKey: ["tournaments"],
      });
    },
  });

  return (
    <>
      <header className="mt-8 flex justify-between items-center">
        <h1 className="text-2xl text-primary font-semibold">Tutti i tornei</h1>
        <CreateDialog
          text="Aggiungi Torneo"
          children={
            <TournamentForm mutate={createTournament} isPending={isCreating} />
          }
        />
      </header>

      {/* Stato errore */}
      {isError && (
        <EmptyError<Tournament[]>
          title={"Errore durante il carimento delle squadre"}
          error={error}
          refetch={() => refetch()}
        />
      )}

      {/* Stato con 0 squadre */}
      {!isError && !isPending && tournaments.length === 0 && (
        <EmptyResult
          title="Nessuno torneo trovato"
          description="Al momento non ci sono tornei salvati nel database"
          text="Crea torneo"
          children={ <TournamentForm isPending={isCreating} mutate={createTournament} />}
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
          tournaments.map((tournament) => (
            <TournamentCard key={tournament.id} item={tournament} />
          ))}
      </section>
    </>
  );
};

export default TournamentsList;
