import { useParams, Link, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, Map, Camera, Volume2, Terminal, Lock, CreditCard } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/use-language";

// Mock Backend Data for Product IDs
const MOCK_PRODUCT_DB: Record<string, { appleId: string; googleId: string; name: string; price: string }> = {
  "1": { 
    appleId: "com.mysteryfy.venice.premium", 
    googleId: "com.mysteryfy.venice.premium", 
    name: "Venetian Masquerade Full Access",
    price: "$4.99"
  },
  "2": { 
    appleId: "com.mysteryfy.neon.premium", 
    googleId: "com.mysteryfy.neon.premium", 
    name: "Neon Rain Premium Pack",
    price: "$2.99"
  },
  "test-adv-123": {
    appleId: "com.mysteryfy.test.gold",
    googleId: "com.mysteryfy.test.gold",
    name: "Test Adventure Gold Tier",
    price: "$9.99"
  }
};

export default function StoryPlayer() {
  const { id } = useParams();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const token = params.get("token");
  const { t } = useLanguage();
  
  const [loading, setLoading] = useState(true);
  const [textIndex, setTextIndex] = useState(0);
  const [showDebug, setShowDebug] = useState(!!token);
  
  // IAP State
  const [productData, setProductData] = useState<{ appleId: string; googleId: string; name: string; price: string } | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [isProcessingPurchase, setIsProcessingPurchase] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState<"idle" | "processing" | "success" | "failed">("idle");

  // Mock "Backend" Fetch for Product Details
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    
    // Simulate fetching product details based on Adventure ID
    if (id) {
      console.log(`Fetching product details for Adventure ID: ${id}`);
      const product = MOCK_PRODUCT_DB[id] || MOCK_PRODUCT_DB["test-adv-123"]; // Fallback for demo
      setProductData(product);
    }

    return () => clearTimeout(timer);
  }, [id]);

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
      setTextIndex(0); 
    }
  };

  // Simulate Triggering a Purchase (e.g., hitting a paywall in the story)
  const triggerPurchase = () => {
    if (productData) {
      setShowPurchaseModal(true);
    }
  };

  const handleConfirmPurchase = () => {
    setIsProcessingPurchase(true);
    setPurchaseStatus("processing");

    // Simulate StoreKit/Google Billing latency
    setTimeout(() => {
      setIsProcessingPurchase(false);
      setPurchaseStatus("success");
      
      // Close modal after success message
      setTimeout(() => {
        setShowPurchaseModal(false);
        setPurchaseStatus("idle");
      }, 1500);
    }, 2000);
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
      {/* Debug Overlay */}
      <AnimatePresence>
        {showDebug && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-4 right-4 z-50 pointer-events-none"
          >
            <div className="bg-black/90 backdrop-blur-md border border-blue-500/30 rounded-lg p-3 font-mono text-xs text-blue-400 shadow-lg pointer-events-auto">
              <div className="flex justify-between items-center mb-2 border-b border-blue-500/20 pb-1">
                 <span className="flex items-center gap-2"><Terminal className="w-3 h-3" /> NATIVE BRIDGE DEBUG</span>
                 <button onClick={() => setShowDebug(false)} className="hover:text-white">x</button>
              </div>
              <div className="space-y-1">
                 <p>ADVENTURE_ID: <span className="text-white">{id}</span></p>
                 <p>TOKEN: <span className="text-white truncate block w-32">{token ? "VALID" : "NULL"}</span></p>
                 <div className="mt-2 pt-2 border-t border-blue-500/20">
                   <p className="text-gray-400 mb-1">Fetched Product IDs:</p>
                   {productData ? (
                     <>
                       <p>Apple: <span className="text-white">{productData.appleId}</span></p>
                       <p>Google: <span className="text-white">{productData.googleId}</span></p>
                     </>
                   ) : (
                     <p className="text-red-400">PRODUCT NOT FOUND</p>
                   )}
                 </div>
                 <div className="mt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-6 text-[10px] border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                      onClick={triggerPurchase}
                    >
                      Test Purchase Trigger
                    </Button>
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Layer */}
      <div className="absolute inset-0 z-0">
        <img 
            src="https://images.unsplash.com/photo-1516919549054-e08258825f80?q=80&w=1200&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
      </div>

      {/* Header */}
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

      {/* Story Text */}
      <div className="flex-1 relative z-10 flex flex-col justify-center px-8">
         <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <p className="text-2xl md:text-3xl font-display font-medium text-white drop-shadow-md leading-relaxed text-center text-balance">
              "{storyLines[textIndex]}"
            </p>
         </div>
      </div>

      {/* Footer Controls */}
      <div className="relative z-20 p-6 pb-10 space-y-4 bg-gradient-to-t from-black via-black/90 to-transparent pt-20">
        <div className="grid grid-cols-2 gap-4">
           <Button 
              onClick={handleChoice}
              className="h-14 bg-white/5 hover:bg-white/10 border border-white/10 text-white backdrop-blur-sm whitespace-normal leading-tight"
           >
             {t("story.investigate")}
           </Button>
           <Button 
              onClick={handleChoice}
              className="h-14 bg-white/5 hover:bg-white/10 border border-white/10 text-white backdrop-blur-sm whitespace-normal leading-tight"
           >
             {t("story.stayHidden")}
           </Button>
        </div>

        <div className="flex justify-center gap-6 pt-4 border-t border-white/5">
           <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
             <div className="p-3 rounded-full bg-white/5 border border-white/10">
               <Map className="w-5 h-5" />
             </div>
             <span className="text-[10px] uppercase tracking-wider">{t("story.map")}</span>
           </button>
           <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
             <div className="p-3 rounded-full bg-white/5 border border-white/10">
               <Camera className="w-5 h-5" />
             </div>
             <span className="text-[10px] uppercase tracking-wider">{t("story.scanQr")}</span>
           </button>
        </div>
      </div>

      {/* Mock IAP Modal */}
      <Dialog open={showPurchaseModal} onOpenChange={setShowPurchaseModal}>
        <DialogContent className="bg-card border-white/10 text-white sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">In-App Purchase</DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs">
              Simulating native StoreKit / Google Billing prompt
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
             <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4">
               <div className="h-12 w-12 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                 <CreditCard className="w-6 h-6" />
               </div>
               <div>
                 <p className="font-bold text-sm">{productData?.name || "Unknown Item"}</p>
                 <p className="text-xs text-muted-foreground">{productData?.price}</p>
               </div>
             </div>

             {purchaseStatus === "success" && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="bg-green-500/20 border border-green-500/50 text-green-400 p-3 rounded-lg text-center text-sm font-bold"
               >
                 {t("story.purchaseSuccess")}
               </motion.div>
             )}
          </div>

          <DialogFooter className="flex-col gap-2">
            <Button 
               className="w-full bg-blue-600 hover:bg-blue-700 text-white"
               onClick={handleConfirmPurchase}
               disabled={isProcessingPurchase || purchaseStatus === "success"}
            >
              {isProcessingPurchase ? t("story.contactingStore") : `${t("story.pay")} ${productData?.price}`}
            </Button>
            <Button 
               variant="ghost" 
               className="w-full text-muted-foreground hover:text-white"
               onClick={() => setShowPurchaseModal(false)}
               disabled={isProcessingPurchase}
            >
              {t("story.cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
