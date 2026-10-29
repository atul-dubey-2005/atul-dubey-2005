import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';

/** A custom pointer only on precise pointer devices. Keyboard, touch and reduced-motion retain native behavior. */
export default function CreativeCursor() {
  const reduced = useReducedMotion();
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const followX = useSpring(x, { stiffness: 280, damping: 27, mass: 0.48 });
  const followY = useSpring(y, { stiffness: 280, damping: 27, mass: 0.48 });
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState('default');
  const [pressed, setPressed] = useState(false);
  const [label, setLabel] = useState('');
  const frame = useRef(0);
  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    const setEnabledFromMedia = () => setEnabled(media.matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    setEnabledFromMedia(); media.addEventListener('change', setEnabledFromMedia);
    return () => media.removeEventListener('change', setEnabledFromMedia);
  }, []);
  useEffect(() => {
    if (!enabled || reduced) return;
    const onMove = (e) => {
      cancelAnimationFrame(frame.current);
      const clientX = e.clientX, clientY = e.clientY;
      frame.current = requestAnimationFrame(() => { x.set(clientX); y.set(clientY); setVisible(true); });
      const target = e.target instanceof Element ? e.target : null;
      const link = target?.closest('a, button, [role="button"], [role="tab"], [data-cursor]');
      const field = target?.closest('input, textarea, select, [contenteditable="true"]');
      const card = target?.closest('.project-card, .tilt-card, .lab-stage');
      setMode(field ? 'text' : link ? 'link' : card ? 'view' : 'default');
      setLabel(link?.getAttribute('data-cursor') || (card && !link ? 'VIEW' : ''));
      document.documentElement.style.setProperty('--mouse-x', `${clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${clientY}px`);
    };
    const onDown = () => setPressed(true), onUp = () => setPressed(false);
    const onLeave = () => setVisible(false), onEnter = () => setVisible(true);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown); window.addEventListener('pointerup', onUp);
    document.addEventListener('pointerleave', onLeave); document.addEventListener('pointerenter', onEnter);
    document.body.classList.add('fancy-cursor-enabled');
    return () => {
      cancelAnimationFrame(frame.current); window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown); window.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerleave', onLeave); document.removeEventListener('pointerenter', onEnter);
      document.body.classList.remove('fancy-cursor-enabled');
    };
  }, [enabled, reduced, x, y]);
  if (!enabled || reduced) return null;
  return <div className={`creative-pointer ${visible ? 'is-visible' : ''} mode-${mode} ${pressed ? 'is-pressed' : ''}`} aria-hidden="true">
    <motion.div className="creative-pointer-halo" style={{ x: followX, y: followY }}><span>{label || (mode === 'link' ? '↗' : mode === 'view' ? 'VIEW' : '')}</span></motion.div>
    <motion.div className="creative-pointer-tip" style={{ x, y }}><svg viewBox="0 0 24 24" width="26" height="26" fill="none"><path d="M3 2v17.1l4.48-4.65 3.05 6.25 3.15-1.55-3.09-6.3 6.79-.11L3 2Z" fill="currentColor" stroke="#080912" strokeWidth="1.4" strokeLinejoin="round"/></svg></motion.div>
  </div>;
}
