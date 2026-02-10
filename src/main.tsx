import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import MainLayout from "./layouts/MainLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TeamsList from "./features/team/TeamsList";
import TournamentsList from "./features/tournament/TournamentsList";
import TournamentPage from "./pages/TournamentPage";
import PlayersList from "./features/player/PlayersList";
import DialogContextProvider from "./contexts/DialogContext";
import TeamPage from "./pages/TeamPage";
import HistoryTournament from "./pages/HistoryTournament";
import NotFoundPage from "./pages/NotFoundPage";


// This code is only for TypeScript
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__:
      import("@tanstack/query-core").QueryClient;
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to={"/tournaments"} replace />,
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
          },
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
      {
        path: "/history",
        children: [
          {
            index: true,
            element: <HistoryTournament />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />
  }
]);

const queryClient = new QueryClient({});

// This code is for all users
window.__TANSTACK_QUERY_CLIENT__ = queryClient;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <DialogContextProvider>
        <RouterProvider router={router} />
      </DialogContextProvider>
    </QueryClientProvider>
  </StrictMode>,
);
