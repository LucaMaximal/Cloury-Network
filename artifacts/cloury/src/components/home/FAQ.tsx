import { motion } from "framer-motion";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Welche Minecraft Versionen werden unterstützt?",
    answer: "Unser Netzwerk unterstützt alle Versionen von 1.16.5 bis zur neuesten Version (1.20+). Für das beste Spielerlebnis empfehlen wir jedoch immer die aktuellste Version zu nutzen."
  },
  {
    question: "Gibt es Pay-to-Win Elemente?",
    answer: "Nein. Cloury Network hält sich streng an die Mojang EULA. Alle käuflichen Ränge und Gegenstände bieten ausschließlich kosmetische Vorteile oder Quality-of-Life Features, die keinen unfairen Spielvorteil verschaffen."
  },
  {
    question: "Wie kann ich mich als Teammitglied bewerben?",
    answer: "Bewerbungsphasen werden auf unserem Discord-Server sowie auf der News-Seite angekündigt. Während einer aktiven Phase kannst du dich über unser Bewerbungsportal bewerben."
  },
  {
    question: "Mein Account wurde gebannt. Was kann ich tun?",
    answer: "Wenn du der Meinung bist, dass dein Bann ungerechtfertigt war, kannst du in unserem Support-Bereich oder auf dem Discord-Server einen Entbannungsantrag (Ticket) erstellen."
  },
  {
    question: "Unterstützt Cloury Bedrock-Spieler?",
    answer: "Aktuell fokussieren wir uns auf ein perfektes Java-Edition Erlebnis. Eine Unterstützung für Bedrock-Clients via GeyserMC ist jedoch für die Zukunft geplant."
  }
];

export function FAQ() {
  return (
    <section className="py-24 bg-card/5 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/5 blur-[150px] rounded-full pointer-events-none -translate-y-1/2 -translate-x-1/2" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-4xl">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-4"
          >
            <HelpCircle size={14} />
            <span>FAQ</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-display font-bold text-white mb-6"
          >
            Häufig gestellte <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Fragen</span>
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="bg-card border border-border rounded-xl px-6 py-2">
                <AccordionTrigger className="text-left font-display font-semibold text-lg text-white hover:text-primary hover:no-underline transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
