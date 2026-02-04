import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Ellipsis, Pencil, Trash2, Users } from "lucide-react";
import type { Team } from "./team.type";
import { DynamicIcon } from "lucide-react/dynamic";

const TeamCard = ({ item }: { item: Team }) => {

  return (
    <Card
      key={item.id}
      style={{ borderColor: item.color, backgroundColor: item.color + '10' }}
      className="w-full max-w-sm border gap-4 relative "
    >
      <CardHeader className="flex justify-between">
        <CardTitle className="flex items-center gap-4">
          <DynamicIcon
            name={item.icon}
            style={{ color: item.color }}
            size={48}
          />
          <Link
            to={`/teams/${item.id}`}
            className="after:absolute after:inset-0"
          >
            <h2 className="text-xl font-medium" style={{ color: item.color }}>
              {item.name}
            </h2>
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
      <CardFooter>
        <p className="flex text-[16px] w-full pt-3 text-neutral-500 items-center gap-1 border-t border-b-neutral-500">
          <Users size={20} /> {item.players?.length} giocatori
        </p>
      </CardFooter>
    </Card>
  );
};

export default TeamCard;
