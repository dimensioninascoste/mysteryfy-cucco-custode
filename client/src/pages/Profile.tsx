import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Volume2, Globe, LogOut, ChevronRight, CreditCard, Shield, Server } from "lucide-react";
import { Link, useLocation } from "wouter";
import { API_BASE_URL, setApiUrl } from "@/lib/api";
import { useState } from "react";

export default function Profile() {
  const [, setLocation] = useLocation();
  const [apiUrl, setApiUrlState] = useState(API_BASE_URL);
  const [isEditingApi, setIsEditingApi] = useState(false);

  const handleLogout = () => {
    setLocation("/");
  };

  const handleSaveApi = () => {
    setApiUrl(apiUrl);
    setIsEditingApi(false);
  };

  return (
    <div className="pb-24 px-6 pt-12 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold text-white">Profile</h2>
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
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider ml-1">Developer Settings</h3>
          <Card className="bg-card/50 border-white/5 divide-y divide-white/5">
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-white">
                  <Server className="w-5 h-5 text-secondary" />
                  <span>Backend API URL</span>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 text-xs text-muted-foreground hover:text-white"
                  onClick={() => isEditingApi ? handleSaveApi() : setIsEditingApi(true)}
                >
                  {isEditingApi ? "Save" : "Edit"}
                </Button>
              </div>
              
              {isEditingApi ? (
                <Input 
                  value={apiUrl}
                  onChange={(e) => setApiUrlState(e.target.value)}
                  className="h-9 bg-black/50 border-white/10 text-xs font-mono"
                />
              ) : (
                <p className="text-xs font-mono text-muted-foreground break-all bg-black/30 p-2 rounded border border-white/5">
                  {API_BASE_URL}
                </p>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider ml-1">General</h3>
          <Card className="bg-card/50 border-white/5 divide-y divide-white/5">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-white">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span>Notifications</span>
              </div>
              <Switch />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-white">
                <Volume2 className="w-5 h-5 text-muted-foreground" />
                <span>Sound Effects</span>
              </div>
              <Switch defaultChecked />
            </div>
          </Card>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider ml-1">Account</h3>
          <Card className="bg-card/50 border-white/5 divide-y divide-white/5">
             <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3 text-white">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <span>Restore Purchases</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
             <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3 text-white">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <span>Privacy Policy</span>
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
          <LogOut className="w-4 h-4 mr-2" /> Log Out
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Version 1.0.2 (Build 45)
        </p>
      </div>
    </div>
  );
}
