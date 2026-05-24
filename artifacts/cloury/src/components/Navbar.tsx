import React from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Volume2, VolumeX, Terminal, Shield, Trophy, FileText, Calendar, LifeBuoy, LogIn, Gamepad2 } from "lucide-react";
import { useSound } from "@/hooks/use-sound";
import logoImg from "@assets/IMG_4954_1779645593363.png";

const links = [
  { href: "/", label: "Home", icon: Gamepad2 },
  { href: "/wiki", label: "Wiki", icon: FileText },
  { href: "/rules", label: "Regelwerk", icon: Shield },
  { href: "/ranks", label: "Ränge", icon: Terminal },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/news", label: "News", icon: FileText },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/support", label: "Support", icon: LifeBuoy },
];

export function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { soundEnabled, toggleSound } = useSound();

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/50 py-3 shadow-[0_4px_30px_-10px_rgba(0,229,255,0.1)]"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group relative">
            <div className="relative w-10 h-10 overflow-hidden">
              <img
                src={logoImg}
                alt="Cloury Logo"
                className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]"
              />
            </div>
            <span className="font-display font-bold text-xl tracking-wider text-foreground hidden sm:block">
              CLOURY
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  location === link.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {location === link.href && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleSound}
              className="text-muted-foreground hover:text-primary transition-colors p-2 hidden sm:block"
              aria-label={soundEnabled ? "Sound deaktivieren" : "Sound aktivieren"}
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <Link
              href="/login"
              className="hidden sm:flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2 rounded-full font-medium transition-all backdrop-blur-md"
            >
              <LogIn size={16} />
              <span>Login</span>
            </Link>
            <button
              className="lg:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-[100] bg-background/95 flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <img src={logoImg} alt="Cloury Logo" className="w-8 h-8 object-contain" />
                <span className="font-display font-bold text-lg tracking-wider text-foreground">
                  CLOURY
                </span>
              </div>
              <button
                className="p-2 text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-8 px-6 flex flex-col gap-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-4 text-2xl font-medium ${
                    location === link.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <link.icon size={24} className={location === link.href ? "text-primary" : "text-muted-foreground"} />
                  {link.label}
                </Link>
              ))}
              <div className="w-full h-px bg-white/10 my-4" />
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(0,229,255,0.3)]"
              >
                <LogIn size={20} />
                <span>Account Login</span>
              </Link>
              <button
                onClick={toggleSound}
                className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-6 py-4 rounded-xl font-medium"
              >
                {soundEnabled ? <VolumeX size={20} /> : <Volume2 size={20} />}
                <span>{soundEnabled ? "Sound deaktivieren" : "Sound aktivieren"}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
