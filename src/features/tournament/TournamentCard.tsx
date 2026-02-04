import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Ban,
  Calendar,
  Check,
  Ellipsis,
  Pencil,
  Play,
  Timer,
  Trash2,
  Trophy,
  Users,
} from "lucide-react";
import type { JSX } from "react";
import type { Tournament } from "./tournament.type";

const TournamentCard = ({ item }: { item: Tournament}) => {
  function returnStatus(status: string): JSX.Element {
    switch (status) {
      case "draft":
        return (
          <>
            <Timer size={20} />
            Non ancora iniziato
          </>
        );

      case "ready":
        return (
          <>
            <Check size={20} />
            Torneo sta per cominciare
          </>
        );

      case "in_progress":
        return (
          <>
            <Play size={20} />
            Torneo in corso
          </>
        );

      case "completed":
        return (
          <>
            <Trophy size={20} />
            Torneo concluso
          </>
        );

      default:
        return (
          <>
            <Ban size={20} />
            Stato sconosciuto
          </>
        );
    }
  }
  return (
    <Card
      key={item.id}
      className="w-full max-w-sm border-primary border gap-4 relative bg-accent/20"
    >
      <CardHeader className="flex justify-between">
        <CardTitle>
          <Link
            to={`/tournaments/${item.id}`}
            className="after:absolute after:inset-0"
          >
            <h2 className="text-xl text-primary font-medium">{item.name}</h2>
          </Link>
        </CardTitle>
        <Popover>
          <PopoverTrigger
            nativeButton={false}
            render={
              <Button variant={"ghost"} className="relative z-10">
                <Ellipsis size={64} />
              </Button>
            }
          />
          <PopoverContent className={"w-40 flex flex-col gap-2"}>
            <Button variant={"outline"}>
              <Pencil />
              Modifica
            </Button>
            <Button variant={"destructive"}>
              <Trash2 />
              Elimina
            </Button>
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent>
        <CardDescription className="flex flex-col gap-2">
          <p className="flex text-sm font-semibold text-neutral-500 items-center gap-1">
            {returnStatus(item.status)}
          </p>

          <p className="flex text-sm text-neutral-500 items-center gap-1">
            <Users size={20} /> {item.participantsNumber} squadre
          </p>
        </CardDescription>
      </CardContent>
      <CardFooter>
        <p className="flex text-[16px] w-full pt-3 text-neutral-500 items-center gap-1 border-t border-b-neutral-500">
          <Calendar size={20} /> Inizio: {item.year}
        </p>
      </CardFooter>
    </Card>
  );
};

export default TournamentCard;
