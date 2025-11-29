import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Copy, Share2, Users, Play } from "lucide-react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function CreateRoom() {
  const [location, setLocation] = useLocation();
  const [players, setPlayers] = useState([
    { id: 1, name: "Detective You (Host)", avatar: "🕵️‍♂️" }
  ]);
  
  // Mock players joining
  useEffect(() => {
    const timer = setTimeout(() => {
      setPlayers(prev => [...prev, { id: 2, name: "Watson_22", avatar: "🧐" }]);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const roomCode = "X7K9P";

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    // In a real app, show toast
  };

  return (
    <div className="h-full flex flex-col p-6 pt-12 space-y-8 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 left-0 w-full h-64 bg-primary/10 blur-[100px] -z-10" />

      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-white">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-2xl font-display font-bold text-white">Lobby</h1>
      </div>

      <div className="space-y-6 flex-1">
        {/* Room Code Card */}
        <div className="text-center space-y-4">
          <p className="text-muted-foreground text-sm uppercase tracking-widest">Room Code</p>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md"
          >
            <h2 className="text-5xl font-mono font-bold text-primary tracking-[0.2em] neon-glow mb-4">{roomCode}</h2>
            <div className="flex justify-center gap-3">
              <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5 text-white" onClick={copyCode}>
                <Copy className="w-4 h-4 mr-2" /> Copy
              </Button>
              <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5 text-white">
                <Share2 className="w-4 h-4 mr-2" /> Share
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Players List */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
             <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Team ({players.length}/4)</h3>
             {players.length < 2 && <span className="text-xs text-primary animate-pulse">Waiting for players...</span>}
          </div>
          
          <div className="grid gap-3">
            {players.map((player, i) => (
              <motion.div
                key={player.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-3 rounded-xl bg-card border border-white/5"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl">
                  {player.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{player.name}</p>
                  <p className="text-xs text-muted-foreground">{i === 0 ? "Host" : "Guest"}</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_theme('colors.green.500')]" />
              </motion.div>
            ))}
             {/* Empty Slots */}
             {[...Array(4 - players.length)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-white/5 border-dashed opacity-50">
                   <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                     <Users className="w-5 h-5 text-muted-foreground" />
                   </div>
                   <p className="text-sm text-muted-foreground">Waiting...</p>
                </div>
             ))}
          </div>
        </div>
      </div>

      <Button 
        className="w-full h-14 text-lg font-semibold bg-primary text-white hover:bg-primary/90 shadow-[0_0_20px_-5px_theme('colors.primary')] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={players.length < 2}
        onClick={() => setLocation('/play/1')}
      >
        <Play className="w-5 h-5 mr-2 fill-current" /> Start Adventure
      </Button>
    </div>
  );
}
