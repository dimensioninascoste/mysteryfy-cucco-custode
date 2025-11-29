import { useParams, Link, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, Map, Camera, Volume2, Menu, Terminal } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function StoryPlayer() {
  const { id } = useParams();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const token = params.get("token");
  const userId = params.get("userId");

  const [loading, setLoading] = useState(true);
  const [textIndex, setTextIndex] = useState(0);
  const [showDebug, setShowDebug] = useState(!!token); // Show debug if token exists
  const [authStatus, setAuthStatus] = useState<"verifying" | "success" | "failed">("verifying");

  // Mock "Game Engine" loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    
    // Mock Auth Verification if token is present
    if (token) {
      setTimeout(() => setAuthStatus("success"), 2000);
    }

    return () => clearTimeout(timer);
  }, [token]);

  const storyLines = [
    "The fog hangs heavy over the Grand Canal tonight.",
    "You check your pocket watch. 11:45 PM. He's late.",
    "A sudden splash echoes from the alleyway to your left.",
    "Do you investigate?"
  ];

  const handleChoice = () => {
    if (textIndex < storyLines.length - 1) {
      setTextIndex(prev => prev + 1);
    } else {
      setTextIndex(0); // Loop for demo
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-black text-white space-y-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="font-display tracking-widest animate-pulse text-sm">LOADING ASSETS...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-black relative overflow-hidden">
      {/* Debug Overlay for "Backend" Testing */}
      <AnimatePresence>
        {showDebug && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-4 right-4 z-50"
          >
            <div className="bg-black/80 backdrop-blur-md border border-green-500/30 rounded-lg p-3 font-mono text-xs text-green-400 shadow-lg">
              <div className="flex justify-between items-center mb-2 border-b border-green-500/20 pb-1">
                 <span className="flex items-center gap-2"><Terminal className="w-3 h-3" /> BACKEND CONNECTION</span>
                 <button onClick={() => setShowDebug(false)} className="hover:text-white">x</button>
              </div>
              <div className="space-y-1">
                 <p>STORY_ID: <span className="text-white">{id}</span></p>
                 <p>USER_ID: <span className="text-white">{userId || "N/A"}</span></p>
                 <p className="truncate">TOKEN: <span className="text-white">{token ? `${token.substring(0, 15)}...` : "N/A"}</span></p>
                 <div className="flex items-center gap-2 mt-2">
                    STATUS: 
                    {authStatus === 'verifying' && <span className="text-yellow-400 animate-pulse">VERIFYING_SIGNATURE...</span>}
                    {authStatus === 'success' && <span className="text-green-400 font-bold">AUTHENTICATED (MOCK)</span>}
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mock WebView Content */}
      <div className="absolute inset-0 z-0">
        {/* This represents the PixiJS Canvas */}
        <img 
            src="https://images.unsplash.com/photo-1516919549054-e08258825f80?q=80&w=1200&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
      </div>

      {/* Native UI Overlay (Header) */}
      <div className="relative z-20 flex justify-between items-center p-4">
        <Link href={`/story/${id}`}>
          <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full">
            <Volume2 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Story Text Area (Twine-like) */}
      <div className="flex-1 relative z-10 flex flex-col justify-center px-8">
         <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <p className="text-2xl md:text-3xl font-display font-medium text-white drop-shadow-md leading-relaxed text-center text-balance">
              "{storyLines[textIndex]}"
            </p>
         </div>
      </div>

      {/* Interaction Area */}
      <div className="relative z-20 p-6 pb-10 space-y-4 bg-gradient-to-t from-black via-black/90 to-transparent pt-20">
        <div className="grid grid-cols-2 gap-4">
           <Button 
              onClick={handleChoice}
              className="h-14 bg-white/5 hover:bg-white/10 border border-white/10 text-white backdrop-blur-sm whitespace-normal leading-tight"
           >
             Investigate the noise
           </Button>
           <Button 
              onClick={handleChoice}
              className="h-14 bg-white/5 hover:bg-white/10 border border-white/10 text-white backdrop-blur-sm whitespace-normal leading-tight"
           >
             Stay hidden
           </Button>
        </div>

        {/* Native Bridge Controls (Mock) */}
        <div className="flex justify-center gap-6 pt-4 border-t border-white/5">
           <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
             <div className="p-3 rounded-full bg-white/5 border border-white/10">
               <Map className="w-5 h-5" />
             </div>
             <span className="text-[10px] uppercase tracking-wider">Map</span>
           </button>
           <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
             <div className="p-3 rounded-full bg-white/5 border border-white/10">
               <Camera className="w-5 h-5" />
             </div>
             <span className="text-[10px] uppercase tracking-wider">Scan QR</span>
           </button>
        </div>
      </div>
    </div>
  );
}
