import { Layout } from "@/components/Layout";
import { useListNews } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Calendar, ArrowRight, FileText } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

export default function News() {
  const { data: news, isLoading } = useListNews();

  return (
    <Layout>
      <div className="pt-32 pb-24 min-h-screen bg-background relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4"
            >
              <FileText size={14} />
              <span>Neuigkeiten</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-white"
            >
              Network <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Updates</span>
            </motion.h1>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-96 w-full rounded-2xl bg-card" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news?.map((article, idx) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link href={`/news/${article.id}`} className="group block h-full">
                    <div className="bg-card/50 border border-border rounded-2xl overflow-hidden h-full flex flex-col hover:border-primary/30 transition-all hover:-translate-y-1 shadow-lg hover:shadow-primary/5">
                      {article.imageUrl ? (
                        <div className="h-56 overflow-hidden relative">
                          <div className="absolute inset-0 bg-gradient-to-t from-card/50 to-transparent z-10" />
                          <img 
                            src={article.imageUrl} 
                            alt={article.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                      ) : (
                        <div className="h-40 bg-muted/20 flex items-center justify-center">
                          <FileText size={48} className="text-muted/30" />
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
                        <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="text-xs font-mono text-muted-foreground">
                            Von <span className="text-white">{article.author}</span>
                          </div>
                          <div className="flex items-center text-primary text-sm font-medium">
                            Lesen <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
