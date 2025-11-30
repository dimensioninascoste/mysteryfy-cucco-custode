import { useParams, Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, Play, Users, Clock, MapPin, Star, Lock, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function StoryDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { t, language } = useLanguage();

  const { data: story, isLoading, error } = useQuery({
    queryKey: ["adventure", id],
    queryFn: () => api.adventures.get(id!)
  });

  const getLocalized = (obj: { en: string; it: string } | undefined) => {
    if (!obj) return "";
    return language === "it" ? obj.it : obj.en;
  };

  const isPremium = (price: string) => price !== "0.00";

  const handlePlay = () => {
    if (story && isPremium(story.price)) {
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

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse">Loading mystery...</p>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4 p-6 text-center">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <p className="text-white font-medium">Adventure not found.</p>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-full pb-24">
      {/* Hero Image */}
      <div className="h-[40vh] relative w-full">
        <img src={story.cover_image || story.thumbnail} className="w-full h-full object-cover" />
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
              ${isPremium(story.price) ? 'bg-secondary text-secondary-foreground' : 'bg-primary/20 text-primary'} 
              hover:bg-opacity-80 border border-white/10 backdrop-blur-md
            `}>
              {isPremium(story.price) ? t("story.premiumCase") : t("story.freeCase")}
            </Badge>
            {story.rating && (
              <div className="flex items-center text-yellow-500 text-sm font-bold bg-black/50 px-2 py-1 rounded backdrop-blur-md">
                <Star className="w-4 h-4 fill-current mr-1" /> {story.rating}
              </div>
            )}
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2 leading-tight">{getLocalized(story.name)}</h1>
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
             {story.duration && <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {story.duration}</span>}
             {story.category && <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {story.category}</span>}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed font-light text-sm">
            {getLocalized(story.long_description)}
          </p>
          
          <div className="flex flex-wrap gap-2">
             {story.tags?.map(tag => (
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
            {isPremium(story.price) ? (
               <><Lock className="w-5 h-5 mr-2" /> {t("story.unlockFor")} {story.price}</>
            ) : (
               <><Play className="w-5 h-5 mr-2 fill-current" /> {t("story.playSolo")}</>
            )}
          </Button>
          
          <Link href="/create-room">
            <Button variant="outline" className="w-full h-12 border-white/10 bg-white/5 hover:bg-white/10 hover:text-white text-muted-foreground rounded-xl mt-3">
              <Users className="w-5 h-5 mr-2" /> {t("story.createParty")}
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
              Purchase full access to "{getLocalized(story.name)}" to reveal the truth.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
             <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between border border-white/5">
                <div className="flex items-center gap-3">
                   <div className="bg-secondary/20 p-2 rounded-lg text-secondary">
                      <Lock className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="font-bold text-white">{getLocalized(story.name)}</p>
                      <p className="text-xs text-muted-foreground">{t("story.fullAccess")} • {t("story.lifetime")}</p>
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
              {processing ? t("story.processing") : t("story.confirmPurchase")}
            </Button>
            <Button 
               variant="ghost" 
               className="w-full text-muted-foreground hover:text-white"
               onClick={() => setShowPurchaseModal(false)}
            >
              {t("story.cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
