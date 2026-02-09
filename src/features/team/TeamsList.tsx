import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TeamService } from "./team.service";
import { Skeleton } from "@/components/ui/skeleton";
import TeamCard from "./TeamCard";
import { useDialogContext } from "@/contexts/DialogContext";
import CreateDialog from "@/components/CreateDialog";
import TeamForm from "./TeamForm";
import EmptyError from "@/components/EmptyError";
import type { Team } from "./team.type";
import EmptyResult from "@/components/EmptyResult";

const TeamsList = () => {
  const {
    data: teams = [],
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["teams"],
    queryFn: TeamService.list,
  });

  //Ci prendiamo le funzioni per gestire la dialog e il messaggio da mostrare nella dialog dal DialogContext, in modo da poterle utilizzare nella mutation di creazione del torneo per mostrare un messaggio di successo o errore dopo la creazione di un nuovo torneo
  const { setOpenDialog, setMessage /* setOpenForm */ } = useDialogContext();

  const queryClient = useQueryClient(); //essenziale per invalidare la query dei giocatori dopo la creazione di un nuovo giocatore

  const { mutate: createTeam, isPending: isCreating } = useMutation({
    mutationFn: TeamService.create, //funzione che chiama l'endpoint per creare un giocatore
    onSettled: () => {
      //qualunque sia l'esito della mutation, mostro la dialog di messaggio e chiudo il form
      /* setOpenForm(false); */
      setOpenDialog(true);
    },
    onError: (error: Error) => {
      setMessage(error.message);
    },
    onSuccess: () => {
      setMessage("Squadra creata con successo!");
      /* setOpenForm(false); */
      queryClient.invalidateQueries({
        //invalidazione della query delle squadre per rifetchare la lista aggiornata dopo la creazione di una nuova squadra
        queryKey: ["teams"],
      });
    },
  });

  return (
    <>
      <header className="mt-8 flex justify-between items-center">
        <h1 className="text-2xl text-primary font-semibold">
          Tutte le squadre
        </h1>
        <CreateDialog
          text="Aggiungi Squadra"
          children={<TeamForm mutate={createTeam} isPending={isCreating} />}
        />
      </header>

      {/* Stato errore */}
      {isError && (
        <EmptyError<Team[]>
          title={"Errore durante il carimento delle squadre"}
          error={error}
          refetch={() => refetch()}
        />
      )}

      {/* Stato con 0 squadre */}
      {!isError && !isPending && teams.length === 0 && (
        <EmptyResult
          title="Nessuna squadra trovata"
          description="Al momento non ci sono squadre salvate nel database"
          text="Crea squadra"
          children={<TeamForm mutate={createTeam} isPending={isCreating} />}
        />
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Stato Loading */}
        {isPending &&
          new Array(8)
            .fill("")
            .map((_, pos) => (
              <Skeleton key={pos} className="max-w-sm aspect-video" />
            ))}

        {/* Rendering cards */}
        {!isPending &&
          !isError &&
          teams.map((team) => <TeamCard key={team.id} item={team} />)}
      </section>
    </>
  );
};

export default TeamsList;
