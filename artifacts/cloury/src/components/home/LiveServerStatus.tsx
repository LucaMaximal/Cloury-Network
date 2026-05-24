import { motion } from "framer-motion";
import { useGetServerStatus } from "@workspace/api-client-react";
import { Activity, Users, Box } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function LiveServerStatus() {
  const { data: status, isLoading } = useGetServerStatus();

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between p-8 rounded-2xl bg-card border border-border backdrop-blur-md shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />
            
            <div className="flex-1 text-center md:text-left mb-8 md:mb-0 relative z-10">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">Netzwerk Status</h2>
              <p className="text-muted-foreground">{status?.motd || "Das Premium Minecraft Erlebnis."}</p>
            </div>

            <div className="flex gap-8 relative z-10">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                  <Activity size={24} />
                </div>
                {isLoading ? <Skeleton className="h-6 w-16" /> : (
                  <div className="text-xl font-mono font-bold text-white">
                    {status?.ping ? `${status.ping}ms` : "12ms"}
                  </div>
                )}
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Ping</div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-accent">
                  <Users size={24} />
                </div>
                {isLoading ? <Skeleton className="h-6 w-24" /> : (
                  <div className="text-xl font-mono font-bold text-white">
                    {status?.playerCount || 0} <span className="text-muted-foreground text-sm font-normal">/ {status?.maxPlayers || 1000}</span>
                  </div>
                )}
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Spieler</div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                  <Box size={24} />
                </div>
                {isLoading ? <Skeleton className="h-6 w-16" /> : (
                  <div className="text-xl font-mono font-bold text-white">
                    {status?.version || "1.20+"}
                  </div>
                )}
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Version</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
