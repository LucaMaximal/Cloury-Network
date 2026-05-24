import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus, ArrowRight } from "lucide-react";
import logoImg from "@assets/IMG_4954_1779645593363.png";

export default function Register() {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-screen pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/10 blur-[200px] rounded-full pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 md:p-12 bg-card/80 backdrop-blur-xl border border-border rounded-3xl shadow-2xl relative z-10"
        >
          <div className="flex flex-col items-center mb-10 text-center">
            <img src={logoImg} alt="Cloury" className="w-16 h-16 mb-6 drop-shadow-[0_0_15px_rgba(168,85,255,0.5)]" />
            <h1 className="text-3xl font-display font-bold text-white mb-2">Account erstellen</h1>
            <p className="text-muted-foreground text-sm">Tritt dem Cloury Network bei.</p>
          </div>

          <form className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Minecraft Name</label>
              <Input placeholder="Dein Ingame Name" className="h-12 bg-background/50 border-border/50 focus-visible:ring-accent/50 px-4" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">E-Mail Adresse</label>
              <Input type="email" placeholder="name@beispiel.de" className="h-12 bg-background/50 border-border/50 focus-visible:ring-accent/50 px-4" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Passwort</label>
              <Input type="password" placeholder="Mindestens 8 Zeichen" className="h-12 bg-background/50 border-border/50 focus-visible:ring-accent/50 px-4" />
            </div>

            <Button className="w-full h-12 text-base font-bold bg-accent text-accent-foreground hover:bg-accent/90 mt-6 shadow-[0_0_20px_rgba(168,85,255,0.3)]">
              <UserPlus size={18} className="mr-2" /> Account erstellen
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Bereits registriert?{" "}
            <Link href="/login" className="text-accent hover:text-accent/80 font-medium inline-flex items-center gap-1">
              Zum Login <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
