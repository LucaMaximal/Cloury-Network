import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { useState } from "react";
import { useListAllTickets, useUpdateTicketStatus, getListAllTicketsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, ChevronUp, Ticket } from "lucide-react";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  open:        { label: "Offen",        color: "bg-primary/20 text-primary border-primary/30" },
  in_progress: { label: "In Bearbeitung", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  resolved:    { label: "Gelöst",       color: "bg-green-500/20 text-green-400 border-green-500/30" },
  closed:      { label: "Geschlossen",  color: "bg-muted/50 text-muted-foreground border-border" },
};

const TYPE_LABELS: Record<string, string> = {
  Support: "bg-accent/20 text-accent border-accent/30",
  Bug:     "bg-destructive/20 text-destructive border-destructive/30",
  Report:  "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

const FILTERS = ["Alle", "Offen", "In Bearbeitung", "Gelöst", "Geschlossen"] as const;
const FILTER_MAP: Record<string, string | null> = {
  "Alle": null, "Offen": "open", "In Bearbeitung": "in_progress", "Gelöst": "resolved", "Geschlossen": "closed",
};

export default function DashboardTickets() {
  const { data: tickets, isLoading } = useListAllTickets();
  const updateStatus = useUpdateTicketStatus();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [filter, setFilter] = useState("Alle");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [pendingStatus, setPendingStatus] = useState<Record<number, string>>({});

  const filtered = tickets?.filter(t => {
    const s = FILTER_MAP[filter];
    return s === null || t.status === s;
  }) ?? [];

  const handleStatusSave = async (id: number) => {
    const status = pendingStatus[id];
    if (!status) return;
    try {
      await updateStatus.mutateAsync({ id, data: { status: status as "open" | "in_progress" | "resolved" | "closed" } });
      queryClient.invalidateQueries({ queryKey: getListAllTicketsQueryKey() });
      toast({ title: "Status aktualisiert" });
    } catch {
      toast({ variant: "destructive", title: "Fehler beim Aktualisieren" });
    }
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-display font-bold text-white">Tickets</h1>
          <span className="text-sm text-muted-foreground">{filtered.length} Ticket{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f ? "bg-primary/20 text-primary border border-primary/30" : "bg-card/50 text-muted-foreground border border-border hover:border-primary/20 hover:text-white"}`}
            >
              {f}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Ticket size={48} className="opacity-20 mb-4" />
            <p>Keine Tickets vorhanden.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((ticket, i) => {
              const isOpen = expanded === ticket.id;
              const statusInfo = STATUS_LABELS[ticket.status] ?? STATUS_LABELS.open;
              const typeColor = TYPE_LABELS[ticket.type] ?? "";
              return (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-card/50 border border-border rounded-2xl overflow-hidden"
                >
                  <button
                    className="w-full p-5 flex items-center gap-4 text-left hover:bg-white/5 transition-colors"
                    onClick={() => setExpanded(isOpen ? null : ticket.id)}
                    data-testid={`ticket-row-${ticket.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ${typeColor}`}>{ticket.type}</span>
                        <span className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${statusInfo.color}`}>{statusInfo.label}</span>
                        <span className="text-xs text-muted-foreground">von {ticket.username ?? "Unbekannt"}</span>
                      </div>
                      <p className="text-white font-semibold truncate">{ticket.title}</p>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground flex-shrink-0">
                      <span className="text-xs hidden sm:block">{new Date(ticket.createdAt).toLocaleDateString("de-DE")}</span>
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-border/50 pt-4 space-y-4">
                      <p className="text-muted-foreground text-sm leading-relaxed">{ticket.content}</p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <Select
                          value={pendingStatus[ticket.id] ?? ticket.status}
                          onValueChange={v => setPendingStatus(p => ({ ...p, [ticket.id]: v }))}
                        >
                          <SelectTrigger className="w-48 bg-background border-border h-10" data-testid={`select-status-${ticket.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Offen</SelectItem>
                            <SelectItem value="in_progress">In Bearbeitung</SelectItem>
                            <SelectItem value="resolved">Gelöst</SelectItem>
                            <SelectItem value="closed">Geschlossen</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          onClick={() => handleStatusSave(ticket.id)}
                          disabled={!pendingStatus[ticket.id] || updateStatus.isPending}
                          className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30"
                          data-testid={`button-save-status-${ticket.id}`}
                        >
                          Speichern
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
