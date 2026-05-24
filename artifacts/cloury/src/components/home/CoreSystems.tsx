import { motion } from "framer-motion";
import { Database, Network, Lock, Cpu } from "lucide-react";

const pillars = [
  {
    icon: Database,
    title: "Global Sync",
    description: "Redis und MongoDB Cluster für verzögerungsfreie Datensynchronisation."
  },
  {
    icon: Network,
    title: "Agile Routing",
    description: "Intelligente Proxy-Architektur für nahtlose Serverwechsel ohne Ladebildschirme."
  },
  {
    icon: Lock,
    title: "Zero-Trust Security",
    description: "Mehrschichtiges Sicherheitssystem zum Schutz vor DDoS und Exploits."
  },
  {
    icon: Cpu,
    title: "Dynamic Scaling",
    description: "Automatische Bereitstellung neuer Instanzen bei steigenden Spielerzahlen."
  }
];

export function CoreSystems() {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-white">
            Die <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">Core Systems</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Im Hintergrund arbeitet eine komplexe Microservice-Architektur, die Skalierbarkeit und Stabilität auf Enterprise-Niveau garantiert.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="group text-center"
            >
              <div className="w-20 h-20 mx-auto rounded-2xl bg-card border border-border flex items-center justify-center mb-6 relative group-hover:border-accent/50 transition-colors">
                <div className="absolute inset-0 bg-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <pillar.icon size={32} className="text-muted-foreground group-hover:text-accent relative z-10 transition-colors" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3 text-white">{pillar.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{pillar.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
