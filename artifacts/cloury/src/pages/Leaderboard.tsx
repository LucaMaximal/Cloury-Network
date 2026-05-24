import { Layout } from "@/components/Layout";
import { useGetLeaderboard } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Trophy, Swords, Coins, Clock, Search, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

type Category = "kills" | "coins" | "playtime";

export default function Leaderboard() {
  const [category, setCategory] = useState<Category>("kills");
  
  // Use generated hook (assumes generated type matches our Category strings)
  const { data: leaderboard, isLoading } = useGetLeaderboard({ category, limit: 10 });

  const categories = [
    { id: "kills", label: "Meiste Kills", icon: Swords, color: "text-destructive" },
    { id: "coins", label: "Reichste Spieler", icon: Coins, color: "text-yellow-400" },
    { id: "playtime", label: "Längste Spielzeit", icon: Clock, color: "text-primary" },
  ] as const;

  const topThree = leaderboard?.slice(0, 3) || [];
  const rest = leaderboard?.slice(3) || [];

  return (
    <Layout>
      <div className="pt-32 pb-24 min-h-screen bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-6 max-w-5xl relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm font-medium mb-4"
            >
              <Trophy size={14} />
              <span>Hall of Fame</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-white"
            >
              Network <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Leaderboard</span>
            </motion.h1>
            
            {/* Category Toggle */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-3 mt-8"
            >
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id as Category)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    category === cat.id 
                      ? "bg-card border-primary/50 text-white shadow-[0_0_20px_rgba(0,229,255,0.2)]" 
                      : "bg-white/5 border-transparent text-muted-foreground hover:bg-white/10 hover:text-white"
                  } border`}
                >
                  <cat.icon size={18} className={category === cat.id ? cat.color : ""} />
                  {cat.label}
                </button>
              ))}
            </motion.div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="w-full h-24 rounded-xl bg-card" />
              <Skeleton className="w-full h-24 rounded-xl bg-card" />
              <Skeleton className="w-full h-24 rounded-xl bg-card" />
            </div>
          ) : (
            <div className="space-y-12">
              
              {/* Top 3 Podium */}
              {topThree.length > 0 && (
                <div className="flex flex-col md:flex-row items-end justify-center gap-6 mt-12 mb-16 h-[300px]">
                  {/* Place 2 */}
                  {topThree[1] && (
                    <motion.div 
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="w-full md:w-1/3 order-2 md:order-1 flex flex-col items-center"
                    >
                      <Link href={`/profile/${topThree[1].username}`} className="mb-4 text-center group cursor-pointer">
                        <img src={`https://mc-heads.net/avatar/${topThree[1].uuid}/100`} alt={topThree[1].username} className="w-16 h-16 rounded-lg mx-auto mb-2 border-2 border-slate-300 shadow-[0_0_15px_rgba(203,213,225,0.3)] group-hover:scale-110 transition-transform" />
                        <div className="font-display font-bold text-white group-hover:text-primary transition-colors">{topThree[1].username}</div>
                        <div className="text-sm text-slate-300 font-mono">{topThree[1].value} {category}</div>
                      </Link>
                      <div className="w-full bg-gradient-to-t from-slate-400/20 to-slate-400/40 border-t-4 border-slate-300 h-32 rounded-t-xl flex items-center justify-center text-4xl font-black text-slate-300/50">2</div>
                    </motion.div>
                  )}
                  
                  {/* Place 1 */}
                  {topThree[0] && (
                    <motion.div 
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="w-full md:w-1/3 order-1 md:order-2 flex flex-col items-center z-10"
                    >
                      <Link href={`/profile/${topThree[0].username}`} className="mb-4 text-center group cursor-pointer relative">
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-yellow-400 animate-bounce">
                          <Trophy size={24} />
                        </div>
                        <img src={`https://mc-heads.net/avatar/${topThree[0].uuid}/120`} alt={topThree[0].username} className="w-20 h-20 rounded-lg mx-auto mb-2 border-2 border-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.4)] group-hover:scale-110 transition-transform" />
                        <div className="font-display font-bold text-xl text-white group-hover:text-yellow-400 transition-colors">{topThree[0].username}</div>
                        <div className="text-sm text-yellow-400 font-mono font-bold">{topThree[0].value} {category}</div>
                      </Link>
                      <div className="w-full bg-gradient-to-t from-yellow-500/20 to-yellow-500/40 border-t-4 border-yellow-400 h-40 rounded-t-xl flex items-center justify-center text-6xl font-black text-yellow-500/50 shadow-[0_-10px_30px_rgba(250,204,21,0.1)]">1</div>
                    </motion.div>
                  )}

                  {/* Place 3 */}
                  {topThree[2] && (
                    <motion.div 
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="w-full md:w-1/3 order-3 md:order-3 flex flex-col items-center"
                    >
                      <Link href={`/profile/${topThree[2].username}`} className="mb-4 text-center group cursor-pointer">
                        <img src={`https://mc-heads.net/avatar/${topThree[2].uuid}/100`} alt={topThree[2].username} className="w-16 h-16 rounded-lg mx-auto mb-2 border-2 border-amber-600 shadow-[0_0_15px_rgba(217,119,6,0.3)] group-hover:scale-110 transition-transform" />
                        <div className="font-display font-bold text-white group-hover:text-primary transition-colors">{topThree[2].username}</div>
                        <div className="text-sm text-amber-500 font-mono">{topThree[2].value} {category}</div>
                      </Link>
                      <div className="w-full bg-gradient-to-t from-amber-700/20 to-amber-700/40 border-t-4 border-amber-600 h-24 rounded-t-xl flex items-center justify-center text-4xl font-black text-amber-700/50">3</div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Rest of Leaderboard */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-card border border-border rounded-2xl overflow-hidden"
              >
                <div className="divide-y divide-border">
                  {rest.map((entry, idx) => (
                    <div key={entry.uuid} className="flex items-center justify-between p-4 px-6 hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-6">
                        <div className="w-8 font-mono text-muted-foreground font-medium text-lg">#{entry.rank}</div>
                        <div className="flex items-center gap-4">
                          <img src={`https://mc-heads.net/avatar/${entry.uuid}/40`} alt={entry.username} className="w-10 h-10 rounded" />
                          <div className="font-medium text-white">{entry.username}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="font-mono text-primary font-medium">{entry.value}</div>
                        <Link href={`/profile/${entry.username}`} className="text-muted-foreground hover:text-white transition-colors">
                          <ExternalLink size={18} />
                        </Link>
                      </div>
                    </div>
                  ))}
                  {rest.length === 0 && topThree.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                      Noch keine Daten verfügbar.
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}
