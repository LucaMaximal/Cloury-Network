import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Volume2, VolumeX, Terminal, Shield, Trophy, FileText, Calendar, LifeBuoy, LogIn, Gamepad2, LayoutDashboard, User, LogOut, ChevronDown } from "lucide-react";
import { useSound } from "@/hooks/use-sound";
import { useAuth } from "@/context/AuthContext";
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
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { soundEnabled, toggleSound } = useSound();
  const { user, isAuthenticated, isTeam, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
  };

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
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 overflow-hidden">
              <img src={logoImg} alt="Cloury Logo" className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" />
            </div>
            <span className="font-display font-bold text-xl tracking-wider text-foreground hidden sm:block">CLOURY</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${location === link.href ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                {location === link.href && (
                  <motion.div layoutId="navbar-active" className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-full" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleSound}
              className="text-muted-foreground hover:text-primary transition-colors p-2 hidden sm:block"
              aria-label={soundEnabled ? "Sound deaktivieren" : "Sound aktivieren"}
              data-testid="button-toggle-sound"
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>

            {isAuthenticated && user ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-3 py-2 rounded-full font-medium transition-all backdrop-blur-md"
                  data-testid="button-user-menu"
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-black/50 border border-white/20">
                    <img src={`https://mc-heads.net/avatar/${user.minecraftUsername ?? user.username}/24`} alt={user.username} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm max-w-[100px] truncate">{user.username}</span>
                  <ChevronDown size={14} className={`transition-transform ${userDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-52 bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-border/50">
                        <p className="text-sm font-semibold text-white truncate">{user.username}</p>
                        <p className="text-xs text-primary truncate">{user.role}</p>
                      </div>
                      <div className="p-2 space-y-1">
                        <Link
                          href={`/profile/${user.username}`}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                          data-testid="link-my-profile"
                        >
                          <User size={15} /> Mein Profil
                        </Link>
                        {isTeam && (
                          <Link
                            href="/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-primary hover:bg-primary/10 transition-colors"
                            data-testid="link-dashboard"
                          >
                            <LayoutDashboard size={15} /> Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                          data-testid="button-logout"
                        >
                          <LogOut size={15} /> Abmelden
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2 rounded-full font-medium transition-all backdrop-blur-md"
                data-testid="link-login"
              >
                <LogIn size={16} />
                <span>Login</span>
              </Link>
            )}

            <button className="lg:hidden p-2 text-foreground" onClick={() => setMobileMenuOpen(true)} data-testid="button-mobile-menu">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <img src={logoImg} alt="Cloury Logo" className="w-8 h-8 object-contain" />
                <span className="font-display font-bold text-lg tracking-wider text-foreground">CLOURY</span>
              </div>
              <button className="p-2 text-foreground" onClick={() => setMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-8 px-6 flex flex-col gap-4">
              {links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-4 text-xl font-medium py-2 ${location === link.href ? "text-primary" : "text-muted-foreground"}`}
                >
                  <link.icon size={22} className={location === link.href ? "text-primary" : "text-muted-foreground"} />
                  {link.label}
                </Link>
              ))}

              <div className="w-full h-px bg-white/10 my-2" />

              {isAuthenticated && user ? (
                <>
                  <Link href={`/profile/${user.username}`} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 text-xl font-medium py-2 text-muted-foreground">
                    <User size={22} /> Mein Profil
                  </Link>
                  {isTeam && (
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 text-xl font-medium py-2 text-primary">
                      <LayoutDashboard size={22} /> Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className="flex items-center gap-4 text-xl font-medium py-2 text-muted-foreground hover:text-destructive transition-colors">
                    <LogOut size={22} /> Abmelden
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(0,229,255,0.3)]"
                >
                  <LogIn size={20} /> Account Login
                </Link>
              )}

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
