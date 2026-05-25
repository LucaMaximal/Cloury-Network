import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LifeBuoy, MessageSquare, Send, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useCreateTicket } from "@workspace/api-client-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";

const schema = z.object({
  type: z.enum(["Support", "Bug", "Report"]),
  title: z.string().min(5, "Mindestens 5 Zeichen"),
  content: z.string().min(20, "Mindestens 20 Zeichen"),
});
type FormData = z.infer<typeof schema>;

export default function Support() {
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const createTicket = useCreateTicket();

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createTicket.mutateAsync({ data });
      toast({ title: "Ticket erstellt", description: "Wir werden uns schnellstmöglich darum kümmern." });
      reset();
    } catch {
      toast({ variant: "destructive", title: "Fehler", description: "Ticket konnte nicht erstellt werden." });
    }
  };

  return (
    <Layout>
      <div className="pt-32 pb-24 min-h-screen bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 max-w-5xl relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-4"
            >
              <LifeBuoy size={14} />
              <span>Support Center</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-white"
            >
              Wie können wir <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">helfen?</span>
            </motion.h1>
          </div>

          <div className="grid md:grid-cols-5 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="md:col-span-2 space-y-6"
            >
              <div className="bg-card border border-border p-6 rounded-2xl">
                <h3 className="text-lg font-display font-bold text-white mb-2">Schnellhilfe</h3>
                <p className="text-muted-foreground text-sm mb-6">Oft lassen sich Probleme ohne Ticket lösen. Schau im Wiki oder Discord vorbei.</p>
                <div className="space-y-3">
                  <Link href="/wiki" className="flex items-center gap-3 p-3 rounded-xl bg-background hover:bg-white/5 border border-border transition-colors text-sm text-white">
                    <span className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold">1</span>
                    Wiki durchsuchen
                  </Link>
                  <a href="https://discord.gg/cloury" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-[#5865F2]/10 hover:bg-[#5865F2]/20 border border-[#5865F2]/20 transition-colors text-sm text-white">
                    <span className="w-8 h-8 rounded-lg bg-[#5865F2] text-white flex items-center justify-center"><MessageSquare size={16} /></span>
                    Discord Community
                  </a>
                </div>
              </div>

              <div className="bg-card/50 border border-border p-6 rounded-2xl">
                <h3 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">Antwortzeiten</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex justify-between"><span>Support:</span> <span className="text-white">~2 Stunden</span></li>
                  <li className="flex justify-between"><span>Bug Reports:</span> <span className="text-white">~24 Stunden</span></li>
                  <li className="flex justify-between"><span>Meldungen:</span> <span className="text-white">~12 Stunden</span></li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="md:col-span-3 bg-card border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full" />

              {!isAuthenticated ? (
                <div className="flex flex-col items-center justify-center py-16 text-center relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                    <Lock className="text-primary" size={28} />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-white mb-3">Login erforderlich</h2>
                  <p className="text-muted-foreground mb-8 max-w-sm">Um ein Ticket zu erstellen, musst du eingeloggt sein. Erstelle jetzt einen kostenlosen Account.</p>
                  <div className="flex gap-3">
                    <Link href="/login">
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(0,229,255,0.2)]">Anmelden</Button>
                    </Link>
                    <Link href="/register">
                      <Button variant="outline" className="border-border text-white hover:bg-white/5">Registrieren</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="relative z-10">
                  <h2 className="text-2xl font-display font-bold text-white mb-6">Ticket erstellen</h2>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Kategorie</label>
                      <Controller
                        control={control}
                        name="type"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="bg-background border-border h-12" data-testid="select-type">
                              <SelectValue placeholder="Wähle eine Kategorie" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Support">Support</SelectItem>
                              <SelectItem value="Bug">Bug Report</SelectItem>
                              <SelectItem value="Report">Spieler melden</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Betreff</label>
                      <Input
                        {...register("title")}
                        placeholder="Kurze Beschreibung deines Anliegens"
                        className="bg-background border-border h-12"
                        data-testid="input-title"
                      />
                      {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Beschreibung</label>
                      <Textarea
                        {...register("content")}
                        placeholder="Beschreibe dein Problem so detailliert wie möglich..."
                        className="min-h-[150px] bg-background border-border resize-none"
                        data-testid="textarea-content"
                      />
                      {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || createTicket.isPending}
                      className="w-full h-12 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 shadow-[0_0_15px_rgba(0,229,255,0.2)]"
                      data-testid="button-submit-ticket"
                    >
                      {createTicket.isPending ? (
                        <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-background/40 border-t-background rounded-full animate-spin" /> Senden...</span>
                      ) : (
                        <span className="flex items-center gap-2"><Send size={18} /> Ticket absenden</span>
                      )}
                    </Button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
