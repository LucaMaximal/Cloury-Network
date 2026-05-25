import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { useGetDashboardStats } from "@workspace/api-client-react";
import { Users, Ticket, FileText, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: stats, isLoading } = useGetDashboardStats();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const statCards = [
    { label: "Benutzer (Gesamt)", value: stats?.totalUsers || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: "Offene Tickets", value: stats?.openTickets || 0, icon: Ticket, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { label: "News-Artikel", value: stats?.totalNews || 0, icon: FileText, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
    { label: "Events", value: stats?.totalEvents || 0, icon: Calendar, color: "text-accent", bg: "bg-accent/10", border: "border-accent/20" }
  ];

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <h1 className="text-3xl font-display font-bold text-white">Übersicht</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-2xl border ${card.border} bg-card/50 backdrop-blur-sm relative overflow-hidden`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <card.icon className={card.color} size={24} />
                </div>
              </div>
              <p className="text-muted-foreground text-sm font-medium mb-1">{card.label}</p>
              <h3 className="text-3xl font-display font-bold text-white">{card.value}</h3>
              
              <div className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-full ${card.bg} blur-3xl pointer-events-none`} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}