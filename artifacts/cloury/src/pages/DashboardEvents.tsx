import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { useState } from "react";
import { useListEvents, useCreateEvent, useDeleteDashboardEvent, getListEventsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  title:       z.string().min(3, "Mindestens 3 Zeichen"),
  description: z.string().min(10, "Mindestens 10 Zeichen"),
  date:        z.string().min(1, "Datum erforderlich"),
  type:        z.string().min(1, "Pflichtfeld"),
  prize:       z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function DashboardEvents() {
  const { data: events, isLoading } = useListEvents();
  const createEvent = useCreateEvent();
  const deleteEvent = useDeleteDashboardEvent();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createEvent.mutateAsync({ data: { ...data, date: new Date(data.date).toISOString() } });
      queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() });
      toast({ title: "Event erstellt" });
      reset();
      setShowForm(false);
    } catch {
      toast({ variant: "destructive", title: "Fehler beim Erstellen" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEvent.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() });
      toast({ title: "Event gelöscht" });
    } catch {
      toast({ variant: "destructive", title: "Fehler beim Löschen" });
    }
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-display font-bold text-white">Events</h1>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 flex items-center gap-2"
            data-testid="button-new-event"
          >
            <Plus size={16} /> Neues Event
          </Button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card/50 border border-primary/20 rounded-2xl p-6 space-y-4"
          >
            <h2 className="text-xl font-display font-bold text-white">Neues Event</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Titel</label>
                  <Input {...register("title")} placeholder="Event-Titel" className="bg-background border-border" data-testid="input-event-title" />
                  {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Typ</label>
                  <Input {...register("type")} placeholder="Turnier, Build, Community..." className="bg-background border-border" data-testid="input-event-type" />
                  {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Datum & Uhrzeit</label>
                  <Input {...register("date")} type="datetime-local" className="bg-background border-border" data-testid="input-event-date" />
                  {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Preis (optional)</label>
                  <Input {...register("prize")} placeholder="z.B. 500 Coins + Kosmetika" className="bg-background border-border" data-testid="input-event-prize" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Beschreibung</label>
                <Textarea {...register("description")} placeholder="Event-Beschreibung..." className="min-h-[100px] bg-background border-border resize-none" data-testid="textarea-event-description" />
                {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-create-event">
                  {isSubmitting ? "Erstellen..." : "Event erstellen"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="border-border text-white hover:bg-white/5">Abbrechen</Button>
              </div>
            </form>
          </motion.div>
        )}

        {isLoading ? (
          <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div>
        ) : !events?.length ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Calendar size={48} className="opacity-20 mb-4" />
            <p>Noch keine Events vorhanden.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-card/50 border border-border rounded-2xl p-5 flex items-center gap-4"
                data-testid={`event-row-${event.id}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-accent/10 text-accent border border-accent/20">{event.type}</span>
                    <span className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <p className="text-white font-semibold truncate">{event.title}</p>
                  {event.prize && <p className="text-xs text-yellow-400 mt-0.5">Preis: {event.prize}</p>}
                </div>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                  data-testid={`button-delete-event-${event.id}`}
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
