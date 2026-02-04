import { useQuery } from "@tanstack/react-query";
import { TeamService } from "./team.service";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import TeamCard from "./TeamCard";

const TeamsList = () => {
  const {
    data: teams = [],
    isPending,
    isError,
    error
  } = useQuery({
    queryKey: ["teams"],
    queryFn: TeamService.list,
  });

  return (
    <>
      <header className="mt-8 flex justify-between items-center">
        <h1 className="text-2xl text-primary font-semibold">
          Tutte le squadre
        </h1>
        <Button size={"lg"}>
          <PlusIcon />
          Aggiungi squadra
        </Button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Stato Loading */}
        {isPending &&
          new Array(8)
            .fill("")
            .map((_, pos) => (
              <Skeleton key={pos} className="max-w-sm aspect-video" />
            ))}

        {/* Rendering cards */}
        {teams.map((team) => (
          <TeamCard item={team} />
        ))}
      </section>
    </>
  );
};

export default TeamsList;
