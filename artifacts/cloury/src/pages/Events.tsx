import { Layout } from "@/components/Layout";
import { useListEvents } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Calendar, Clock, Trophy, MapPin } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

export default function Events() {
  const { data: events, isLoading } = useListEvents();

  return (
    <Layout>
      <div className="pt-32 pb-24 min-h-screen bg-background relative overflow-hidden">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-purple-500/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
          <div className="mb-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-4"
            >
              <Calendar size={14} />
              <span>Netzwerk Events</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-white"
            >
              Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">Events</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              Nimm an speziellen Turnieren teil, gewinne exklusive Ränge und Coins.
            </motion.p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-64 w-full rounded-2xl bg-card" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {events?.map((event, idx) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`relative p-8 rounded-3xl border overflow-hidden ${
                    event.active 
                      ? "bg-card border-primary/50 shadow-[0_0_30px_rgba(0,229,255,0.1)]" 
                      : "bg-card/50 border-border"
                  }`}
                >
                  {event.active && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -translate-y-1/2 translate-x-1/2" />
                  )}

                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${event.active ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground"}`}>
                        <Calendar size={24} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-display font-bold text-white">{event.title}</h3>
                        <div className="text-sm font-mono text-muted-foreground mt-1">{event.type}</div>
                      </div>
                    </div>
                    {event.active && (
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider rounded-full border border-green-500/30 animate-pulse">
                        Live
                      </span>
                    )}
                  </div>

                  <p className="text-muted-foreground mb-8 line-clamp-3">
                    {event.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mt-auto">
                    <div className="flex items-center gap-3 text-sm">
                      <Clock size={16} className="text-accent" />
                      <span className="text-slate-300">{format(new Date(event.date), "dd.MM.yy HH:mm")} Uhr</span>
                    </div>
                    {event.prize && (
                      <div className="flex items-center gap-3 text-sm">
                        <Trophy size={16} className="text-yellow-500" />
                        <span className="text-yellow-400 font-medium">{event.prize}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Decorative line */}
                  <div className={`absolute bottom-0 left-0 h-1 w-full ${event.active ? "bg-gradient-to-r from-primary via-accent to-primary" : "bg-border"}`} />
                </motion.div>
              ))}
              
              {(!events || events.length === 0) && (
                <div className="col-span-full text-center py-20 bg-card/30 rounded-3xl border border-border/50">
                  <Calendar size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
                  <h3 className="text-xl font-display text-white mb-2">Keine anstehenden Events</h3>
                  <p className="text-muted-foreground">Schau später wieder vorbei für neue Ankündigungen.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
