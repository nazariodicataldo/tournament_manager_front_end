import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Icon, Swords } from "lucide-react";
import { soccerBall, soccerPitch } from "@lucide/lab";
import { Input } from "@/components/ui/input";
import type { Tournament, TournamentDashboard } from "./tournament.type";

const Dashboard = ({
  dashboard,
  tournament,
}: {
  dashboard: TournamentDashboard;
  tournament?: Tournament;
}) => {
  console.log(dashboard);
  return (
    <Card className="w-full md:max-w-md h-max">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Statistiche del torneo
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Partite giocate */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="playedGames"
            className="font-medium flex gap-1 items-center"
          >
            <Icon size={20} strokeWidth={1} iconNode={soccerPitch} /> Partite
            giocate
          </label>
          <Input
            id="playedGames"
            className="disabled:opacity-100 border-0! shadow-none bg-card!"
            disabled={true}
            readOnly={true}
            value={`${dashboard.count} / ${tournament?.participantsNumber && tournament?.participantsNumber - 1}`}
          />
        </div>

        {/* Goal segnati */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="totalGoals"
            className="font-medium flex gap-1 items-center"
          >
            <Icon size={20} strokeWidth={1} iconNode={soccerBall} /> Goal totali
          </label>
          <Input
            id="totalGoals"
            className="disabled:opacity-100 border-0! shadow-none bg-card!"
            disabled={true}
            readOnly={true}
            value={`${dashboard.totalGoals ?? 0} goal`}
          />
        </div>

        {/* Ultima partita giocata */}
        {dashboard.lastGame && (
          <div className="flex flex-col gap-1">
            <label
              htmlFor="lastGame"
              className="font-medium flex gap-1 items-center"
            >
              <Swords size={20} strokeWidth={1} /> Ultima partita disputata
            </label>
            <Input
              id="lastGame"
              className="disabled:opacity-100 border-0! shadow-none bg-card!"
              disabled={true}
              readOnly={true}
              value={`${dashboard.lastGame.teamA?.name} ${dashboard.lastGame.goalA} - ${dashboard.lastGame.teamB?.name} ${dashboard.lastGame.goalB}`}
            />
          </div>
        )}

        {/* Vincitore del torneo */}
        {dashboard.winner && (
          <div className="flex flex-col gap-1">
            <label
              htmlFor="winner"
              className="font-medium flex gap-1 items-center"
            >
              <Crown size={20} strokeWidth={1} /> Vincitore del torneo
            </label>
            <Input
              id="winner"
              className="disabled:opacity-100 font-medium text-lg! border-0! shadow-none bg-card!"
              disabled={true}
              readOnly={true}
              value={`${dashboard.winner.name} `}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Dashboard;
