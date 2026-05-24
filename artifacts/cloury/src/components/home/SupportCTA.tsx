import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, MessageSquare, Ticket } from "lucide-react";

export function SupportCTA() {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl p-10 md:p-16 relative overflow-hidden"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background border border-white/10 rounded-3xl" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            
            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
                Brauchst du <span className="text-primary">Hilfe?</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
                Unser Support-Team steht dir rund um die Uhr zur Verfügung. Tritt unserem Discord bei oder erstelle ein Ticket auf der Website.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a 
                  href="https://discord.gg/cloury" 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-8 py-4 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold transition-colors flex items-center justify-center gap-3 shadow-lg shadow-[#5865F2]/20"
                >
                  <MessageSquare size={20} />
                  Discord Support
                </a>
                <Link 
                  href="/support"
                  className="px-8 py-4 rounded-xl bg-card border border-border hover:border-primary/50 text-white font-medium transition-colors flex items-center justify-center gap-3 backdrop-blur-md"
                >
                  <Ticket size={20} />
                  Ticket erstellen
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
