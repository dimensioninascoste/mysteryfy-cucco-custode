import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Volume2, Globe, LogOut, ChevronRight, CreditCard, Shield, Server } from "lucide-react";
import { Link, useLocation } from "wouter";
import { API_BASE_URL } from "@/lib/api";
import { useLanguage } from "@/hooks/use-language";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const handleLogout = () => {
    setLocation("/");
  };

  return (
    <div className="pb-24 px-6 pt-12 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold text-white">{t("profile.title")}</h2>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent border border-white/10">
        <Avatar className="w-16 h-16 border-2 border-primary">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-bold text-white">John Doe</h3>
          <p className="text-sm text-muted-foreground">Detective Lvl. 5</p>
        </div>
      </div>

      {/* Settings Groups */}
      <div className="space-y-6">
        
        <div className="space-y-3">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider ml-1">{t("profile.developerInfo")}</h3>
          <Card className="bg-card/50 border-white/5">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-white">
                <Server className="w-5 h-5 text-secondary" />
                <span>{t("profile.backendConnected")}</span>
              </div>
              <span className="text-xs font-mono text-muted-foreground bg-black/30 px-2 py-1 rounded">
                {API_BASE_URL}
              </span>
            </div>
          </Card>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider ml-1">{t("profile.general")}</h3>
          <Card className="bg-card/50 border-white/5 divide-y divide-white/5">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-white">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span>{t("profile.notifications")}</span>
              </div>
              <Switch />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-white">
                <Volume2 className="w-5 h-5 text-muted-foreground" />
                <span>{t("profile.soundEffects")}</span>
              </div>
              <Switch defaultChecked />
            </div>
            
            {/* Language Switcher */}
            <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3 text-white">
                <Globe className="w-5 h-5 text-muted-foreground" />
                <span>{t("profile.language")}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm cursor-pointer hover:text-white">
                    {language === "en" ? "English" : "Italiano"} <ChevronRight className="w-4 h-4" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-white/10 text-white">
                  <DropdownMenuItem onClick={() => setLanguage("en")}>
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage("it")}>
                    Italiano
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider ml-1">{t("profile.account")}</h3>
          <Card className="bg-card/50 border-white/5 divide-y divide-white/5">
             <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3 text-white">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <span>{t("profile.restorePurchases")}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
             <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3 text-white">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <span>{t("profile.privacyPolicy")}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </Card>
        </div>

        <Button 
          variant="destructive" 
          className="w-full h-12 bg-destructive/20 text-destructive hover:bg-destructive/30 border border-destructive/50"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" /> {t("profile.logOut")}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Version 1.0.2 (Build 45)
        </p>
      </div>
    </div>
  );
}
