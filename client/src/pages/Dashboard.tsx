import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lock, Users, MapPin, Clock, Star, UserPlus } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/use-language";

// Mock Data
const STORIES = [
  {
    id: "1",
    title: "The Venetian Masquerade",
    description: "A diplomat vanishes during the Carnival. Navigate the canals and secrets of Venice to find him before dawn.",
    image: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?q=80&w=800&auto=format&fit=crop",
    tags: ["Mystery", "Historical", "Puzzle"],
    difficulty: "Hard",
    duration: "2h 30m",
    type: "Premium",
    rating: 4.8
  },
  {
    id: "2",
    title: "Neon Rain",
    description: "In 2084, a sentient AI is accused of murder. As a detective, you must decide: glitch or evolution?",
    image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=800&auto=format&fit=crop",
    tags: ["Sci-Fi", "Thriller", "Noir"],
    difficulty: "Medium",
    duration: "1h 45m",
    type: "Free",
    rating: 4.5
  },
  {
    id: "3",
    title: "The Midnight Train",
    description: "A murder on the Orient Express, reimagined. Everyone is a suspect, and the train never stops.",
    image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=800&auto=format&fit=crop",
    tags: ["Classic", "Crime", "Solo"],
    difficulty: "Easy",
    duration: "45m",
    type: "Free",
    rating: 4.2
  }
];

export default function Dashboard() {
  const { t } = useLanguage();

  return (
    <div className="pb-24 px-6 pt-12 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">{t("dashboard.cases")}</h2>
          <p className="text-muted-foreground text-sm">{t("dashboard.selectAssignment")}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/join-room">
            <Button size="sm" variant="outline" className="h-9 border-white/10 bg-white/5 hover:bg-white/10 text-xs">
              <UserPlus className="w-3 h-3 mr-2" /> {t("dashboard.joinParty")}
            </Button>
          </Link>
          <div className="h-9 px-3 rounded-md bg-primary/20 border border-primary/50 flex items-center justify-center text-primary font-bold text-xs">
            {t("dashboard.level")} 5
          </div>
        </div>
      </div>

      {/* Featured Carousel (Mock) */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t("dashboard.featuredCase")}</h3>
        <Link href={`/story/${STORIES[0].id}`}>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative aspect-[16/10] rounded-xl overflow-hidden border border-white/10 shadow-lg cursor-pointer group"
          >
            <img src={STORIES[0].image} alt="Featured" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-5 w-full">
              <div className="flex justify-between items-end">
                <div>
                  <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-2 border-0">
                    <Star className="w-3 h-3 mr-1 fill-current" /> {t("dashboard.premium")}
                  </Badge>
                  <h3 className="text-xl font-display font-bold text-white leading-none mb-1">{STORIES[0].title}</h3>
                  <div className="flex items-center text-xs text-gray-300 gap-3 mt-2">
                    <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {STORIES[0].duration}</span>
                    <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> Venice</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </Link>
      </div>

      {/* List */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t("dashboard.availableNow")}</h3>
        <div className="grid gap-4">
          {STORIES.slice(1).map((story, i) => (
            <Link key={story.id} href={`/story/${story.id}`}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-card/50 border-white/5 overflow-hidden hover:bg-card/80 transition-colors cursor-pointer">
                  <div className="flex h-28">
                    <div className="w-28 h-full shrink-0">
                      <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3 flex flex-col justify-between grow">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-display font-semibold text-white text-sm">{story.title}</h4>
                          {story.type === 'Premium' && <Lock className="w-3 h-3 text-secondary" />}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{story.description}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {story.tags.map(tag => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
