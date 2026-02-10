import CreateDialog from "@/components/CreateDialog";
import DeleteDialog from "@/components/DeleteDialog";
import EmptyError from "@/components/EmptyError";
import EmptyResult from "@/components/EmptyResult";
import { Skeleton } from "@/components/ui/skeleton";
import { useDialogContext } from "@/contexts/DialogContext";
import { PlayerService } from "@/features/player/player.service";
import type { Player } from "@/features/player/player.type";
import PlayerTeamForm from "@/features/playerTeam/PlayerTeamForm";
import { TeamService } from "@/features/team/team.service";
import type { Team } from "@/features/team/team.type";
import { capitalizeFirstLetter } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Shirt } from "lucide-react";
import { Link, useParams } from "react-router";
import { toast } from "sonner";

const TeamPage = () => {
  //Mi prendo l'id del team dai parametri dell'url
  const { id } = useParams();

  //Query per prendere i dati del team specifico
  const {
    data: team,
    isError,
    error,
    refetch,
    isPending,
  } = useQuery({
    queryKey: ["teams", { id: +id! }],
    queryFn: () => TeamService.get(+id!),
  });

  const DialogContext = useDialogContext();

  const { setOpenForm, setOpenDeleteForm } = DialogContext;

  const queryClient = useQueryClient();

  //Mutation per rimuovere un giocatore dalla squadra
  const { mutate: detachPlayer, isPending: isDetaching } = useMutation({
    mutationFn: PlayerService.update, //funzione che chiama l'endpoint per rimuovere il giocatore
    onSettled: () => {
      setOpenDeleteForm(false);
    },
    onError: (error: Error) => {
      toast.error(error.message, { position: "bottom-right" });
    },
    onSuccess: () => {
      toast.success("Giocatore rimosso con successo!", {
        position: "bottom-right",
      });
      queryClient.invalidateQueries({
        //invalidazione della query dei giocatori per rifetchare la lista aggiornata dopo l'eliminazione di un giocatore
        queryKey: ["teams", { id: +id! }],
      });
    },
  });

  //Mutation per aggiungere un giocatore alla squadra
  const { mutate: addPlayer, isPending: isAdding } = useMutation({
    mutationFn: PlayerService.update, //funzione che chiama l'endpoint per aggiungere il giocatore
    onSettled: () => {
      setOpenForm(false);
    },
    onError: (error: Error) => {
      toast.error(error.message, { position: "bottom-right" });
    },
    onSuccess: () => {
      toast.success("Giocatore aggiunto con successo!", {
        position: "bottom-right",
      });
      queryClient.invalidateQueries({
        //invalidazione della query dei giocatori per rifetchare la lista aggiornata dopo l'eliminazione di un giocatore
        queryKey: ["teams", { id: +id! }],
      });
    },
  });

  return (
    <>
      <header className="mt-8 grid grid-cols-3">
        <Link
          to={"/teams"}
          className="flex items-center gap-1 text-primary underline"
        >
          <ArrowLeft size={20} />
          Torna alle squadre
        </Link>
        <h1 className="text-2xl font-semibold">
          {isPending ? <Skeleton className="w-32 h-8" /> : `${team?.name}`}
        </h1>
      </header>

      <section className="flex flex-col gap-4 w-full">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl font-semibold">
            Lista di giocatori ({team?.players!.length || 0})
          </h2>

          <CreateDialog
            text="Aggiungi giocatore alla squadra"
            children={
              <PlayerTeamForm
                mutate={addPlayer}
                teamId={+id!}
                isPending={isAdding}
              />
            }
          />
        </div>

        {/* Stato errore */}
        {isError && (
          <EmptyError<Team>
            title={"Errore durante il carimento dei giocatori della squadra"}
            error={error}
            refetch={() => refetch()}
          />
        )}

        {/* Stato con 0 squadre */}
        {!isPending && !isError && team.players!.length === 0 && (
          <EmptyResult
            title="Nessun giocatore trovato"
            description="Al momento non ci sono giocatori aggiunti alla squadra"
            text="Aggiungi giocatore"
            children={
              <PlayerTeamForm
                mutate={addPlayer}
                teamId={+id!}
                isPending={isAdding}
              />
            }
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isPending &&
            new Array(6)
              .fill("")
              .map((_, pos) => (
                <Skeleton key={pos} className="max-w-sm aspect-video" />
              ))}

          {!isPending &&
            team?.players!.map((player: Player) => (
              <div
                key={player.id}
                className="bg-secondary p-4 rounded-lg flex flex-col gap-3"
              >
                <div className="flex justify-between">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-semibold">
                      {player.firstName} {player.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {capitalizeFirstLetter(player.role)}
                    </p>
                  </div>
                  {/* Div che contiene le azioni */}
                  <div>
                    {/* Dialog per l'eliminazione */}
                    <DeleteDialog
                      isPending={isDetaching}
                      updateMutate={detachPlayer}
                      id={player.id}
                    />
                  </div>
                </div>
                <p className="flex items-center text-[16px] w-full gap-1 pt-3 border-t border-b-neutral-500">
                  <Shirt size={20} /> {player.number}
                </p>
              </div>
            ))}
        </div>
      </section>
    </>
  );
};

export default TeamPage;
