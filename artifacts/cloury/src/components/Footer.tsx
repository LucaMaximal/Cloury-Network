import { Link } from "wouter";
import { Twitter, DiscIcon as Discord, Github, Youtube } from "lucide-react";
import logoImg from "@assets/IMG_4954_1779645593363.png";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8 relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-full max-w-2xl h-48 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <img src={logoImg} alt="Cloury Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" />
              <span className="font-display font-bold text-xl tracking-wider text-foreground">
                CLOURY
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Moderne Infrastruktur. Modulare Systeme. Grenzenlose Möglichkeiten. Das Premium Minecraft Erlebnis.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-white/10 transition-colors">
                <Discord size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-white/10 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-white/10 transition-colors">
                <Youtube size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-white/10 transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-display font-semibold text-lg mb-6">Netzwerk</h3>
            <ul className="space-y-4">
              <li><Link href="/news" className="text-muted-foreground hover:text-primary transition-colors">Neuigkeiten</Link></li>
              <li><Link href="/events" className="text-muted-foreground hover:text-primary transition-colors">Events</Link></li>
              <li><Link href="/leaderboard" className="text-muted-foreground hover:text-primary transition-colors">Leaderboard</Link></li>
              <li><Link href="/ranks" className="text-muted-foreground hover:text-primary transition-colors">Ränge & Vorteile</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-display font-semibold text-lg mb-6">Ressourcen</h3>
            <ul className="space-y-4">
              <li><Link href="/wiki" className="text-muted-foreground hover:text-primary transition-colors">Wiki & Docs</Link></li>
              <li><Link href="/rules" className="text-muted-foreground hover:text-primary transition-colors">Regelwerk</Link></li>
              <li><Link href="/support" className="text-muted-foreground hover:text-primary transition-colors">Support Tickets</Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Status & Uptime</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-display font-semibold text-lg mb-6">Rechtliches</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Impressum</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Datenschutz</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">AGB</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Mojang EULA</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Cloury Network. Alle Rechte vorbehalten.
          </p>
          <p className="text-sm text-muted-foreground text-center md:text-right">
            Not an official Minecraft product. We are in no way affiliated with or endorsed by Mojang Synergies AB.
          </p>
        </div>
      </div>
    </footer>
  );
}
