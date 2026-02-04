import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

const TournamentPage = () => {
  return (
    <>
      <header className="mt-8 grid grid-cols-3">
        <Link to={'/tournaments'} className="flex items-center gap-1 text-primary underline">
            <ArrowLeft size={20} />
            Torna ai tornei
        </Link>
        <h1 className="text-2xl text-primary font-semibold">Tutti i tornei</h1>
      </header>
    </>
  );
};

export default TournamentPage;
