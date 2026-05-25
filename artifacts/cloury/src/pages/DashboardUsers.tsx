import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { useListDashboardUsers, useUpdateUserRole, getListDashboardUsersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Users } from "lucide-react";

const ALL_ROLES = [
  "Player",
  "JrSup","Sup","SrSup",
  "JrMod","Mod","SrMod",
  "JrDev","Dev","SrDev",
  "JrContent","Content","SrContent",
  "JrBuilder","Builder","SrBuilder",
  "Admin","Owner",
] as const;

const ROLE_COLORS: Record<string, string> = {
  Owner:   "text-yellow-300 bg-yellow-300/10 border-yellow-300/30",
  Admin:   "text-red-400 bg-red-400/10 border-red-400/30",
  Dev:     "text-primary bg-primary/10 border-primary/30",
  SrDev:   "text-primary bg-primary/10 border-primary/30",
  JrDev:   "text-primary bg-primary/10 border-primary/30",
  Mod:     "text-green-400 bg-green-400/10 border-green-400/30",
  SrMod:   "text-green-400 bg-green-400/10 border-green-400/30",
  JrMod:   "text-green-400 bg-green-400/10 border-green-400/30",
  Builder: "text-orange-400 bg-orange-400/10 border-orange-400/30",
  SrBuilder:"text-orange-400 bg-orange-400/10 border-orange-400/30",
  JrBuilder:"text-orange-400 bg-orange-400/10 border-orange-400/30",
  default: "text-muted-foreground bg-muted/30 border-border",
};

function getRoleColor(role: string): string {
  return ROLE_COLORS[role] ?? ROLE_COLORS.default;
}

export default function DashboardUsers() {
  const { data: users, isLoading } = useListDashboardUsers();
  const updateRole = useUpdateUserRole();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [pendingRoles, setPendingRoles] = useState<Record<number, string>>({});

  const handleSave = async (id: number) => {
    const role = pendingRoles[id];
    if (!role) return;
    try {
      await updateRole.mutateAsync({ id, data: { role } });
      queryClient.invalidateQueries({ queryKey: getListDashboardUsersQueryKey() });
      setPendingRoles(p => { const n = { ...p }; delete n[id]; return n; });
      toast({ title: "Rolle aktualisiert" });
    } catch {
      toast({ variant: "destructive", title: "Fehler beim Aktualisieren" });
    }
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-display font-bold text-white">Benutzer</h1>
          <span className="text-sm text-muted-foreground">{users?.length ?? 0} Accounts</span>
        </div>

        {isLoading ? (
          <div className="space-y-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-16 rounded-2xl" />)}</div>
        ) : !users?.length ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Users size={48} className="opacity-20 mb-4" />
            <p>Keine Benutzer gefunden.</p>
          </div>
        ) : (
          <div className="bg-card/30 border border-border rounded-2xl overflow-hidden">
            <div className="hidden md:grid grid-cols-[1fr_1.5fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-border/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <span>Benutzername</span>
              <span>E-Mail</span>
              <span>Aktuelle Rolle</span>
              <span>Neue Rolle</span>
              <span>Aktion</span>
            </div>
            {users.map((user, i) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr_1fr_1fr_auto] gap-4 px-5 py-4 border-b border-border/30 last:border-0 items-center"
                data-testid={`user-row-${user.id}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-black/50 border border-white/10 flex-shrink-0">
                    <img src={`https://mc-heads.net/avatar/${user.username}/32`} alt={user.username} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-white font-semibold text-sm truncate">{user.username}</span>
                </div>
                <span className="text-muted-foreground text-sm truncate hidden md:block">{user.email}</span>
                <div>
                  <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ${getRoleColor(user.role)}`}>{user.role}</span>
                </div>
                <Select
                  value={pendingRoles[user.id] ?? user.role}
                  onValueChange={v => setPendingRoles(p => ({ ...p, [user.id]: v }))}
                >
                  <SelectTrigger className="h-9 bg-background border-border text-sm w-full" data-testid={`select-role-${user.id}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_ROLES.map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  onClick={() => handleSave(user.id)}
                  disabled={!pendingRoles[user.id] || pendingRoles[user.id] === user.role || updateRole.isPending}
                  className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 text-xs whitespace-nowrap"
                  data-testid={`button-save-role-${user.id}`}
                >
                  Speichern
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
