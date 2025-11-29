import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Users, Share2, Clock, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";

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
    rating: 4.2,
    location: "Paris -> Istanbul"
  }
};

export default function StoryDetail() {
  const { id } = useParams();
  const story = STORIES[id as keyof typeof STORIES] || STORIES["1"];

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
            <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50 backdrop-blur-md">
              {story.type}
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
          <Link href={`/play/${id}`}>
            <Button className="w-full h-14 text-lg font-semibold bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] rounded-xl">
              <Play className="w-5 h-5 mr-2 fill-current" /> Play Solo
            </Button>
          </Link>
          
          <Button variant="outline" className="w-full h-12 border-white/10 bg-white/5 hover:bg-white/10 hover:text-white text-muted-foreground rounded-xl">
            <Users className="w-5 h-5 mr-2" /> Create Party (Multiplayer)
          </Button>
        </div>
      </div>
    </div>
  );
}
