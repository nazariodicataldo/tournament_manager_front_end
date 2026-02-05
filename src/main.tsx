import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TeamsList from "./features/team/TeamsList";
import TournamentsList from "./features/tournament/TournamentsList";
import TournamentPage from "./pages/TournamentPage";
import PlayersList from "./features/player/PlayersList";
import DialogContextProvider from "./contexts/DialogContext";
import TeamPage from "./pages/TeamPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/tournaments",
        children: [
          {
            index: true,
            element: <TournamentsList />,
          },
          {
            path: "/tournaments/:id",
            element: <TournamentPage />,
          },
        ],
      },
      {
        path: "/teams",
        children: [
          {
            index: true,
            element: <TeamsList />,
          },
          {
            path: "/teams/:id",
            element: <TeamPage />,
          }
        ],
      },
      {
        path: "/players",
        children: [
          {
            index: true,
            element: <PlayersList />,
          },
        ],
      },
    ],
  },
]);

const queryClient = new QueryClient({});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <DialogContextProvider>
        <RouterProvider router={router} />
      </DialogContextProvider>
    </QueryClientProvider>
  </StrictMode>,
);
