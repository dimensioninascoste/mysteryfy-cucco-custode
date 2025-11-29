import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import generatedBg from "@assets/generated_images/dark_noir_mysterious_background_with_fog_and_neon.png";
import { Apple, Mail } from "lucide-react";

// Mock Google Icon since Lucide doesn't have it
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M12.48 10.92v3.28h7.88c-.3 1.66-1.42 3.54-3.79 3.54-2.37 0-4.39-1.96-4.39-4.42s2.02-4.42 4.39-4.42c1.29 0 2.38.56 2.99 1.14l2.54-2.54C20.67 5.91 18.67 4.76 15.5 4.76 10.81 4.76 7 8.57 7 13.26s3.81 8.5 8.5 8.5c4.9 0 8.18-3.44 8.18-8.33 0-.62-.06-1.16-.16-1.51H12.48z" />
  </svg>
);

export default function Auth() {
  const [, setLocation] = useLocation();

  const handleLogin = () => {
    setLocation("/dashboard");
  };

  return (
    <div className="relative h-full flex flex-col justify-end pb-12 px-6">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={generatedBg} 
          alt="Background" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="relative z-10 space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-5xl font-display font-bold text-white tracking-tighter drop-shadow-lg">
            MYSTERYFY
          </h1>
          <p className="text-muted-foreground text-lg font-light tracking-wide">
            Unravel the truth.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <Button 
            variant="outline" 
            className="w-full h-12 text-base border-white/10 bg-white/5 hover:bg-white/10 hover:text-white backdrop-blur-sm"
            onClick={handleLogin}
          >
            <Apple className="mr-2 h-5 w-5" />
            Sign in with Apple
          </Button>
          <Button 
            variant="outline" 
            className="w-full h-12 text-base border-white/10 bg-white/5 hover:bg-white/10 hover:text-white backdrop-blur-sm"
            onClick={handleLogin}
          >
            <GoogleIcon />
            <span className="ml-2">Sign in with Google</span>
          </Button>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
           <Button 
            className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_-5px_theme('colors.primary')]"
            onClick={handleLogin}
          >
            <Mail className="mr-2 h-5 w-5" />
            Create Account
          </Button>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
