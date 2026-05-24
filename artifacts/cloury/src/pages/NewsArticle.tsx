import { Layout } from "@/components/Layout";
import { useParams, Link } from "wouter";
import { useGetNews } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewsArticle() {
  const { id } = useParams();
  const articleId = parseInt(id || "0", 10);
  
  const { data: article, isLoading } = useGetNews(articleId, { 
    query: { enabled: !!articleId, queryKey: ["getNews", articleId] } 
  });

  return (
    <Layout>
      <div className="pt-32 pb-24 min-h-screen bg-background relative">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          
          <Link href="/news" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-8">
            <ArrowLeft size={16} /> Zurück zur Übersicht
          </Link>

          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4 bg-card rounded-xl" />
              <div className="flex gap-4">
                <Skeleton className="h-6 w-24 bg-card" />
                <Skeleton className="h-6 w-32 bg-card" />
              </div>
              <Skeleton className="h-96 w-full bg-card rounded-2xl mt-8" />
              <div className="space-y-4 mt-8">
                <Skeleton className="h-4 w-full bg-card" />
                <Skeleton className="h-4 w-full bg-card" />
                <Skeleton className="h-4 w-2/3 bg-card" />
              </div>
            </div>
          ) : article ? (
            <motion.article 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm font-mono text-muted-foreground">
                <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
                  <Tag size={14} /> {article.category}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} /> {format(new Date(article.createdAt), "dd. MMMM yyyy", { locale: de })}
                </div>
                <div className="flex items-center gap-2">
                  <User size={14} /> {article.author}
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-10 leading-tight">
                {article.title}
              </h1>

              {article.imageUrl && (
                <div className="rounded-2xl overflow-hidden mb-12 border border-border shadow-2xl relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent z-10" />
                  <img src={article.imageUrl} alt={article.title} className="w-full h-auto object-cover max-h-[500px]" />
                </div>
              )}

              <div className="prose prose-invert prose-lg prose-p:text-muted-foreground prose-headings:font-display prose-a:text-primary max-w-none">
                {/* Assuming content is markdown or HTML. For simplicity, rendering as string with newlines */}
                {article.content.split('\n').map((paragraph, i) => (
                  paragraph ? <p key={i}>{paragraph}</p> : <br key={i} />
                ))}
              </div>
            </motion.article>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              Artikel nicht gefunden.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
