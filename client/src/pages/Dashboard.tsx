import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, UserPlus, Clock, MapPin, Star, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/use-language";
import { useQuery } from "@tanstack/react-query";
import { api, Adventure } from "@/lib/api";

export default function Dashboard() {
  const { t, language } = useLanguage();

  const {
    data: adventures,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["adventures"],
    queryFn: api.adventures.list,
  });

  // Debugging: Log the data to console to inspect structure
  if (adventures) {
    console.log("Adventures Data:", adventures);
  }

  // Robust helper to get localized content
  const getLocalized = (obj: any) => {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    // Handle case where localized object might be missing keys or have different structure
    if (language === "it" && obj.it) return obj.it;
    if (obj.en) return obj.en;
    // Fallback to first available key if neither en nor it exists
    const keys = Object.keys(obj);
    if (keys.length > 0) return obj[keys[0]];
    return "";
  };

  const getPriceDisplay = (price: string) => {
    // Ensure price is treated as string
    const p = String(price);
    return p === "0.00" || p === "0" ? t("dashboard.free") : p;
  };

  const isPremium = (price: string) => {
    const p = String(price);
    return p !== "0.00" && p !== "0";
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse">Loading cases...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4 p-6 text-center">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <p className="text-white font-medium">Failed to load adventures.</p>
        <p className="text-muted-foreground text-sm">
          {(error as Error).message}
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  // Fallback if array is empty or undefined
  const list = adventures || [];

  // Find featured adventure by "featured" tag
  const featured =
    list.find((a) => a.tags && a.tags.includes("#inevidenza")) || list[0];
  const others = list.filter((a) => a.id !== featured?.id);

  return (
    <div className="pb-24 px-6 pt-12 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">
            {t("dashboard.cases")}
          </h2>
          <p className="text-muted-foreground text-sm">
            {t("dashboard.selectAssignment")}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/join-room">
            <Button
              size="sm"
              variant="outline"
              className="h-9 border-white/10 bg-white/5 hover:bg-white/10 text-xs"
            >
              <UserPlus className="w-3 h-3 mr-2" /> {t("dashboard.joinParty")}
            </Button>
          </Link>
          <div className="h-9 px-3 rounded-md bg-primary/20 border border-primary/50 flex items-center justify-center text-primary font-bold text-xs">
            {t("dashboard.level")} 5
          </div>
        </div>
      </div>

      {/* Featured Case */}
      {featured && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {t("dashboard.featuredCase")}
          </h3>
          <Link href={`/story/${featured.id}`}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative aspect-[16/10] rounded-xl overflow-hidden border border-white/10 shadow-lg cursor-pointer group"
            >
              {/* Use cover_image for featured */}
              <img
                src={featured.cover_image || featured.thumbnail}
                alt={getLocalized(featured.name)}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5 w-full">
                <div className="flex justify-between items-end">
                  <div>
                    {isPremium(featured.price) && (
                      <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-2 border-0">
                        <Star className="w-3 h-3 mr-1 fill-current" />{" "}
                        {getPriceDisplay(featured.price)}
                      </Badge>
                    )}
                    {!isPremium(featured.price) && (
                      <Badge className="bg-primary/20 text-primary hover:bg-primary/30 mb-2 border-0">
                        {t("dashboard.free")}
                      </Badge>
                    )}
                    <h3 className="text-xl font-display font-bold text-white leading-none mb-1">
                      {getLocalized(featured.name)}
                    </h3>
                    <div className="flex items-center text-xs text-gray-300 gap-3 mt-2">
                      {featured.duration && (
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" /> {featured.duration}
                        </span>
                      )}
                      {featured.category && (
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />{" "}
                          {featured.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {t("dashboard.availableNow")}
        </h3>
        <div className="grid gap-4">
          {others.map((story, i) => (
            <Link key={story.id} href={`/story/${story.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-card/50 border-white/5 overflow-hidden hover:bg-card/80 transition-colors cursor-pointer">
                  <div className="flex h-28">
                    <div className="w-28 h-full shrink-0">
                      {/* Use thumbnail for list items */}
                      <img
                        src={story.thumbnail}
                        alt={getLocalized(story.name)}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 flex flex-col justify-between grow">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-display font-semibold text-white text-sm">
                            {getLocalized(story.name)}
                          </h4>
                          {isPremium(story.price) && (
                            <Lock className="w-3 h-3 text-secondary" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {getLocalized(story.short_description)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {story.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5"
                          >
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
