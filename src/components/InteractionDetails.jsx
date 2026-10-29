import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { Icon } from './Primitives';

/** Original, self-contained text roll interaction informed by Skiper UI's free text-roll demonstrations. */
export function TextRoll({ children, className = '' }) {
  const reduce = useReducedMotion();
  return <span className={`text-roll ${className}`} aria-label={children}>
    {String(children).split('').map((character, index) => <span aria-hidden="true" className="text-roll-letter" key={index} style={{ '--order': index }}>
      <span>{character === ' ' ? '\u00a0' : character}</span><span>{character === ' ' ? '\u00a0' : character}</span>
    </span>)}
  </span>;
}

/** Cursor-driven glow borders, implemented as lightweight CSS variables (Vengeance-style). */
export function SpotlightPanel({ children, className = '' }) {
  const move = (e) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--spot-x', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--spot-y', `${e.clientY - r.top}px`);
  };
  return <div onPointerMove={move} className={`spotlight-panel ${className}`}>{children}</div>;
}

/** CSS-led magnetic action; keyboard & touch don't rely on hover. */
export function MagneticLink({ href, children, className = '', ...props }) {
  const x = useSpring(0, { stiffness: 260, damping: 23 });
  const y = useSpring(0, { stiffness: 260, damping: 23 });
  const reduced = useReducedMotion();
  const move = (e) => {
    if (reduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * .16);
    y.set((e.clientY - r.top - r.height / 2) * .16);
  };
  return <motion.a href={href} className={`magnetic-link ${className}`} style={{ x, y }} onMouseMove={move} onMouseLeave={() => { x.set(0); y.set(0); }} {...props}>{children}</motion.a>;
}

/** Floating, accessible bottom dock, shown on larger screens only. */
export function MotionDock() {
  const links = [['#top', 'House', 'Home'], ['#projects', 'PanelsTopLeft', 'Work'], ['#creative-lab', 'Sparkles', 'Motion Lab'], ['#contact', 'Mail', 'Contact']];
  const [scroll, setScroll] = useState(0);
  useEffect(() => {
    let raf = 0;
    const read = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => setScroll(window.scrollY)); };
    window.addEventListener('scroll', read, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', read); };
  }, []);
  return <nav className={`motion-dock ${scroll > 240 ? 'dock-visible' : ''}`} aria-label="Quick navigation">
    {links.map(([href, icon, label]) => <a key={href} href={href} aria-label={label} data-tooltip={label}><Icon name={icon} size={18}/><span className="sr-only">{label}</span></a>)}
  </nav>;
}

/** Scroll-linked editorial strip, disabled by OS reduced-motion setting. */
export function KineticManifesto() {
  const target = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target, offset: ['start end', 'end start'] });
  const shift = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);
  return <section className="kinetic-manifesto" ref={target} aria-label="Design philosophy">
    <motion.div className="kinetic-line" style={reduced ? undefined : { x: shift }}>
      <span>DESIGN</span><span className="kinetic-asterisk">✳</span><span>BUILD</span><span className="kinetic-asterisk">✳</span><span>ANIMATE</span><span className="kinetic-asterisk">✳</span><span>EVOLVE</span>
    </motion.div>
  </section>;
}
