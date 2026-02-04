import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Ellipsis, Pencil, Shirt, Trash2 } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { capitalizeFirstLetter } from "@/lib/utils";
import type { Player } from "./player.type";
import type { Team } from "../team/team.type";

export type PlayerTeam = Player & { team: Team };

const PlayerCard = ({ item }: { item: PlayerTeam }) => {
  return (
    <Card key={item.id} className="w-full max-w-sm border gap-4 relative ">
      <CardHeader className="flex justify-between">
        <CardTitle className="flex items-center gap-4">
          <h2 className="text-xl font-medium">
            {item.firstName} {item.lastName}
          </h2>
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
          <p className="flex text-lg text-neutral-500 items-center gap-1">
            {capitalizeFirstLetter(item.role)}
          </p>
        </CardDescription>
      </CardContent>
      <CardFooter className="flex">
        <p className="flex items-center text-[16px] w-full pt-3 gap-1 border-t border-b-neutral-500">
          {!item.teamId ? (
            <span className="italic text-neutral-500">Nessun team</span>
          ) : (
            <>
              <DynamicIcon
                name={item.team.icon}
                size={20}
                style={{ color: item.team.color }}
              />
              <span style={{ color: item.team.color }}>{item.team.name}</span>
            </>
          )}
        </p>

        {item.teamId && (
          <p
            style={{ color: item.team.color }}
            className="flex items-center text-[16px] w-full pt-3 gap-1 border-t border-b-neutral-500"
          >
            <Shirt size={20} /> {item.number}
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default PlayerCard;
