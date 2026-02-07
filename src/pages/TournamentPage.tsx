import CreateDialog from "@/components/CreateDialog";
import { AnimatedList } from "@/components/ui/animated-list";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDialogContext } from "@/contexts/DialogContext";
import GamesList from "@/features/game/GamesList";
import { TeamTournamentService } from "@/features/teamTournaments/teamTournament.service";
import TeamTournamentForm from "@/features/teamTournaments/TeamTournamentForm";
import { TournamentService } from "@/features/tournament/tournament.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, FolderTree, ShieldOff } from "lucide-react";
import { Link, useParams } from "react-router";

const TournamentPage = () => {
  //Mi prendo l'id del team dai parametri dell'url
  const { id } = useParams();

  const DialogContext = useDialogContext();

  const { setOpenDialog, setMessage /* setOpenForm  */ } = DialogContext;

  //Query per prendere le info sul torneo
  const { data: tournament } = useQuery({
    queryKey: ["tournament", { id: +id! }],
    queryFn: () => TournamentService.get(+id!),
  });

  //Query per prendere i dati del team specifico
  const {
    data: teamTournament,
    isError,
    error,
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
          {tournament?.status === "draft" && (
            <CreateDialog
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

        {isError && (
          <p className="text-red-500">
            Errore nel caricamento della squadra: {error.message} {error.stack}
          </p>
        )}

        {!isPending && teamTournament?.length === 0 && (
          <p>Nessun giocatore in questa squadra.</p>
        )}

        {/* Sezione visibile solo quando il torneo non è ancora iniziato e quindi è nello status 'draft' */}
        {tournament?.status === "draft" && (
          <div>
            <AnimatedList className="mt-4 min-h-[50vh]">
              {isPending &&
                new Array(4)
                  .fill("")
                  .map((_, pos) => (
                    <Skeleton key={pos} className="max-w-3xs aspect-video" />
                  ))}

              {teamTournament?.reverse().map((t) => (
                <div className="bg-secondary p-4 rounded-lg flex gap-2 items-center justify-between">
                  <h3 className="font-semibold" style={{ color: t.team.color }}>
                    {t.team.name}
                  </h3>
                  <Button
                    variant={"destructive"}
                    disabled={isRemoving}
                    onClick={() =>
                      removeTeam({
                        teamId: t.teamId,
                        tournamentId: tournament.id,
                      })
                    }
                  >
                    <ShieldOff />
                    Rimuovi
                  </Button>
                </div>
              ))}
            </AnimatedList>

            {/* Pulsante per generare gli abbinamenti tra squadre */}
            {/* di fatto cambio lo status del torneo da draft a ready */}
            <div className="flex justify-end w-full mt-16">
              <Button
                size={"lg"}
                disabled={isUpdating}
                onClick={() =>
                  updateStatus({ id: tournament.id, data: { status: "ready" } })
                }
              >
                <FolderTree />
                Genera abbinamenti
              </Button>
            </div>
          </div>
        )}

        {tournament && tournament.status !== "draft" && (
          <GamesList tournament={tournament!} />
        )}
      </section>
    </>
  );
};

export default TournamentPage;
