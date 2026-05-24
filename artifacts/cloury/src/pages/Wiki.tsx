import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Book, Search, Terminal, Shield, Zap, Globe, Cpu } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const sidebarCategories = [
  {
    title: "Getting Started",
    icon: Globe,
    links: ["Willkommen bei Cloury", "Regeln & Richtlinien", "Wie trete ich bei?"]
  },
  {
    title: "Game Modes",
    icon: Zap,
    links: ["Cloud Factions", "Cyber Wars", "Neon Survival", "Arcade"]
  },
  {
    title: "Systems",
    icon: Cpu,
    links: ["Modular Sync", "Economy System", "Friends & Parties", "Achievements"]
  },
  {
    title: "Ranks & Perks",
    icon: Shield,
    links: ["Spieler Ränge", "Team Ränge", "Cosmetics"]
  },
  {
    title: "Developer API",
    icon: Terminal,
    links: ["Einführung", "Authentication", "Endpoints", "Webhooks"]
  }
];

export default function Wiki() {
  const [activePage, setActivePage] = useState("Willkommen bei Cloury");

  return (
    <Layout>
      <div className="pt-24 min-h-screen bg-background">
        <div className="container mx-auto px-4 md:px-6">
          
          <div className="mb-12 pt-8">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Cloury <span className="text-primary">Wiki</span>
            </h1>
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input 
                type="text" 
                placeholder="Wiki durchsuchen..." 
                className="bg-card/50 border-border rounded-xl py-6 pl-12 pr-4 text-base focus-visible:ring-primary/50"
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 pb-24">
            
            {/* Sidebar Navigation */}
            <motion.aside 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full lg:w-64 flex-shrink-0"
            >
              <div className="sticky top-32 space-y-8">
                {sidebarCategories.map((category, idx) => (
                  <div key={idx}>
                    <h3 className="font-display font-semibold text-white mb-3 flex items-center gap-2">
                      <category.icon size={16} className="text-primary" />
                      {category.title}
                    </h3>
                    <ul className="space-y-2 border-l border-border/50 ml-2 pl-4">
                      {category.links.map((link) => (
                        <li key={link}>
                          <button 
                            onClick={() => setActivePage(link)}
                            className={`text-sm w-full text-left transition-colors ${
                              activePage === link 
                                ? "text-primary font-medium" 
                                : "text-muted-foreground hover:text-white"
                            }`}
                          >
                            {link}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.aside>

            {/* Content Area */}
            <motion.main 
              key={activePage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 min-w-0"
            >
              <div className="prose prose-invert prose-p:text-muted-foreground prose-headings:font-display prose-headings:text-white prose-a:text-primary max-w-none bg-card/30 border border-border/50 p-8 md:p-12 rounded-2xl backdrop-blur-sm">
                <h1>{activePage}</h1>
                <p className="lead">
                  Willkommen in der offiziellen Dokumentation des Cloury Netzwerks. Hier findest du alle Informationen zu unseren Spielmodi, Systemen und Richtlinien.
                </p>
                <div className="h-px w-full bg-border/50 my-8" />
                <h2>Einführung</h2>
                <p>
                  Cloury ist nicht einfach nur ein weiterer Minecraft Server. Es ist eine von Grund auf neu entwickelte Plattform, die auf modernsten Cloud-Technologien basiert. Unsere Infrastruktur erlaubt es uns, Features zu bieten, die auf traditionellen Servern nicht möglich wären.
                </p>
                <h3>Was uns besonders macht</h3>
                <ul>
                  <li><strong>Latenzfreie Synchronisation:</strong> Deine Daten werden in Echtzeit über alle Server hinweg synchronisiert.</li>
                  <li><strong>Modulare Systeme:</strong> Updates und neue Features können ohne Serverneustart eingespielt werden.</li>
                  <li><strong>Premium Performance:</strong> Durch unsere Cloud-Architektur passen wir Ressourcen dynamisch an die Spielerzahlen an.</li>
                </ul>
                <div className="bg-accent/10 border border-accent/20 rounded-xl p-6 my-8">
                  <h4 className="text-accent mt-0 flex items-center gap-2">
                    <Book size={18} />
                    Wichtiger Hinweis
                  </h4>
                  <p className="mb-0 text-sm">
                    Dieses Wiki befindet sich im ständigen Aufbau. Wenn du Fehler findest oder Informationen fehlen, melde dich bitte in unserem Discord.
                  </p>
                </div>
              </div>
            </motion.main>
            
          </div>
        </div>
      </div>
    </Layout>
  );
}
