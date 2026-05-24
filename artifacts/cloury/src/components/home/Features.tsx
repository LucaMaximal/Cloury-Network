import { motion } from "framer-motion";
import { Server, Cloud, Cpu, Layers, ShieldCheck, Zap } from "lucide-react";
import atmosBg from "@assets/IMG_4945_1779645593363.png";

const features = [
  {
    icon: Server,
    title: "Custom Infrastructure",
    description: "Von Grund auf entwickelte Backend-Systeme für maximale Performance und 99.9% Uptime."
  },
  {
    icon: Layers,
    title: "Modular Systems",
    description: "Dynamisch ladbare Module ermöglichen nahtlose Updates ohne Server-Neustarts."
  },
  {
    icon: Zap,
    title: "Advanced API",
    description: "Umfangreiche Entwicklerschnittstellen für synchronisierte Daten über alle Spielmodi."
  },
  {
    icon: Cloud,
    title: "Cloud Architecture",
    description: "Skalierbare Container-Struktur, die sich intelligent an die Spielerzahlen anpasst."
  },
  {
    icon: ShieldCheck,
    title: "Premium Framework",
    description: "Eigenes Anti-Cheat und Moderations-Framework für ein faires Spielerlebnis."
  },
  {
    icon: Cpu,
    title: "Cross-Server Sync",
    description: "Inventare, Ränge und Einstellungen synchronisieren sich in Millisekunden netzwerkweit."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

export function Features() {
  return (
    <section className="py-32 relative overflow-hidden bg-background">
      {/* Background Graphic */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none select-none flex items-center justify-center">
        <img src={atmosBg} alt="" className="w-full max-w-5xl object-cover mix-blend-screen filter blur-xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-4"
          >
            <Zap size={14} />
            <span>Technologie</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-display font-bold mb-6"
          >
            Entwickelt für <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Perfektion</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            Keine Standard-Plugins. Keine Kompromisse. Jedes System auf Cloury wurde mit modernsten Technologien von Grund auf neu geschrieben.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              className="group relative p-8 rounded-2xl bg-card/50 border border-border backdrop-blur-sm overflow-hidden hover:border-primary/50 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="w-14 h-14 rounded-xl bg-background border border-border flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-primary/50 transition-transform duration-500 relative z-10">
                <feature.icon size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              
              <h3 className="text-xl font-display font-semibold mb-3 relative z-10 text-white group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed relative z-10">
                {feature.description}
              </p>

              {/* Decorative border bottom line */}
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-x-0 group-hover:scale-x-100" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
