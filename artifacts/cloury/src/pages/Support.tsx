import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LifeBuoy, MessageSquare, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Support() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Ticket erstellt",
      description: "Wir werden uns schnellstmöglich darum kümmern.",
    });
    // In a real app, this would use a mutation to create the ticket
  };

  return (
    <Layout>
      <div className="pt-32 pb-24 min-h-screen bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 max-w-5xl relative z-10">
          
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-4"
            >
              <LifeBuoy size={14} />
              <span>Support Center</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-white"
            >
              Wie können wir <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">helfen?</span>
            </motion.h1>
          </div>

          <div className="grid md:grid-cols-5 gap-12">
            
            {/* Quick Links & Info */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="md:col-span-2 space-y-6"
            >
              <div className="bg-card border border-border p-6 rounded-2xl">
                <h3 className="text-lg font-display font-bold text-white mb-2">Schnellhilfe</h3>
                <p className="text-muted-foreground text-sm mb-6">Oft lassen sich Probleme ohne Ticket klären. Schau im Wiki oder Discord vorbei.</p>
                <div className="space-y-3">
                  <a href="/wiki" className="flex items-center gap-3 p-3 rounded-xl bg-background hover:bg-white/5 border border-border transition-colors text-sm text-white">
                    <span className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center">1</span>
                    Wiki durchsuchen
                  </a>
                  <a href="https://discord.gg/cloury" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-[#5865F2]/10 hover:bg-[#5865F2]/20 border border-[#5865F2]/20 transition-colors text-sm text-white">
                    <span className="w-8 h-8 rounded-lg bg-[#5865F2] text-white flex items-center justify-center"><MessageSquare size={16} /></span>
                    Discord Community
                  </a>
                </div>
              </div>

              <div className="bg-card/50 border border-border p-6 rounded-2xl">
                <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider text-muted-foreground">Antwortzeiten</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex justify-between"><span>Kaufprobleme:</span> <span className="text-white">~2 Stunden</span></li>
                  <li className="flex justify-between"><span>Bug Reports:</span> <span className="text-white">~24 Stunden</span></li>
                  <li className="flex justify-between"><span>Allgemein:</span> <span className="text-white">~12 Stunden</span></li>
                </ul>
              </div>
            </motion.div>

            {/* Ticket Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="md:col-span-3 bg-card border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full" />
              
              <h2 className="text-2xl font-display font-bold text-white mb-6 relative z-10">Ticket erstellen</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Minecraft Name</label>
                    <Input placeholder="Dein Ingame Name" className="bg-background border-border" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Kategorie</label>
                    <Select>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Wähle eine Kategorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shop">Shop / Käufe</SelectItem>
                        <SelectItem value="bug">Bug Report</SelectItem>
                        <SelectItem value="player">Spieler melden</SelectItem>
                        <SelectItem value="general">Allgemeine Frage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Betreff</label>
                  <Input placeholder="Kurze Beschreibung deines Anliegens" className="bg-background border-border" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Beschreibung</label>
                  <Textarea 
                    placeholder="Beschreibe dein Problem so detailliert wie möglich..." 
                    className="min-h-[150px] bg-background border-border resize-none" 
                  />
                </div>

                <Button type="submit" className="w-full h-12 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2">
                  <Send size={18} /> Ticket absenden
                </Button>
              </form>
            </motion.div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
