import { Layout } from "@/components/Layout";
import { useParams, useLocation } from "wouter";
import { useGetPlayer, useUpdateProfile, useChangePassword, useGetMyTickets, getGetPlayerQueryKey, getGetMyTicketsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Swords, Ghost, Coins, Clock, Trophy, Award, Settings, Shield, Ticket as TicketIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const profileSchema = z.object({
  bio: z.string().max(300, "Maximal 300 Zeichen").optional(),
  minecraftUsername: z.string().max(16, "Maximal 16 Zeichen").optional(),
});
const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Pflichtfeld"),
  newPassword: z.string().min(8, "Mindestens 8 Zeichen"),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, { message: "Passwörter stimmen nicht überein", path: ["confirmPassword"] });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

type Tab = "stats" | "settings" | "security" | "tickets";

const STATUS_COLORS: Record<string, string> = {
  open:        "bg-primary/20 text-primary border-primary/30",
  in_progress: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  resolved:    "bg-green-500/20 text-green-400 border-green-500/30",
  closed:      "bg-muted/50 text-muted-foreground border-border",
};
const STATUS_LABELS: Record<string, string> = {
  open: "Offen", in_progress: "In Bearbeitung", resolved: "Gelöst", closed: "Geschlossen",
};

function getRankColor(role?: string) {
  if (!role) return "text-slate-300 border-slate-300/30 bg-slate-300/10";
  const r = role.toLowerCase();
  if (r === "owner") return "text-yellow-300 border-yellow-300/30 bg-yellow-300/10";
  if (r === "admin") return "text-red-400 border-red-400/30 bg-red-400/10";
  if (r.includes("dev")) return "text-primary border-primary/30 bg-primary/10";
  if (r.includes("mod")) return "text-green-400 border-green-400/30 bg-green-400/10";
  if (r.includes("build")) return "text-orange-400 border-orange-400/30 bg-orange-400/10";
  return "text-slate-300 border-slate-300/30 bg-slate-300/10";
}

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const { user: me, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isOwnProfile = isAuthenticated && me?.username === username;
  const [activeTab, setActiveTab] = useState<Tab>("stats");

  const { data: profile, isLoading } = useGetPlayer(username ?? "", {
    query: { enabled: !!username, queryKey: getGetPlayerQueryKey(username ?? "") },
  });
  const { data: myTickets, isLoading: ticketsLoading } = useGetMyTickets({
    query: { enabled: isOwnProfile && activeTab === "tickets", queryKey: getGetMyTicketsQueryKey() },
  });

  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { bio: me?.bio ?? "", minecraftUsername: me?.minecraftUsername ?? "" },
  });
  const passwordForm = useForm<PasswordFormData>({ resolver: zodResolver(passwordSchema) });

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile.mutateAsync({ data });
      queryClient.invalidateQueries({ queryKey: getGetPlayerQueryKey(username ?? "") });
      toast({ title: "Profil aktualisiert" });
    } catch {
      toast({ variant: "destructive", title: "Fehler beim Speichern" });
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      await changePassword.mutateAsync({ data: { currentPassword: data.currentPassword, newPassword: data.newPassword } });
      toast({ title: "Passwort geändert" });
      passwordForm.reset();
    } catch {
      toast({ variant: "destructive", title: "Aktuelles Passwort falsch" });
    }
  };

  const tabs: { id: Tab; label: string; icon: typeof Settings }[] = [
    { id: "stats", label: "Statistiken", icon: Trophy },
    ...(isOwnProfile ? [
      { id: "settings" as Tab, label: "Einstellungen", icon: Settings },
      { id: "security" as Tab, label: "Sicherheit", icon: Shield },
      { id: "tickets" as Tab, label: "Meine Tickets", icon: TicketIcon },
    ] : []),
  ];

  return (
    <Layout>
      <div className="pt-32 pb-24 min-h-screen bg-background relative">
        <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 max-w-5xl relative z-10">
          {isLoading ? (
            <div className="space-y-8">
              <Skeleton className="w-full h-64 rounded-3xl bg-card" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-2xl bg-card" />)}
              </div>
            </div>
          ) : profile ? (
            <div className="space-y-6">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-card/80 border border-border backdrop-blur-md p-8 md:p-12 rounded-3xl flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden"
              >
                <div className="w-28 h-28 md:w-40 md:h-40 rounded-2xl bg-black/50 p-2 border border-border shadow-2xl relative z-10 flex-shrink-0">
                  <img
                    src={`https://mc-heads.net/body/${profile.uuid ?? profile.username}/left`}
                    alt={profile.username}
                    className="w-full h-full object-contain filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
                  />
                </div>
                <div className="text-center md:text-left flex-1 z-10">
                  <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">{profile.username}</h1>
                    <span className={`px-3 py-1 rounded-md text-sm font-bold tracking-wider uppercase border ${getRankColor(profile.role)}`}>{profile.role}</span>
                  </div>
                  <p className="text-muted-foreground text-base mb-4 max-w-lg">
                    {profile.bio || "Dieser Spieler hat noch keine Biografie hinzugefügt."}
                  </p>
                  {profile.uuid && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-mono text-muted-foreground">
                      UUID: {profile.uuid.split("-")[0]}...
                    </div>
                  )}
                </div>
                <div className="absolute left-12 top-1/2 -translate-y-1/2 w-48 h-48 bg-primary/20 blur-[80px] rounded-full" />
              </motion.div>

              {/* Tabs */}
              {isOwnProfile && (
                <div className="flex gap-2 flex-wrap">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === tab.id ? "bg-primary/20 text-primary border border-primary/30" : "bg-card/50 text-muted-foreground border border-border hover:border-primary/20 hover:text-white"}`}
                      data-testid={`tab-${tab.id}`}
                    >
                      <tab.icon size={14} /> {tab.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Stats Tab */}
              {activeTab === "stats" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {[
                      { icon: Swords, value: profile.kills, label: "Kills", color: "text-destructive", hover: "hover:border-destructive/30" },
                      { icon: Ghost, value: profile.deaths, label: "Tode", color: "text-slate-400", hover: "hover:border-slate-400/30" },
                      { icon: Coins, value: profile.coins, label: "Coins", color: "text-yellow-400", hover: "hover:border-yellow-400/30" },
                      { icon: Clock, value: `${Math.floor(profile.playtime / 60)}h`, label: "Spielzeit", color: "text-primary", hover: "hover:border-primary/30" },
                    ].map(({ icon: Icon, value, label, color, hover }) => (
                      <div key={label} className={`bg-card border border-border p-6 rounded-2xl flex flex-col items-center text-center transition-colors ${hover}`}>
                        <Icon className={`${color} mb-3`} size={28} />
                        <div className="text-3xl font-display font-bold text-white mb-1">{value}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">{label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-card/50 border border-border rounded-3xl p-8">
                    <div className="flex items-center gap-3 mb-8">
                      <Trophy className="text-accent" size={24} />
                      <h2 className="text-2xl font-display font-bold text-white">Achievements</h2>
                    </div>
                    {profile.achievements?.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {profile.achievements.map(ach => (
                          <div key={ach.id} className="flex gap-4 p-4 rounded-xl bg-background border border-border">
                            <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 text-2xl">{ach.icon}</div>
                            <div>
                              <h4 className="font-semibold text-white text-sm">{ach.name}</h4>
                              <p className="text-xs text-muted-foreground">{ach.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground flex flex-col items-center">
                        <Award size={48} className="mb-4 opacity-20" />
                        <p>Noch keine Errungenschaften freigeschaltet.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && isOwnProfile && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card/50 border border-border rounded-3xl p-8 space-y-6">
                  <h2 className="text-2xl font-display font-bold text-white">Profil bearbeiten</h2>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Minecraft Benutzername</label>
                      <Input {...profileForm.register("minecraftUsername")} placeholder="Dein Minecraft-Name" className="bg-background border-border max-w-sm" data-testid="input-minecraft-username" />
                      {profileForm.formState.errors.minecraftUsername && <p className="text-xs text-destructive">{profileForm.formState.errors.minecraftUsername.message}</p>}
                      <p className="text-xs text-muted-foreground">Wird für dein Skin-Vorschaubild verwendet.</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Biografie</label>
                      <Textarea {...profileForm.register("bio")} placeholder="Erzähle etwas über dich..." className="bg-background border-border resize-none min-h-[100px] max-w-lg" data-testid="textarea-bio" />
                      {profileForm.formState.errors.bio && <p className="text-xs text-destructive">{profileForm.formState.errors.bio.message}</p>}
                    </div>
                    <Button type="submit" disabled={profileForm.formState.isSubmitting || updateProfile.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-save-profile">
                      {updateProfile.isPending ? "Speichern..." : "Änderungen speichern"}
                    </Button>
                  </form>
                </motion.div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && isOwnProfile && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card/50 border border-border rounded-3xl p-8 space-y-6">
                  <h2 className="text-2xl font-display font-bold text-white">Passwort ändern</h2>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-5 max-w-sm">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Aktuelles Passwort</label>
                      <Input {...passwordForm.register("currentPassword")} type="password" placeholder="••••••••" className="bg-background border-border" data-testid="input-current-password" />
                      {passwordForm.formState.errors.currentPassword && <p className="text-xs text-destructive">{passwordForm.formState.errors.currentPassword.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Neues Passwort</label>
                      <Input {...passwordForm.register("newPassword")} type="password" placeholder="Mindestens 8 Zeichen" className="bg-background border-border" data-testid="input-new-password" />
                      {passwordForm.formState.errors.newPassword && <p className="text-xs text-destructive">{passwordForm.formState.errors.newPassword.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Passwort bestätigen</label>
                      <Input {...passwordForm.register("confirmPassword")} type="password" placeholder="Passwort wiederholen" className="bg-background border-border" data-testid="input-confirm-new-password" />
                      {passwordForm.formState.errors.confirmPassword && <p className="text-xs text-destructive">{passwordForm.formState.errors.confirmPassword.message}</p>}
                    </div>
                    <Button type="submit" disabled={passwordForm.formState.isSubmitting || changePassword.isPending} className="bg-accent text-accent-foreground hover:bg-accent/90" data-testid="button-change-password">
                      {changePassword.isPending ? "Ändern..." : "Passwort ändern"}
                    </Button>
                  </form>
                </motion.div>
              )}

              {/* Tickets Tab */}
              {activeTab === "tickets" && isOwnProfile && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <h2 className="text-2xl font-display font-bold text-white">Meine Tickets</h2>
                  {ticketsLoading ? (
                    <div className="space-y-3">{[1,2].map(i => <Skeleton key={i} className="h-16 rounded-2xl" />)}</div>
                  ) : !myTickets?.length ? (
                    <div className="bg-card/50 border border-border rounded-3xl p-12 flex flex-col items-center text-muted-foreground">
                      <TicketIcon size={48} className="opacity-20 mb-4" />
                      <p>Du hast noch keine Tickets erstellt.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {myTickets.map(ticket => (
                        <div key={ticket.id} className="bg-card/50 border border-border rounded-2xl p-5 flex items-center gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-muted-foreground uppercase">{ticket.type}</span>
                              <span className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${STATUS_COLORS[ticket.status] ?? ""}`}>{STATUS_LABELS[ticket.status] ?? ticket.status}</span>
                            </div>
                            <p className="text-white font-semibold truncate">{ticket.title}</p>
                            <p className="text-xs text-muted-foreground">{new Date(ticket.createdAt).toLocaleDateString("de-DE")}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          ) : (
            <div className="text-center py-32">
              <h2 className="text-3xl font-display font-bold text-white mb-4">Spieler nicht gefunden</h2>
              <p className="text-muted-foreground">Der gesuchte Spieler existiert nicht oder hat den Server noch nie betreten.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
