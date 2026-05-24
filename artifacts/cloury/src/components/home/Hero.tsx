import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Copy, ArrowRight, Activity, Users, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGetServerStatus } from "@workspace/api-client-react";
import { useMousePosition } from "@/hooks/use-mouse-position";
import heroBg from "@assets/IMG_4977_1779645593363.png";

export function Hero() {
  const { toast } = useToast();
  const { data: serverStatus, isLoading } = useGetServerStatus();
  const mousePosition = useMousePosition();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  // Calculate parallax based on mouse
  const xOffset = (mousePosition.x - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) * -0.02;
  const yOffset = (mousePosition.y - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) * -0.02;

  const copyIp = () => {
    navigator.clipboard.writeText("play.cloury.net");
    toast({
      title: "IP kopiert!",
      description: "Wir sehen uns auf dem Netzwerk.",
      className: "bg-background border-primary/20 text-foreground",
    });
  };

  return (
    <div ref={containerRef} className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* Background with Parallax */}
      <motion.div 
        style={{ y, opacity, x: xOffset, y: yOffset }}
        className="absolute inset-[-5%] z-0"
      >
        <div className="absolute inset-0 bg-background/60 mix-blend-multiply z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10" />
        <img 
          src={heroBg} 
          alt="Cloury Hero Background" 
          className="w-full h-full object-cover object-center filter contrast-125 saturate-150 brightness-75 blur-[2px]"
        />
      </motion.div>

      {/* Floating Particles Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none mix-blend-screen opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="container mx-auto px-4 md:px-6 relative z-20 pt-20">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <div className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${serverStatus?.online ? 'bg-green-400' : 'bg-destructive'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${serverStatus?.online ? 'bg-green-500' : 'bg-destructive'}`}></span>
            </div>
            <span className="text-sm font-medium">
              {isLoading ? "Verbinde..." : serverStatus?.online ? `${serverStatus.playerCount} Spieler online` : "Netzwerk offline"}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-black tracking-tight text-white mb-6 drop-shadow-[0_0_30px_rgba(0,229,255,0.4)]"
            style={{ textShadow: "0 0 40px rgba(0,229,255,0.5), 0 0 80px rgba(168,85,255,0.3)" }}
          >
            CLOURY <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">NETWORK</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-2xl text-muted-foreground max-w-2xl mb-12 font-light leading-relaxed"
          >
            Moderne Infrastruktur. Modulare Systeme. Grenzenlose Möglichkeiten.
            Erlebe Gaming <span className="text-white font-medium">Above the Limits.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <button 
              onClick={copyIp}
              className="group relative px-8 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,229,255,0.3)] hover:shadow-[0_0_60px_rgba(0,229,255,0.5)] transition-all w-full sm:w-auto flex items-center justify-center gap-3"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <Copy size={20} className="relative z-10" />
              <span className="relative z-10 tracking-wide">PLAY.CLOURY.NET</span>
            </button>
            <a 
              href="https://discord.gg/cloury" 
              target="_blank" 
              rel="noreferrer"
              className="group px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-lg rounded-xl backdrop-blur-md transition-all w-full sm:w-auto flex items-center justify-center gap-3"
            >
              <span>Discord beitreten</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>

        </div>
      </div>

      {/* Decorative Bottom Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none" />
    </div>
  );
}
