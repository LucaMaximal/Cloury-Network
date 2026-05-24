import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import Wiki from "@/pages/Wiki";
import Rules from "@/pages/Rules";
import Ranks from "@/pages/Ranks";
import Leaderboard from "@/pages/Leaderboard";
import News from "@/pages/News";
import NewsArticle from "@/pages/NewsArticle";
import Events from "@/pages/Events";
import Profile from "@/pages/Profile";
import Support from "@/pages/Support";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/wiki" component={Wiki} />
      <Route path="/rules" component={Rules} />
      <Route path="/ranks" component={Ranks} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/news" component={News} />
      <Route path="/news/:id" component={NewsArticle} />
      <Route path="/events" component={Events} />
      <Route path="/profile/:username" component={Profile} />
      <Route path="/support" component={Support} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
