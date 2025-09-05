import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import TrustFooter from "@/components/TrustFooter";

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16">
        <div className="container max-w-6xl mx-auto px-6">
          <Hero />
        </div>
        
        <div id="features">
          <Features />
        </div>
        
        <TrustFooter />
      </div>
    </main>
  );
}