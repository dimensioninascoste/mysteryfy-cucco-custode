import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/use-language";

export default function JoinRoom() {
  const [, setLocation] = useLocation();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const { t } = useLanguage();

  const handleJoin = () => {
    if (code.length < 5) {
      setError(t("multiplayer.invalidCode"));
      return;
    }
    // Mock validation
    if (code.toUpperCase() === "ERROR") {
      setError(t("multiplayer.roomNotFound"));
    } else {
      setLocation("/play/1");
    }
  };

  return (
    <div className="h-full flex flex-col p-6 pt-12 space-y-8 relative">
       <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/10 blur-[100px] -z-10" />

      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-white">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-2xl font-display font-bold text-white">{t("multiplayer.joinParty")}</h1>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-8">
        <div className="space-y-2 text-center">
           <h2 className="text-lg text-white font-medium">{t("multiplayer.enterCode")}</h2>
           <p className="text-muted-foreground text-sm">{t("multiplayer.askHost")}</p>
        </div>

        <div className="space-y-4">
          <Input 
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError("");
            }}
            maxLength={5}
            placeholder="ABC12"
            className="h-20 text-center text-4xl font-mono tracking-[0.5em] uppercase bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 text-white placeholder:text-white/10 rounded-xl"
          />
          
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive text-center text-sm font-medium"
            >
              {error}
            </motion.p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <Button 
          className="w-full h-14 text-lg font-semibold bg-white text-black hover:bg-gray-200 rounded-xl"
          onClick={handleJoin}
        >
          {t("multiplayer.joinAdventure")} <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
