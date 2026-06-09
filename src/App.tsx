import { CustomCursor } from '@/components/CustomCursor';
import { Footer } from '@/components/Footer';
import { Navbar, navItems } from '@/components/Navbar';
import { ScrollProgress } from '@/components/ScrollProgress';
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
    <>
      <div className="noise-overlay" aria-hidden />
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
    </>
  );
}
