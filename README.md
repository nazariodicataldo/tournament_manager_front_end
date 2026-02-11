# Tournament Manager Front End

Front End della Web App Tournament Manger per gestire sia l'archiviazione di tornei di calcio, squadre e calciatori e sia la generazione automatica degli abbinamenti che l'avanzamento delle squadre vincitrici nel torneo.

## Librerie principali

- React 19 + Vite 7.
- TypeScript 5.9
- Form e validazione: `react-hook-form ^7.71.1`, `@hookform/resolvers ^5.2.2`, `zod ^4.3.6`.
- UI: `shadcn/ui ^3.8.2`, `@base-ui/react ^1.1.0`, `lucide-react ^0.563.0`, `lucide/lab ^0.1.2`, `tailwindcss ^4.1.18`.
- Routing: `react-router ^7.13.0`.
- Query: `tanstack/react-query ^5.90.20`.

## Struttura del progetto

```
torneo_front_end/
├─ public/              # assets statici gestiti da Vite
├─ src/
│  ├─ assets/           # icone e media
│  ├─ context/           
│  │   └─ DialogContext.tsx   # Context per l'apertura/chiusura delle dialog
│  ├─ hooks/           
│  │   └─ use-moble.ts   # Hook per gestire il responsive
│  ├─ components/       # UI (button, input, dialog, sidebar)
│  ├─ features/
│  │   ├─ team/         # Tipi, servizi CRUD e componenti legati alla risorsa team
│  │   ├─ player/       # Tipi, servizi CRUD e componenti legati alla risorsa player
│  │   ├─ playerTeam/   # Componente form legato alla gestione dei giocatori di una squadra
│  │   ├─ game/         # Tipi, servizi CRUD e componenti legati alla risorsa game
│  │   ├─ game/         # Tipi, servizi CRUD e componenti legati alla risorsa game
│  │   ├─ teamTournament/   # Tipi, servizi CRUD e componenti legati alla risorsa teamTournament
│  │   └─ tournament/   # Tipi, servizi CRUD e componenti legati alla risorsa tournament
│  ├─ layouts/          # layout delle pagina
│  ├─ lib/              # Utilities
│  ├─ pages/            # Pagine dell'app
│  │   ├─ HistoryTournament.tsx   # Albo d'oro dei tornei conclusi
│  │   ├─ NotFoundPage.tsx    # 404
│  │   ├─ TeamPage.tsx    # Dettaglio del team con tutti i giocatori
│  │   └─ TournamentPage.tsx    # Dettaglio del torneo con tutti i match
│  ├─ .env.example          # Variabili d'ambiente d'esempio 
│  ├─ main.tsx          # File main con gestione delle rotte e dei provider 
│  └─ typed-css.d.ts    # 
├─ tsconfig*.json       # 
└─ package.json         # 
```
## Funzionamento del frontend

### Hook e stato remoto
- Le chiamate API usano wrapper in `src/lib/backend.ts` e servizi specifici per feature.
- React Query mantiene in cache le risposte e usa `useQuery` per caricare le squadre quando il dialog è aperto, evitando fetch inutili e fornendo lo stato di loading.

### Gestione dei form
- I form sono centralizzati su `react-hook-form`

### Validazione con Zod
- I form risolvono gli schemi tramite `zodResolver`, garantendo che tipi e validazione runtime restino sincronizzati.

## Installazione
1. Imposta l'URL del backend in `.env` del frontend:
   ```bash
   cd torneo_front_end
   npm install
   echo VITE_BACKEND_URL=http://localhost:8000/api > .env
   ```
2. Avvia il server di sviluppo Vite:
   ```bash
   npm run dev
   ```
3. Aprire il progetto nel browser.

## Variabili d'ambiente
- `VITE_BACKEND_URL`: endpoint base dell'API PHP.