import { CustomCursor } from '@/components/CustomCursor';
import { Footer } from '@/components/Footer';
import { Navbar, navItems } from '@/components/Navbar';
import { Preloader } from '@/components/Preloader';
import { ScrollProgress } from '@/components/ScrollProgress';
import { SmoothScroll } from '@/components/SmoothScroll';
import { About } from '@/components/sections/About';
import { Contact } from '@/components/sections/Contact';
import { Experience } from '@/components/sections/Experience';
import { Hero } from '@/components/sections/Hero';
import { Projects } from '@/components/sections/Projects';
import { Skills } from '@/components/sections/Skills';
import { useSectionObserver } from '@/hooks/useSectionObserver';

const sectionIds = navItems.map((n) => n.id);

export default function App() {
  useSectionObserver(sectionIds);

  return (
    <SmoothScroll>
      <div className="noise-overlay" aria-hidden />
      <Preloader />
      <CustomCursor />
      <Navbar />
      <ScrollProgress />

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>

      <Footer />
    </SmoothScroll>
  );
}
