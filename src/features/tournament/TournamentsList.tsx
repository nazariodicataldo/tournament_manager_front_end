import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TournamentService } from "@/features/tournament/tournament.service";
import TournamentCard from "@/features/tournament/TournamentCard";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";

const TournamentsList = () => {
  const {
    data: tournaments = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["tournaments"],
    queryFn: TournamentService.list,
  });

  return (
    <>
      <header className="mt-8 flex justify-between items-center">
        <h1 className="text-2xl text-primary font-semibold">Tutti i tornei</h1>
        <Button size={"lg"}>
          <PlusIcon />
          Aggiungi torneo
        </Button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Stato Loading */}
        {isPending &&
          new Array(8)
            .fill("")
            .map((_, pos) => <Skeleton key={pos} className="max-w-sm aspect-video" />)}

        {/* Rendering cards */}
        {tournaments.map(tournament => (
          <TournamentCard item={tournament} />
        ))}
      </section>
    </>
  );
};

export default TournamentsList;
