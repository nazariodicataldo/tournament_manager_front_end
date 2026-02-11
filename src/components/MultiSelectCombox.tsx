import React, { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface Team {
  id: number;
  name: string;
}

interface MultiSelectComboboxProps {
  teams: Team[];
  value: number[];
  onBlur: (value: number[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
}

export function MultiSelectCombobox({
  teams,
  value,
  onBlur,
  placeholder = "Seleziona squadre...",
  searchPlaceholder = "Cerca squadra...",
  emptyText = "Nessuna squadra trovata.",
  className,
}: MultiSelectComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedTeams = teams.filter((team) => value.includes(team.id));

  const toggleTeam = (teamId: number) => {
    const newValue = value.includes(teamId)
      ? value.filter((id) => id !== teamId)
      : [...value, teamId];
    onBlur(newValue);
  };

  const removeTeam = (teamId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onBlur(value.filter((id) => id !== teamId));
  };

  return (
    <>
      {selectedTeams.length > 0 && (
        <small className="absolute right-8">
          {selectedTeams.length}{" "}
          {selectedTeams.length === 1 ? "selezione" : "selezioni"}
        </small>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          nativeButton={false}
          render={
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                "w-full h-max py-1 justify-between min-h-10",
                className,
              )}
            />
          }
        >
          <div className="flex gap-1 flex-wrap flex-1">
            {selectedTeams.length > 0 ? (
              selectedTeams.map((team) => (
                <Badge key={team.id} variant="secondary" className="mr-1 mb-1">
                  {team.name}
                  <button
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        removeTeam(team.id, e as any);
                      }
                    }}
                    onMouseDown={(e) => removeTeam(team.id, e)}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-foreground" />
        </PopoverTrigger>
        <PopoverContent className="w-sm p-0" align="center">
          <Command className="w-full">
            <CommandInput placeholder={searchPlaceholder} />
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-auto">
              {teams.map((team) => (
                <CommandItem
                  key={team.id}
                  value={team.name}
                  onSelect={() => toggleTeam(team.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(team.id) ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {team.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
