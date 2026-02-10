import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TournamentService } from "../tournament/tournament.service";
import type { Tournament } from "../tournament/tournament.type";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import UpdateDialog from "@/components/UpdateDialog";
import GameForm from "./GameForm";
/* import { useDialogContext } from "@/contexts/DialogContext"; */
import { GameService } from "./game.service";
import type { Game } from "./game.type";
import { Trophy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const GamesList = ({
  tournament,
  lastGame,
}: {
  tournament: Tournament;
  lastGame?: Game;
}) => {
  const {
    data: games = [],
    refetch,
    isPending: fetchingGames,
    /* isError, */
  } = useQuery({
    queryKey: ["games", { id: tournament.id }],
    queryFn: () => TournamentService.games(tournament.id),
  });

  const {
    data: rounds = [],
    isPending: fetchingRounds,
    /* isError, */
  } = useQuery({
    queryKey: ["rounds", { id: tournament.id }],
    queryFn: () => TournamentService.rounds(tournament.id),
  });

  //const { setOpenForm } = useDialogContext();

  const queryClient = useQueryClient(); //ci prendiamo il query client per aggiornare la dashbard quando una partita termina

  //Mutation per modificare i goal delle due squadre e drecretare il vincitore
  const { mutate: updateGame, isPending: isUpdating } = useMutation({
    mutationFn: GameService.update, //funzione che chiama l'endpoint per aggiungere il giocatore
    onError: (error: Error) => {
      toast.error(error.message, { position: "bottom-right" });
    },
    onSuccess: () => {
      toast.success("Risultato della partita cambiato correttamente!", {
        position: "bottom-right",
      });
      refetch();
      queryClient.invalidateQueries({
        //invalidazione della query con le statistiche del torneo
        queryKey: ["dashboard", { tournamentId: tournament.id }],
      });
    },
  });

  //Funzione che converte gli status in italiano
  function convertStatus(status: Game["status"]): string {
    switch (status) {
      case "waiting":
        return "In programma";
      case "ready":
        return "Pronti per giocare";
      case "played":
        return "Partita giocata";
      default:
        return "Stato sconosciuto";
    }
  }

  return (
    <Tabs
      className="w-full md:w-100 mt-4"
      defaultValue={lastGame ? lastGame.round : undefined}
    >
      <TabsList className="mb-2">
        {fetchingRounds && <Skeleton className="w-[256px] h-4" />}

        {!fetchingRounds &&
          rounds.map((round) => (
            <TabsTrigger key={round.round} value={round.round}>
              {capitalizeFirstLetter(round.round)}
            </TabsTrigger>
          ))}
      </TabsList>

      {fetchingGames &&
        new Array(4)
          .fill("")
          .map((_, pos) => <Skeleton key={pos} className="w-[384px] h-32" />)}

      {!fetchingGames &&
        rounds.map((round) => (
          <TabsContent
            key={round.round}
            value={round.round}
            className="flex flex-col gap-4"
          >
            {games
              .filter(
                (game) => game.round === round.round,
              ) /* Prima filtro, prendendomi solo i match che combaciano con il round */
              .map((game) => {
                const date = new Date(game.start!);

                return (
                  <div key={game.id} className="flex flex-col">
                    {/* Status & Orario Partita */}
                    <p className="px-6 flex justify-between items-center rounded-t-xl text-card-foreground border-foreground/10 border bg-accent py-1">
                      <small className="text-[13px]">
                        {convertStatus(game.status)}
                      </small>
                      {/* status convertito in italiano */}
                      <small className="text-[13px]">{`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`}</small>
                      {/* Orario partita in daye */}
                    </p>
                    {/* Card con la partita */}
                    <Card
                      key={game.id}
                      className="rounded-t-none flex flex-row justify-between items-center p-0"
                    >
                      <CardContent className="w-full p-0 text-muted-foreground text-sm flex flex-col">
                        {/* Team A */}
                        <p
                          className={cn(
                            "flex items-center justify-between px-6 py-2",
                            game.teamAId === game.winnerId &&
                              game.teamAId &&
                              "bg-primary/10 text-primary-foreground font-semibold",
                          )}
                        >
                          <span className="flex items-center gap-2">
                            {/* Nome Squadra A se esiste oppure placeholder */}
                            {game.teamA?.name ?? (
                              <span className="italic text-neutral-500">
                                Da definire
                              </span>
                            )}
                            {/* Se è la finale e la Squadra A è la vincitrice, aggiungo l'icona del trofeo  */}
                            {game.round === "finale" &&
                              game.winnerId && //verifico anche winnerId non sia null
                              game.teamAId === game.winnerId && (
                                <Trophy size={20} strokeWidth={1.5} />
                              )}
                          </span>
                          {/* Goal Squadra A */}
                          {game.goalA && (
                            <span
                              className={cn(
                                "bg-muted rounded-full size-8 flex justify-center items-center",
                                game.teamAId === game.winnerId &&
                                  "bg-primary/50 text-primary-foreground",
                              )}
                            >
                              {game.goalA}
                            </span>
                          )}
                        </p>

                        {/* Divisore */}
                        <hr className="w-full" />

                        {/* Team B */}
                        <p
                          className={cn(
                            "flex items-center justify-between px-6 py-2",
                            game.teamBId === game.winnerId &&
                              game.teamBId &&
                              "bg-primary/10 text-primary-foreground font-semibold",
                          )}
                        >
                          <span className="flex items-center gap-2">
                            {/* Nome Squadra B se esiste oppure placeholder */}
                            {game.teamB?.name ?? (
                              <span className="italic text-neutral-500">
                                Da definire
                              </span>
                            )}
                            {/* Se è la finale e la Squadra B è la vincitrice, aggiungo l'icona del trofeo  */}
                            {game.round === "finale" &&
                              game.teamBId === game.winnerId &&
                              game.winnerId && (
                                <Trophy size={20} strokeWidth={1.5} />
                              )}
                          </span>
                          {/* Goal Squadra B */}
                          {game.goalB && (
                            <span //mostro solo se esiste la proprietà
                              className={cn(
                                "bg-muted rounded-full size-8 flex justify-center items-center",
                                game.teamBId === game.winnerId &&
                                  "bg-primary/50 text-primary-foreground",
                              )}
                            >
                              {game.goalB}
                            </span>
                          )}
                        </p>
                      </CardContent>
                      {/* bottone di aggiornamento del risultato visibile solo se entrambe le squadre sono presenti */}
                      {game.teamA &&
                        game.teamB &&
                        !game.goalA &&
                        !game.goalB && (
                          <CardFooter className="w-max">
                            {
                              //Il bottone non deve essre visibile se le squadre hanno già giocato
                              <UpdateDialog
                                text={"Aggiorna risultato"}
                                children={
                                  <GameForm
                                    game={game}
                                    isPending={isUpdating}
                                    mutate={updateGame}
                                  />
                                }
                              />
                            }
                          </CardFooter>
                        )}
                    </Card>
                  </div>
                );
              })}
          </TabsContent>
        ))}
    </Tabs>
  );
};

export default GamesList;
