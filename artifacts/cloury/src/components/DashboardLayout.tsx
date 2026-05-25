import { useAuth } from "@/context/AuthContext";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Ticket, FileText, Calendar, Users, LogOut, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isTeam, isLoading, logout } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Laden...</div>;
  }

  if (!isTeam) {
    window.location.href = "/login";
    return null;
  }

  const links = [
    { href: "/dashboard", label: "Übersicht", icon: LayoutDashboard },
    { href: "/dashboard/tickets", label: "Tickets", icon: Ticket },
    { href: "/dashboard/news", label: "News", icon: FileText },
    { href: "/dashboard/events", label: "Events", icon: Calendar },
  ];

  if (user?.role === "Owner" || user?.role === "Admin") {
    links.push({ href: "/dashboard/users", label: "Benutzer", icon: Users });
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-64 bg-card/80 backdrop-blur-xl border-r border-border fixed h-full flex flex-col z-50"
      >
        <div className="p-6 border-b border-border/50">
          <Link href="/" className="flex items-center gap-3 text-white hover:text-primary transition-colors">
            <ArrowLeft size={20} />
            <span className="font-display font-bold text-xl tracking-wider">CLOURY</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const isActive = location === link.href;
            return (
              <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(0,229,255,0.1)]" : "text-muted-foreground hover:bg-white/5 hover:text-white"}`}>
                <link.icon size={20} />
                <span className="font-medium">{link.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-black/50 border border-white/10">
              <img src={`https://mc-heads.net/avatar/${user?.username}/32`} alt={user?.username} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.username}</p>
              <p className="text-xs text-primary truncate">{user?.role}</p>
            </div>
            <button onClick={() => logout()} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 relative min-h-screen">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
