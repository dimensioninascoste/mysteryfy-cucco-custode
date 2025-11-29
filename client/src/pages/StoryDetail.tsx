import { useParams, Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, Play, Users, Share2, Clock, MapPin, Star, Lock, CreditCard } from "lucide-react";
import { useState } from "react";

// Reusing mock data for simplicity
const STORIES = {
  "1": {
    title: "The Venetian Masquerade",
    description: "A diplomat vanishes during the Carnival. Navigate the canals and secrets of Venice to find him before dawn. In this immersive adventure, you will need to use real-world maps and solve cryptic puzzles left behind by the kidnappers.",
    image: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?q=80&w=800&auto=format&fit=crop",
    tags: ["Mystery", "Historical", "Puzzle"],
    difficulty: "Hard",
    duration: "2h 30m",
    type: "Premium",
    price: "$4.99",
    rating: 4.8,
    location: "Venice, Italy"
  },
  "2": {
    title: "Neon Rain",
    description: "In 2084, a sentient AI is accused of murder. As a detective, you must decide: glitch or evolution?",
    image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=800&auto=format&fit=crop",
    tags: ["Sci-Fi", "Thriller", "Noir"],
    difficulty: "Medium",
    duration: "1h 45m",
    type: "Free",
    price: "Free",
    rating: 4.5,
    location: "Neo-Tokyo"
  },
  "3": {
    title: "The Midnight Train",
    description: "A murder on the Orient Express, reimagined. Everyone is a suspect, and the train never stops.",
    image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=800&auto=format&fit=crop",
    tags: ["Classic", "Crime", "Solo"],
    difficulty: "Easy",
    duration: "45m",
    type: "Free",
    price: "Free",
    rating: 4.2,
    location: "Paris -> Istanbul"
  }
};

export default function StoryDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const story = STORIES[id as keyof typeof STORIES] || STORIES["1"];
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handlePlay = () => {
    if (story.type === "Premium") {
      setShowPurchaseModal(true);
    } else {
      setLocation(`/play/${id}`);
    }
  };

  const handlePurchase = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setShowPurchaseModal(false);
      setLocation(`/play/${id}`);
    }, 2000);
  };

  return (
    <div className="relative min-h-full pb-24">
      {/* Hero Image */}
      <div className="h-[40vh] relative w-full">
        <img src={story.image} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background" />
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="absolute top-4 left-4 text-white hover:bg-black/20 rounded-full">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
      </div>

      {/* Content */}
      <div className="px-6 -mt-12 relative z-10 space-y-6">
        <div>
          <div className="flex justify-between items-start mb-2">
            <Badge className={`
              ${story.type === 'Premium' ? 'bg-secondary text-secondary-foreground' : 'bg-primary/20 text-primary'} 
              hover:bg-opacity-80 border border-white/10 backdrop-blur-md
            `}>
              {story.type === 'Premium' ? 'Premium Case' : 'Free Case'}
            </Badge>
            <div className="flex items-center text-yellow-500 text-sm font-bold bg-black/50 px-2 py-1 rounded backdrop-blur-md">
              <Star className="w-4 h-4 fill-current mr-1" /> {story.rating}
            </div>
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2 leading-tight">{story.title}</h1>
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
             <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {story.duration}</span>
             <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {story.location}</span>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed font-light text-sm">
            {story.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
             {story.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs text-muted-foreground border-white/10 bg-white/5">
                  {tag}
                </Badge>
             ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-4">
          <Button 
            className="w-full h-14 text-lg font-semibold bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] rounded-xl"
            onClick={handlePlay}
          >
            {story.type === 'Premium' ? (
               <><Lock className="w-5 h-5 mr-2" /> Unlock for {story.price}</>
            ) : (
               <><Play className="w-5 h-5 mr-2 fill-current" /> Play Solo</>
            )}
          </Button>
          
          <Link href="/create-room">
            <Button variant="outline" className="w-full h-12 border-white/10 bg-white/5 hover:bg-white/10 hover:text-white text-muted-foreground rounded-xl mt-3">
              <Users className="w-5 h-5 mr-2" /> Create Party (Multiplayer)
            </Button>
          </Link>
        </div>
      </div>

      {/* Purchase Modal */}
      <Dialog open={showPurchaseModal} onOpenChange={setShowPurchaseModal}>
        <DialogContent className="bg-card border-white/10 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Unlock Case File</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Purchase full access to "{story.title}" to reveal the truth.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
             <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between border border-white/5">
                <div className="flex items-center gap-3">
                   <div className="bg-secondary/20 p-2 rounded-lg text-secondary">
                      <Lock className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="font-bold text-white">{story.title}</p>
                      <p className="text-xs text-muted-foreground">Full Access • Lifetime</p>
                   </div>
                </div>
                <span className="font-mono text-lg font-bold text-white">{story.price}</span>
             </div>
          </div>
          <DialogFooter className="flex-col gap-2 sm:gap-0">
            <Button 
               className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-base"
               onClick={handlePurchase}
               disabled={processing}
            >
              {processing ? "Processing..." : "Confirm Purchase"}
            </Button>
            <Button 
               variant="ghost" 
               className="w-full text-muted-foreground hover:text-white"
               onClick={() => setShowPurchaseModal(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
