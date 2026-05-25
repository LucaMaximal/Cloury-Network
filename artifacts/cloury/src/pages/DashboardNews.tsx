import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { useState } from "react";
import { useListNews, useCreateNews, useDeleteDashboardNews, getListNewsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Plus, Trash2, FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  title:    z.string().min(3, "Mindestens 3 Zeichen"),
  excerpt:  z.string().min(10, "Mindestens 10 Zeichen"),
  content:  z.string().min(20, "Mindestens 20 Zeichen"),
  category: z.string().min(1, "Pflichtfeld"),
  author:   z.string().min(1, "Pflichtfeld"),
});
type FormData = z.infer<typeof schema>;

export default function DashboardNews() {
  const { data: articles, isLoading } = useListNews();
  const createNews = useCreateNews();
  const deleteNews = useDeleteDashboardNews();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { author: user?.username ?? "" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createNews.mutateAsync({ data });
      queryClient.invalidateQueries({ queryKey: getListNewsQueryKey() });
      toast({ title: "Artikel veröffentlicht" });
      reset({ author: user?.username ?? "" });
      setShowForm(false);
    } catch {
      toast({ variant: "destructive", title: "Fehler beim Erstellen" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNews.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getListNewsQueryKey() });
      toast({ title: "Artikel gelöscht" });
    } catch {
      toast({ variant: "destructive", title: "Fehler beim Löschen" });
    }
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-display font-bold text-white">News</h1>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 flex items-center gap-2"
            data-testid="button-new-article"
          >
            <Plus size={16} /> Neuer Artikel
          </Button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card/50 border border-primary/20 rounded-2xl p-6 space-y-4"
          >
            <h2 className="text-xl font-display font-bold text-white">Neuer Artikel</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Titel</label>
                  <Input {...register("title")} placeholder="Artikel-Titel" className="bg-background border-border" data-testid="input-news-title" />
                  {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Kategorie</label>
                  <Input {...register("category")} placeholder="Update, Event, Ankündigung..." className="bg-background border-border" data-testid="input-news-category" />
                  {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Zusammenfassung</label>
                <Input {...register("excerpt")} placeholder="Kurze Zusammenfassung" className="bg-background border-border" data-testid="input-news-excerpt" />
                {errors.excerpt && <p className="text-xs text-destructive">{errors.excerpt.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Inhalt</label>
                <Textarea {...register("content")} placeholder="Vollständiger Artikel-Inhalt..." className="min-h-[160px] bg-background border-border resize-none" data-testid="textarea-news-content" />
                {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Autor</label>
                <Input {...register("author")} className="bg-background border-border" data-testid="input-news-author" />
                {errors.author && <p className="text-xs text-destructive">{errors.author.message}</p>}
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-publish">
                  {isSubmitting ? "Veröffentlichen..." : "Veröffentlichen"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="border-border text-white hover:bg-white/5">Abbrechen</Button>
              </div>
            </form>
          </motion.div>
        )}

        {isLoading ? (
          <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div>
        ) : !articles?.length ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <FileText size={48} className="opacity-20 mb-4" />
            <p>Noch keine Artikel vorhanden.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {articles.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-card/50 border border-border rounded-2xl p-5 flex items-center gap-4"
                data-testid={`article-row-${article.id}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-primary/10 text-primary border border-primary/20">{article.category}</span>
                    <span className="text-xs text-muted-foreground">{new Date(article.createdAt).toLocaleDateString("de-DE")}</span>
                  </div>
                  <p className="text-white font-semibold truncate">{article.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{article.excerpt}</p>
                </div>
                <button
                  onClick={() => handleDelete(article.id)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                  data-testid={`button-delete-article-${article.id}`}
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
