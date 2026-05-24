import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Search, ShieldAlert, CheckCircle2, XCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ruleCategories = [
  {
    id: "general",
    title: "Allgemeine Regeln",
    rules: [
      "Behandle andere Spieler stets mit Respekt. Beleidigungen, Diskriminierung und Rassismus werden nicht toleriert.",
      "Werbung für andere Minecraft-Server, Discord-Server oder Webseiten ist strengstens untersagt.",
      "Spam, Capslock und unangebrachte Ausdrucksweisen im öffentlichen Chat sind zu unterlassen.",
      "Das Ausnutzen von Bugs oder Glitches ist verboten und muss umgehend dem Team gemeldet werden."
    ]
  },
  {
    id: "client",
    title: "Client-Modifikationen",
    rules: [
      "Hacks, Cheats und andere unerlaubte Client-Modifikationen (z.B. X-Ray, Killaura, AutoClicker) führen zu einem permanenten Bann.",
      "Erlaubte Mods: OptiFine, LabyMod, Minimap (ohne Radar-Entities), ArmorStatus, StatusEffect.",
      "Die Nutzung von Makros oder externen Programmen, die Spielvorteile verschaffen, ist verboten."
    ]
  },
  {
    id: "punishments",
    title: "Strafen & Moderation",
    rules: [
      "Das Team behält sich das Recht vor, Spieler bei Regelverstößen temporär oder permanent vom Netzwerk auszuschließen.",
      "Das Umgehen eines Banns (Bannumgehung) mit alternativen Accounts führt zum Bann aller Accounts.",
      "Diskussionen über Sanktionen werden nicht im öffentlichen Chat geführt. Nutze dafür das Support-System."
    ]
  }
];

export default function Rules() {
  return (
    <Layout>
      <div className="pt-32 pb-24 min-h-screen bg-background relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-6 max-w-4xl relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-4"
            >
              <ShieldAlert size={14} />
              <span>Netzwerk Richtlinien</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-white"
            >
              Das <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Regelwerk</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg mb-8"
            >
              Um allen Spielern ein faires und angenehmes Spielerlebnis zu garantieren, gelten auf dem gesamten Netzwerk folgende Richtlinien.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative max-w-xl mx-auto"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input 
                type="text" 
                placeholder="Regeln durchsuchen..." 
                className="w-full bg-card/50 border border-border rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors backdrop-blur-md"
              />
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {ruleCategories.map((category, idx) => (
              <Accordion key={category.id} type="single" collapsible defaultValue={idx === 0 ? category.id : undefined} className="bg-card border border-border rounded-xl overflow-hidden shadow-lg">
                <AccordionItem value={category.id} className="border-none">
                  <AccordionTrigger className="px-6 py-5 hover:bg-white/5 transition-colors font-display font-semibold text-lg text-white data-[state=open]:border-b data-[state=open]:border-border/50">
                    {category.title}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 bg-background/50">
                    <ul className="space-y-4">
                      {category.rules.map((rule, ruleIdx) => (
                        <li key={ruleIdx} className="flex gap-4">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-mono text-xs mt-0.5">
                            {ruleIdx + 1}
                          </span>
                          <p className="text-muted-foreground leading-relaxed">{rule}</p>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 p-6 rounded-xl bg-destructive/10 border border-destructive/20 flex flex-col md:flex-row items-center gap-6"
          >
            <XCircle className="text-destructive w-12 h-12 flex-shrink-0" />
            <div>
              <h3 className="text-white font-semibold text-lg mb-1">Unwissenheit schützt vor Strafe nicht!</h3>
              <p className="text-muted-foreground text-sm">
                Mit dem Betreten des Cloury Netzwerks akzeptierst du automatisch diese Regeln. Das Team behält sich vor, das Regelwerk jederzeit anzupassen.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </Layout>
  );
}
