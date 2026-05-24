import { motion } from "framer-motion";
import { useListNews } from "@workspace/api-client-react";
import { Link } from "wouter";
import { ArrowRight, Calendar } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

export function NewsPreview() {
  const { data: news, isLoading } = useListNews({ limit: 3 });

  return (
    <section className="py-24 bg-card/10 border-t border-border/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Neueste <span className="text-primary">Updates</span></h2>
            <p className="text-muted-foreground">Bleib auf dem Laufenden über Entwicklungen und Ankündigungen.</p>
          </div>
          <Link href="/news" className="text-primary hover:text-white flex items-center gap-2 font-medium mt-4 md:mt-0 transition-colors">
            Alle News ansehen <ArrowRight size={16} />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-80 w-full rounded-2xl bg-card" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news?.map((article, idx) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={`/news/${article.id}`} className="group block h-full">
                  <div className="bg-card border border-border rounded-2xl overflow-hidden h-full flex flex-col hover:border-primary/30 transition-colors shadow-lg">
                    {article.imageUrl && (
                      <div className="h-48 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent z-10" />
                        <img 
                          src={article.imageUrl} 
                          alt={article.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-4 mb-4 text-xs font-mono text-muted-foreground">
                        <span className="px-2 py-1 rounded bg-white/5 text-primary border border-primary/20">{article.category}</span>
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          {format(new Date(article.createdAt), "dd. MMM yyyy", { locale: de })}
                        </div>
                      </div>
                      <h3 className="text-xl font-display font-semibold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center text-primary text-sm font-medium">
                        Weiterlesen <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
