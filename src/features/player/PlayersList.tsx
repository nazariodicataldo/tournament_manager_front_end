import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { PlayerService } from "./player.service";
import PlayerCard, { type PlayerTeam } from "./PlayerCard";
import CreateDialog from "@/components/CreateDialog";
import PlayerCreateForm from "./PlayerCreateForm";
import { useState } from "react";

const TeamsList = () => {
  const [openForm, setOpenForm] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); //Stato per l'apertura della modal di messaggio
  const [message, setMessage] = useState<string | undefined>(); //stato che salva il messaggio da mostrare nella modal

  const {
    data: teams = [],
    isPending,
    /* isError, */
  } = useQuery({
    queryKey: ["players"],
    queryFn: PlayerService.list,
  });

  return (
    <>
      <header className="mt-8 flex justify-between items-center">
        <h1 className="text-2xl text-primary font-semibold">
          Tutte i giocatori
        </h1>
        <CreateDialog
          text="Aggiungi giocatore"
          openForm={openForm}
          setOpenForm={setOpenForm}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          message={message}
          children={<PlayerCreateForm setOpenDialog={setOpenDialog} setOpenForm={setOpenForm} setMessage={setMessage} />}
        />
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
          <PlayerCard item={team as PlayerTeam} />
        ))}
      </section>
    </>
  );
};

export default TeamsList;
