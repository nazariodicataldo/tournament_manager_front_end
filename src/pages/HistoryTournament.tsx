import EmptyError from "@/components/EmptyError";
import EmptyResult from "@/components/EmptyResult";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TournamentService } from "@/features/tournament/tournament.service";
import type { Tournament } from "@/features/tournament/tournament.type";
import { useQuery } from "@tanstack/react-query";
import { Calendar, MapPin } from "lucide-react";
/* import { DynamicIcon } from "lucide-react/dynamic"; */
import { Link } from "react-router";

const HistoryTournament = () => {
  //Query per prendere le info sul torneo
  const {
    data: tournaments = [],
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["history"],
    queryFn: () => TournamentService.list("completed"),
  });

  return (
    <>
      <header className="mt-8 grid grid-cols-1">
        <h1 className="text-2xl text-primary font-semibold">
          Cronologia dei tornei conclusi
        </h1>
      </header>

      {isError && (
        <EmptyError<Tournament[]>
          title={"Errore durante il caricamento dello storico dei tornei"}
          error={error}
          refetch={() => refetch()}
        />
      )}

      {isPending &&
        new Array(4)
          .fill("")
          .map((_, pos) => <Skeleton key={pos} className="w-full h-30" />)}

      {!isPending && !isError && tournaments.length === 0 && (
        <EmptyResult
          title={"Nessun torneo trovato"}
          description={"Al momento non ci sono tornei conclusi"}
        />
      )}

      {!isPending && !isError && (
        <div className="mt-4 min-h-[50vh] w-full flex gap-10 flex-col">
          {tournaments.map((tournament) => (
            <Card key={tournament.id} className="relative">
              <CardContent className="flex justify-between items-center">
                <CardTitle>
                  <Link
                    to={`/tournaments/${tournament.id}`}
                    className="after:absolute after:inset-0"
                  >
                    <h2 className="text-card-foreground text-xl font-semibold">
                      {tournament.name}
                    </h2>
                  </Link>
                </CardTitle>
                <p className="text-center flex flex-col gap-1">
                  Vincitore
                  <Link
                    to={`/teams/${tournament.winner?.id}`}
                    className="font-medium text-lg relative z-40"
                  >
                    {/* {tournament.winner?.icon && (
                      <DynamicIcon size={20} name={tournament.winner.icon} />
                    )} */}
                    {tournament.winner?.name}
                  </Link>
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                {/* Anno di inizio */}
                <p className="flex text-[16px] w-full pt-3 text-neutral-500 items-center gap-1 border-t border-b-neutral-500">
                  <Calendar size={20} /> Inizio: {tournament.year}
                </p>
                {/* Luogo del torneo */}
                <p className="flex text-[16px] w-full pt-3 text-neutral-500 items-center gap-1 border-t border-b-neutral-500">
                  <MapPin size={20} /> Luogo: {tournament.place}
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

export default HistoryTournament;
