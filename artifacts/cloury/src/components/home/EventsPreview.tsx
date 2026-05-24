import { motion } from "framer-motion";
import { useListEvents } from "@workspace/api-client-react";
import { Link } from "wouter";
import { ArrowRight, Calendar, Clock, Trophy } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

export function EventsPreview() {
  const { data: events, isLoading } = useListEvents();
  
  // Take only the first 2 events for the preview
  const previewEvents = events?.slice(0, 2);

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[150px] rounded-full pointer-events-none translate-y-1/2 translate-x-1/4" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Anstehende <span className="text-accent">Events</span></h2>
            <p className="text-muted-foreground">Verpasse keine Turniere und Special-Events auf dem Netzwerk.</p>
          </div>
          <Link href="/events" className="text-accent hover:text-white flex items-center gap-2 font-medium mt-4 md:mt-0 transition-colors">
            Eventkalender <ArrowRight size={16} />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-2xl bg-card" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {previewEvents?.map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative p-8 rounded-3xl border overflow-hidden ${
                  event.active 
                    ? "bg-card border-accent/50 shadow-[0_0_30px_rgba(168,85,255,0.1)]" 
                    : "bg-card/50 border-border"
                }`}
              >
                {event.active && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-3xl -translate-y-1/2 translate-x-1/2" />
                )}

                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${event.active ? "bg-accent/20 text-accent" : "bg-white/5 text-muted-foreground"}`}>
                      <Calendar size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-white">{event.title}</h3>
                      <div className="text-sm font-mono text-muted-foreground mt-1">{event.type}</div>
                    </div>
                  </div>
                  {event.active && (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider rounded-full border border-green-500/30 animate-pulse">
                      Live
                    </span>
                  )}
                </div>

                <p className="text-muted-foreground mb-8 line-clamp-2">
                  {event.description}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Clock size={16} className="text-primary" />
                    <span className="text-slate-300">{format(new Date(event.date), "dd.MM.yy HH:mm")} Uhr</span>
                  </div>
                  {event.prize && (
                    <div className="flex items-center gap-3 text-sm">
                      <Trophy size={16} className="text-yellow-500" />
                      <span className="text-yellow-400 font-medium line-clamp-1">{event.prize}</span>
                    </div>
                  )}
                </div>
                
                <div className={`absolute bottom-0 left-0 h-1 w-full ${event.active ? "bg-gradient-to-r from-primary via-accent to-primary" : "bg-border"}`} />
              </motion.div>
            ))}
            
            {(!previewEvents || previewEvents.length === 0) && (
              <div className="col-span-full text-center py-12 text-muted-foreground border border-border border-dashed rounded-3xl">
                Zurzeit sind keine Events geplant.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
