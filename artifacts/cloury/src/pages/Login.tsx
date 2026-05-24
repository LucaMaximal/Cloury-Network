import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogIn, ArrowRight } from "lucide-react";
import logoImg from "@assets/IMG_4954_1779645593363.png";

export default function Login() {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-screen pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[200px] rounded-full pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 md:p-12 bg-card/80 backdrop-blur-xl border border-border rounded-3xl shadow-2xl relative z-10"
        >
          <div className="flex flex-col items-center mb-10 text-center">
            <img src={logoImg} alt="Cloury" className="w-16 h-16 mb-6 drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]" />
            <h1 className="text-3xl font-display font-bold text-white mb-2">Willkommen zurück</h1>
            <p className="text-muted-foreground text-sm">Melde dich an, um dein Profil zu verwalten.</p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">E-Mail Adresse</label>
              <Input type="email" placeholder="name@beispiel.de" className="h-12 bg-background/50 border-border/50 focus-visible:ring-primary/50 px-4" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-slate-300">Passwort</label>
                <a href="#" className="text-xs text-primary hover:text-primary/80">Passwort vergessen?</a>
              </div>
              <Input type="password" placeholder="••••••••" className="h-12 bg-background/50 border-border/50 focus-visible:ring-primary/50 px-4" />
            </div>

            <Button className="w-full h-12 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 mt-4 shadow-[0_0_20px_rgba(0,229,255,0.3)]">
              <LogIn size={18} className="mr-2" /> Anmelden
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Noch keinen Account?{" "}
            <Link href="/register" className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-1">
              Jetzt registrieren <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
