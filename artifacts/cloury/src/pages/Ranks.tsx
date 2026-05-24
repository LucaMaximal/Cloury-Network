import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { ShieldAlert, Shield, ShieldCheck, Crown, Star, Wrench, Code, Terminal } from "lucide-react";

const ranks = [
  {
    category: "Management",
    items: [
      { name: "Admin", icon: Crown, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", desc: "Leitung des Netzwerks, Projektmanagement und strategische Entscheidungen." },
      { name: "Developer", icon: Code, color: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/20", desc: "Entwicklung der Systeme, Backend-Architektur und Bugfixing." }
    ]
  },
  {
    category: "Moderation",
    items: [
      { name: "Moderator", icon: ShieldCheck, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20", desc: "Überwachung des Chats, Bearbeitung von Reports und Strafen." },
      { name: "Supporter", icon: Shield, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", desc: "Erste Anlaufstelle für Spielerfragen, Ticket-Bearbeitung." }
    ]
  },
  {
    category: "Creative",
    items: [
      { name: "Builder", icon: Wrench, color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20", desc: "Erschaffung von Maps, Lobbys und atmosphärischen Welten." },
      { name: "Content", icon: Star, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20", desc: "Konzeption von Events, Quests und Social Media Management." }
    ]
  }
];

export default function Ranks() {
  return (
    <Layout>
      <div className="pt-32 pb-24 min-h-screen bg-background relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-6 max-w-5xl relative z-10">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-4"
            >
              <Terminal size={14} />
              <span>Team Struktur</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-white"
            >
              Ränge & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Struktur</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              Übersicht der administrativen Ränge und deren Verantwortlichkeiten auf dem Cloury Network.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-card border border-border text-sm"
            >
              <ShieldAlert className="text-primary" size={18} />
              <span className="text-muted-foreground">Wir verkaufen <strong>keine</strong> administrativen Ränge oder unfaire Vorteile.</span>
            </motion.div>
          </div>

          <div className="space-y-16">
            {ranks.map((category, catIdx) => (
              <motion.div 
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIdx * 0.1 }}
              >
                <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-4">
                  <span className="w-8 h-px bg-border"></span>
                  {category.category}
                  <span className="flex-1 h-px bg-border"></span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {category.items.map((rank, idx) => (
                    <div key={idx} className="group p-6 rounded-2xl bg-card/50 border border-border hover:border-border/80 transition-colors relative overflow-hidden">
                      <div className={`absolute top-0 right-0 w-32 h-32 ${rank.bg} blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700`} />
                      
                      <div className="flex items-start gap-5 relative z-10">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${rank.bg} ${rank.border} border`}>
                          <rank.icon className={rank.color} size={24} />
                        </div>
                        <div>
                          <h3 className={`text-xl font-display font-bold mb-2 ${rank.color}`}>{rank.name}</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">{rank.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
