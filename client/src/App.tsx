import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/Layout";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import StoryDetail from "@/pages/StoryDetail";
import StoryPlayer from "@/pages/StoryPlayer";
import CreateRoom from "@/pages/CreateRoom";
import JoinRoom from "@/pages/JoinRoom";
import Profile from "@/pages/Profile";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Auth} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/story/:id" component={StoryDetail} />
        <Route path="/play/:id" component={StoryPlayer} />
        <Route path="/create-room" component={CreateRoom} />
        <Route path="/join-room" component={JoinRoom} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
