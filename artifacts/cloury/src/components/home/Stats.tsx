import { motion } from "framer-motion";
import { useGetNetworkStats } from "@workspace/api-client-react";
import { Users, Clock, Crosshair, CalendarDays } from "lucide-react";

export function Stats() {
  const { data: stats } = useGetNetworkStats();

  const statItems = [
    { label: "Registrierte Spieler", value: stats?.totalPlayers || 4520, icon: Users, color: "text-primary" },
    { label: "Gesamte Spielzeit (h)", value: stats?.totalPlaytime || 12450, icon: Clock, color: "text-accent" },
    { label: "Kills im Netzwerk", value: stats?.totalKills || 89200, icon: Crosshair, color: "text-destructive" },
    { label: "Durchgeführte Events", value: stats?.eventsCount || 34, icon: CalendarDays, color: "text-yellow-400" },
  ];

  return (
    <section className="py-24 border-y border-border/50 bg-card/20 relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-64 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {statItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8, ease: "easeOut" }}
              className="text-center flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center mb-4">
                <item.icon size={20} className={item.color} />
              </div>
              
              <div className="text-3xl md:text-5xl font-display font-bold text-white mb-2 tracking-tight">
                {/* Normally we'd use a counting hook here, but static value for simplicity if loading */}
                {new Intl.NumberFormat('de-DE').format(item.value)}
                <span className={item.color}>+</span>
              </div>
              
              <p className="text-muted-foreground font-medium text-sm uppercase tracking-wider">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
