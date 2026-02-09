import CreateDialog from "@/components/CreateDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useDialogContext } from "@/contexts/DialogContext";
import GamesList from "@/features/game/GamesList";
import { TeamTournamentService } from "@/features/teamTournaments/teamTournament.service";
import TeamTournamentForm from "@/features/teamTournaments/TeamTournamentForm";
import { TournamentService } from "@/features/tournament/tournament.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router";
import Dashboard from "@/features/tournament/Dashboard";
import DraftTournament from "@/features/tournament/DraftTournament";
import EmptyError from "@/components/EmptyError";
import type { TeamTournament } from "@/features/teamTournaments/teamTournament.type";
import EmptyResult from "@/components/EmptyResult";

const TournamentPage = () => {
  //Mi prendo l'id del team dai parametri dell'url
  const { id } = useParams();

  const DialogContext = useDialogContext();

  const { setOpenDialog, setMessage /* setOpenForm  */ } = DialogContext;

  //Query per prendermi la squadra vincitrice del torneo
  const {
    data: dashboard,
    isPending: fetchingDashboard,
    isError: errorDashboard,
  } = useQuery({
    queryKey: ["dashboard", { tournamentId: +id! }],
    queryFn: () => TournamentService.dashboard(+id!),
  });

  //Query per prendere le info sul torneo
  const { data: tournament } = useQuery({
    queryKey: ["tournament", { id: +id! }],
    queryFn: () => TournamentService.get(+id!),
  });

  //Query per prendere i dati del team specifico
  const {
    data: teamTournament = [],
    isError,
    error,
    refetch,
    isPending,
  } = useQuery({
    queryKey: ["team_tournaments", { id: +id! }],
    queryFn: () => TeamTournamentService.list(+id!),
  });

  const queryClient = useQueryClient();

  //Mutation per rimuovere una squadra dal torneo
  const { mutate: removeTeam, isPending: isRemoving } = useMutation({
    mutationFn: TeamTournamentService.delete, //funzione che chiama l'endpoint per aggiungere il giocatore
    onSettled: () => {
      //qualunque sia l'esito della mutation, mostro la dialog di messaggio e chiudo il form
      /* setOpenForm(false); */
      setOpenDialog(true);
    },
    onError: (error: Error) => {
      setMessage(error.message);
    },
    onSuccess: () => {
      setMessage("Squadra rimossa con successo");
      queryClient.invalidateQueries({
        //invalidazione della query dei giocatori per rifetchare la lista aggiornata dopo l'eliminazione di un giocatore
        queryKey: ["team_tournaments", { id: +id! }],
      });
    },
  });

  //Mutation per aggiungere una squadra dal torneo
  const { mutate: addTeam, isPending: isAdding } = useMutation({
    mutationFn: TeamTournamentService.create, //funzione che chiama l'endpoint per aggiungere il giocatore
    onSettled: () => {
      //qualunque sia l'esito della mutation, mostro la dialog di messaggio e chiudo il form
      /* setOpenForm(false); */
      setOpenDialog(true);
    },
    onError: (error: Error) => {
      setMessage(error.message);
    },
    onSuccess: () => {
      setMessage("Squadra aggiunta con successo");
      queryClient.invalidateQueries({
        //invalidazione della query dei giocatori per rifetchare la lista aggiornata dopo l'eliminazione di un giocatore
        queryKey: ["team_tournaments", { id: +id! }],
      });
    },
  });

  //Mutation per modificare lo status del torneo e quindi generare abbinamenti
  const { mutate: updateStatus, isPending: isUpdating } = useMutation({
    mutationFn: TournamentService.update, //funzione che chiama l'endpoint per aggiungere il giocatore
    onSettled: () => {
      //qualunque sia l'esito della mutation, mostro la dialog di messaggio e chiudo il form
      /* setOpenForm(false); */
      setOpenDialog(true);
    },
    onError: (error: Error) => {
      setMessage(error.message);
    },
    onSuccess: () => {
      setMessage("Abbinamenti generati correttamente");
      queryClient.invalidateQueries({
        //invalidazione della query dei giocatori per rifetchare la lista aggiornata dopo l'eliminazione di un giocatore
        queryKey: ["tournament", { id: +id! }],
      });
    },
  });

  return (
    <>
      <header className="mt-8 grid grid-cols-3">
        <Link
          to={"/tournaments"}
          className="flex items-center gap-1 text-primary underline"
        >
          <ArrowLeft size={20} />
          Torna ai tornei
        </Link>
        <h1 className="text-2xl text-primary font-semibold">Tutti i tornei</h1>
      </header>

      <section>
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl font-semibold">
            Lista squadre iscritte ({teamTournament?.length || 0})
          </h2>

          {/* Il pulsante per aggiungere la squadra è visibile solo se il torneo non è ancora pronto */}
          {/* Quando il numero di partecipanti non è raggiunto, il bottone deve essere visibile */}
          {tournament?.status === "draft" && (
            <CreateDialog
              disabled={tournament?.participantsNumber === teamTournament.length}
              text="Iscrivi squadra"
              children={
                <TeamTournamentForm
                  mutate={addTeam}
                  tournamentId={+id!}
                  isPending={isAdding}
                />
              }
            />
          )}
        </div>

        {/* Stato errore */}
        {isError && (
          <EmptyError<TeamTournament[]>
            title={"Errore durante il carimento dei giocatori della squadra"}
            error={error}
            refetch={() => refetch()}
          />
        )}

        {/* Stato con 0 squadre */}
        {!isPending && teamTournament?.length === 0 && (
          <EmptyResult
            title="Nessuna squadra trovata"
            description="Al momento non ci sono squadre iscritte al torneo"
            text="Aggiungi squadra"
            children={
              <TeamTournamentForm
                mutate={addTeam}
                tournamentId={+id!}
                isPending={isAdding}
              />
            }
          />
        )}

        {/* Loading squadre */}
        {isPending && (
          <div className="grid grid-cols-4 gap-4 mt-4">
            {new Array(8).fill("").map((_, pos) => (
              <Skeleton key={pos} className="max-w-3xs aspect-video" />
            ))}
          </div>
        )}

        {/* body che contiene le partite e le statistiche */}
        <div className="flex flex-col gap-12 md:flex-row justify-between">
          {/* Sezione visibile solo quando il torneo non è ancora iniziato e quindi è nello status 'draft' */}
          {tournament?.status === "draft" && (
            <DraftTournament
              tournamentId={+id!}
              teamTournament={teamTournament}
              removeTeam={removeTeam}
              isRemoving={isRemoving}
              updateStatus={updateStatus}
              isUpdating={isUpdating}
            />
          )}

          {tournament && tournament.status !== "draft" && (
            <GamesList
              lastGame={dashboard?.lastGame}
              tournament={tournament!}
            />
          )}

          {/* Rendering condizionale delle statistiche */}
          {/* Loading con skeleton */}
          {tournament && tournament.status !== "draft" && fetchingDashboard && (
            <Skeleton className="w-md h-max" />
          )}

          {/* Mostro le statistiche */}
          {tournament &&
            tournament.status !== "draft" &&
            !fetchingDashboard &&
            !errorDashboard &&
            dashboard && (
              <Dashboard dashboard={dashboard} tournament={tournament} />
            )}
        </div>
      </section>
    </>
  );
};

export default TournamentPage;
