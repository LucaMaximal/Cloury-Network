import { Layout } from "@/components/Layout";
import { Hero } from "@/components/home/Hero";
import { LiveServerStatus } from "@/components/home/LiveServerStatus";
import { Features } from "@/components/home/Features";
import { CoreSystems } from "@/components/home/CoreSystems";
import { Stats } from "@/components/home/Stats";
import { NewsPreview } from "@/components/home/NewsPreview";
import { EventsPreview } from "@/components/home/EventsPreview";
import { FAQ } from "@/components/home/FAQ";
import { SupportCTA } from "@/components/home/SupportCTA";

export default function Home() {
  return (
    <Layout>
      <Hero />
      <LiveServerStatus />
      <Features />
      <CoreSystems />
      <Stats />
      <NewsPreview />
      <EventsPreview />
      <FAQ />
      <SupportCTA />
    </Layout>
  );
}
