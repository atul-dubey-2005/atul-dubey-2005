import React, {useEffect, useRef, useState} from 'react';
import {motion, useReducedMotion, useMotionValue, useSpring} from 'motion/react';
import {
  Activity, ArrowDown, ArrowRight, ArrowUpRight, Award, BookOpen, BrainCircuit, Building2,
  Calculator, ChartNoAxesCombined, ChartSpline, Check, ChevronDown, ChevronRight,
  Cloud, Code2, Database, ExternalLink, Figma, Gamepad2, Github, Layers3,
  LockKeyhole, Mail, Menu, MousePointer2, Palette, PanelsTopLeft, PenTool, ShieldCheck,
  ShoppingBag, Sparkles, Satellite, Workflow, X, Zap, GraduationCap, MapPin, Terminal,
  Download, Search, Star, Send, CircleArrowUpRight, Heart, Sun, Moon, Command, Copy,
  BadgeCheck, Quote, ArrowUp, CircleDot, Radar, Globe2, ArrowRightLeft, Braces,
  Scan, Play, RefreshCw, Code, Headphones, MessageSquare, Plus, Rocket
} from 'lucide-react';
const ICONS = {Activity,ArrowDown,ArrowRight,ArrowUpRight,Award,BookOpen,BrainCircuit,Building2,Calculator,ChartNoAxesCombined,ChartSpline,Check,ChevronDown,ChevronRight,Cloud,Code2,Database,ExternalLink,Figma,Gamepad2,Github,Layers3,LockKeyhole,Mail,Menu,MousePointer2,Palette,PanelsTopLeft,PenTool,ShieldCheck,ShoppingBag,Sparkles,Satellite,Workflow,X,Zap,GraduationCap,MapPin,Terminal,Download,Search,Star,Send,CircleArrowUpRight,Heart,Sun,Moon,Command,Copy,BadgeCheck,Quote,ArrowUp,CircleDot,Radar,Globe2,ArrowRightLeft,Braces,Scan,Play,RefreshCw,Code,Headphones,MessageSquare,Plus,Rocket};
export function Icon({name,size=19,...props}) {const Component=ICONS[name]||Sparkles;return <Component size={size} strokeWidth={1.8} {...props}/>}
export function Reveal({children,className='',delay=0,amount=0.12,...props}) {
  const reduce=useReducedMotion();
  return <motion.div className={className} initial={reduce?false:{opacity:0,y:34,filter:'blur(7px)'}} whileInView={{opacity:1,y:0,filter:'blur(0px)'}} viewport={{once:true,amount}} transition={{duration:0.7,delay,ease:[0.22,1,0.36,1]}} {...props}>{children}</motion.div>;
}
export function SectionIntro({number,eyebrow,title,accent,description,side}) {
 return <Reveal className="section-intro"><div className="section-label"><span className="serial">{number}</span><span className="little-line"/>{eyebrow}</div><div className="section-title-row"><h2 className="section-heading">{title} {accent&&<span className="gradient-word">{accent}</span>}</h2>{side&&<div className="intro-side">{side}</div>}</div>{description&&<p className="section-description">{description}</p>}</Reveal>
}
export function TiltCard({children,className='',...props}) {
 const x=useMotionValue(0),y=useMotionValue(0);const rx=useSpring(y,{stiffness:180,damping:21}),ry=useSpring(x,{stiffness:180,damping:21});
 const reduce=useReducedMotion();
 const onMove=e=>{if(reduce || matchMedia('(pointer:coarse)').matches)return;const r=e.currentTarget.getBoundingClientRect();x.set(((e.clientX-r.left)/r.width-.5)*8);y.set(-((e.clientY-r.top)/r.height-.5)*8);e.currentTarget.style.setProperty('--px',`${e.clientX-r.left}px`);e.currentTarget.style.setProperty('--py',`${e.clientY-r.top}px`)};
 return <motion.div className={`glass-card tilt-card ${className}`} onMouseMove={onMove} onMouseLeave={()=>{x.set(0);y.set(0)}} style={reduce?undefined:{rotateX:rx,rotateY:ry,transformPerspective:1300}} {...props}>{children}</motion.div>
}
export function GlowButton({href,children,secondary=false,external=false,onClick,type='button',className='',...props}) {
 const cls=`action-btn ${secondary?'action-secondary':'action-primary'} ${className}`;
 if(href)return <a className={cls} href={href} {...(external?{target:'_blank',rel:'noopener noreferrer'}:{})} {...props}>{children}</a>;
 return <button className={cls} onClick={onClick} type={type} {...props}>{children}</button>
}
export function Badge({children,color='lime',className=''}) {return <span className={`tag tone-${color} ${className}`}>{children}</span>}
export function Marquee(){const tags=['React','Java','Python','Spring Boot','JavaScript','Node.js','PostgreSQL','Git & GitHub','Data Visualization','REST APIs'];return <div className="marquee-shell" aria-label="Technologies"><div className="marquee-track">{[...tags,...tags].map((t,i)=><span key={i}><span className="marquee-star">✳</span>{t}</span>)}</div></div>}
export function CountUp({end,suffix='',className=''}) {
 const ref=useRef(null);const [number,setNumber]=useState(0);const reduce=useReducedMotion();
 useEffect(()=>{let animation;const target=ref.current;if(!target)return;const obs=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)return;obs.disconnect();if(reduce){setNumber(end);return}const start=performance.now();function tick(now){const t=Math.min(1,(now-start)/1100);setNumber(Math.round(end*(1-Math.pow(1-t,3))));if(t<1)animation=requestAnimationFrame(tick)}animation=requestAnimationFrame(tick)},{threshold:0.5});obs.observe(target);return()=>{obs.disconnect();cancelAnimationFrame(animation)}},[end,reduce]);
 return <span ref={ref} className={className}>{number}{suffix}</span>
}
export function ProjectArt({art,icon}){
 return <div className={`project-art art-${art}`} aria-hidden="true"><div className="art-grid"/><div className="art-halo"/>
 {art==='fraud'&&<div className="art-center art-center-fraud"><div className="scan-ring r1"/><div className="scan-ring r2"/><Icon name="ShieldCheck" size={68}/><span>THREAT SCAN</span><b>SECURE</b></div>}
 {art==='fitness'&&<div className="art-window fitness-window"><div className="art-dots">•••</div><div className="fitness-row"><Icon name="Heart" size={33}/><strong>HEALTH SYNC</strong></div><div className="heart-line"><svg viewBox="0 0 360 90" preserveAspectRatio="none"><path d="M0 57L35 57L47 35L64 76L93 7L112 61L136 50L171 50L184 34L199 62L230 62L248 40L270 51L360 51" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/></svg></div><div className="fitness-chart-numbers"><span>80 bpm</span><span>+24.6% this week</span></div></div>}
 {art==='calculator'&&<div className="art-window calc-window"><div className="calc-top">SCI / PRO <span>● LIVE</span></div><div className="calc-number">(24 × 8) + 16</div><div className="calc-result">208<span>=</span></div><div className="calc-keys">{['sin','cos','tan','÷','7','8','9','×','4','5','6','−'].map(x=><span key={x}>{x}</span>)}</div></div>}
 {art==='commerce'&&<div className="art-window commerce-window"><div className="art-dots">•••</div><div className="commerce-head"><Icon name="ShoppingBag" size={26}/> STORE / 01</div><div className="commerce-items"><div>✦</div><div>✦</div><div>✦</div></div><div className="commerce-footer"><span>CHECKOUT READY</span><Icon name="ArrowUpRight"/></div></div>}
 {art==='civic'&&<div className="art-center art-civic"><Icon name="Building2" size={90}/><div className="status-bar"><span/>INCIDENT RESOLVED <b>98%</b></div></div>}
 {art==='shield'&&<div className="art-center art-shield"><div className="security-circle"><Icon name="LockKeyhole" size={66}/></div><div className="mono-label">SHA-256 VERIFIED</div></div>}
 {art==='gaming'&&<div className="art-center art-gaming"><Icon name="Gamepad2" size={104}/><div>READY PLAYER ONE_</div></div>}
 {art==='book'&&<div className="art-center art-book"><Icon name="BookOpen" size={94}/><div>LIBRARY / ONLINE</div></div>}
 <span className="art-corner-icon"><Icon name={icon} size={20}/></span>
 </div>
}
