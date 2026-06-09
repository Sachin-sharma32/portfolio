import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useEffect } from 'react';

import { useCursor } from '@/hooks/useCursor';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/useUIStore';

export const navItems = [
  { id: 'home', label: 'Index' },
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
] as const;

export function Navbar() {
  const { menuOpen, setMenuOpen, toggleMenu, activeSection } = useUIStore();
  const { cursorProps } = useCursor();

  // Lock body scroll while the mobile overlay is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <header className="border-line bg-ink/80 fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a
            href="#home"
            className="group flex items-center gap-2 font-mono text-sm font-bold tracking-wider"
            {...cursorProps('hover')}
          >
            <span className="border-accent text-accent group-hover:bg-accent group-hover:text-ink grid size-7 place-items-center border transition-colors">
              S
            </span>
            <span className="hidden sm:inline">SHARMA</span>
            <span className="text-accent">_</span>
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={cn(
                    'relative px-4 py-2 font-mono text-xs tracking-widest uppercase transition-colors',
                    activeSection === item.id
                      ? 'text-accent'
                      : 'text-muted-bright hover:text-foreground'
                  )}
                  {...cursorProps('hover')}
                >
                  {activeSection === item.id && (
                    <span className="text-accent mr-1.5" aria-hidden>
                      /
                    </span>
                  )}
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            className="link-wipe text-foreground hidden font-mono text-xs tracking-widest uppercase md:inline-block"
            {...cursorProps('hover')}
          >
            Let&apos;s talk →
          </a>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={toggleMenu}
            className="border-line text-foreground grid size-10 place-items-center border md:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="bg-ink fixed inset-0 z-40 flex flex-col justify-center px-6 md:hidden"
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="space-y-2">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.07 }}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-baseline gap-4 py-2"
                  >
                    <span className="text-accent font-mono text-xs">0{i + 1}</span>
                    <span className="font-sans text-4xl font-bold tracking-tight">
                      {item.label}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
