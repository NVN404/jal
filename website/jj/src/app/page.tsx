import Header from '@/components/layout/header';
import Hero from '@/components/sections/hero';
import Solution from '@/components/sections/solution';
import Partners from '@/components/sections/partners';
import Roadmap from '@/components/sections/roadmap';
import Footer from '@/components/layout/footer';
import About from '@/components/sections/about';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <Hero />
        <About />
        <Solution />
        <Partners />
        <Roadmap />
      </main>
      <Footer />
    </div>
  );
}
