import { Layout } from "@/components/Layout";
import { useParams } from "wouter";
import { useGetPlayer } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Swords, Ghost, Coins, Clock, Trophy, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Profile() {
  const { username } = useParams();
  
  const { data: profile, isLoading } = useGetPlayer(username || "", {
    query: { enabled: !!username, queryKey: ["getPlayer", username] }
  });

  const getRankColor = (role?: string) => {
    switch(role?.toLowerCase()) {
      case "admin": return "text-red-500 border-red-500/30 bg-red-500/10";
      case "developer": return "text-cyan-400 border-cyan-400/30 bg-cyan-400/10";
      case "moderator": return "text-green-500 border-green-500/30 bg-green-500/10";
      default: return "text-slate-300 border-slate-300/30 bg-slate-300/10";
    }
  };

  return (
    <Layout>
      <div className="pt-32 pb-24 min-h-screen bg-background relative">
        <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 max-w-5xl relative z-10">
          
          {isLoading ? (
            <div className="space-y-8">
              <Skeleton className="w-full h-64 rounded-3xl bg-card" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-2xl bg-card" />)}
              </div>
            </div>
          ) : profile ? (
            <div className="space-y-8">
              
              {/* Profile Header */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card/80 border border-border backdrop-blur-md p-8 md:p-12 rounded-3xl flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden"
              >
                <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl bg-black/50 p-2 border border-border shadow-2xl relative z-10">
                  <img 
                    src={`https://mc-heads.net/body/${profile.uuid}/left`} 
                    alt={profile.username}
                    className="w-full h-full object-contain filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
                  />
                </div>
                
                <div className="text-center md:text-left flex-1 z-10">
                  <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
                      {profile.username}
                    </h1>
                    <span className={`px-3 py-1 rounded-md text-sm font-bold tracking-wider uppercase border ${getRankColor(profile.role)}`}>
                      {profile.role}
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground text-lg mb-6 max-w-lg">
                    {profile.bio || "Dieser Spieler hat noch keine Biografie hinzugefügt."}
                  </p>
                  
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-mono text-muted-foreground">
                    UUID: {profile.uuid.split('-')[0]}...
                  </div>
                </div>

                {/* Decorative background glow behind character */}
                <div className="absolute left-12 top-1/2 -translate-y-1/2 w-48 h-48 bg-primary/20 blur-[80px] rounded-full" />
              </motion.div>

              {/* Stats Grid */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
              >
                <div className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center text-center hover:border-destructive/30 transition-colors">
                  <Swords className="text-destructive mb-3" size={28} />
                  <div className="text-3xl font-display font-bold text-white mb-1">{profile.kills}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Kills</div>
                </div>
                
                <div className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center text-center hover:border-slate-400/30 transition-colors">
                  <Ghost className="text-slate-400 mb-3" size={28} />
                  <div className="text-3xl font-display font-bold text-white mb-1">{profile.deaths}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Tode</div>
                </div>

                <div className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center text-center hover:border-yellow-400/30 transition-colors">
                  <Coins className="text-yellow-400 mb-3" size={28} />
                  <div className="text-3xl font-display font-bold text-white mb-1">{profile.coins}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Coins</div>
                </div>

                <div className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center text-center hover:border-primary/30 transition-colors">
                  <Clock className="text-primary mb-3" size={28} />
                  <div className="text-3xl font-display font-bold text-white mb-1">{Math.floor(profile.playtime / 60)}h</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Spielzeit</div>
                </div>
              </motion.div>

              {/* Achievements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card/50 border border-border rounded-3xl p-8"
              >
                <div className="flex items-center gap-3 mb-8">
                  <Trophy className="text-accent" size={24} />
                  <h2 className="text-2xl font-display font-bold text-white">Achievements</h2>
                </div>

                {profile.achievements && profile.achievements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {profile.achievements.map((ach) => (
                      <div key={ach.id} className="flex gap-4 p-4 rounded-xl bg-background border border-border">
                        <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 text-2xl">
                          {ach.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white text-sm">{ach.name}</h4>
                          <p className="text-xs text-muted-foreground">{ach.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground flex flex-col items-center">
                    <Award size={48} className="mb-4 opacity-20" />
                    <p>Noch keine Errungenschaften freigeschaltet.</p>
                  </div>
                )}
              </motion.div>

            </div>
          ) : (
            <div className="text-center py-32">
              <h2 className="text-3xl font-display font-bold text-white mb-4">Spieler nicht gefunden</h2>
              <p className="text-muted-foreground">Der gesuchte Spieler existiert nicht oder hat den Server noch nie betreten.</p>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}
