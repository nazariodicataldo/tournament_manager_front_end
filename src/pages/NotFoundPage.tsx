import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const NotFoundPage = () => {
  return (
    <main className="container mx-auto bg-background flex flex-col gap-4 items-center justify-center min-h-screen text-primary">
      <h1 className="text-9xl font-semibold animate-bounce">404</h1>
      <h2 className="text-4xl font-medium">Pagina non trovata</h2>
      <Button
        size={'lg'}
        nativeButton={false}
        render={<Link to={"/"}>Torna alla home</Link>}
      />
    </main>
  );
};

export default NotFoundPage;
