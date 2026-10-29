import React, {lazy, Suspense, useEffect, useRef, useState} from 'react';
import {motion, useReducedMotion, useScroll, useTransform} from 'motion/react';
import {Icon, Reveal} from './Primitives';

// Split optional player bundles. The site does not require a third-party scene or hosted animation to load.
const Spline = lazy(() => import('@splinetool/react-spline'));
const RiveAnimation = lazy(() => import('./RiveAnimation'));
const LottieAnimation = lazy(() => import('./OrbitLottie'));
const scene = import.meta.env.VITE_SPLINE_SCENE_URL || '';
const riveFile = import.meta.env.VITE_RIVE_SRC || '';

const vertexShader = 'attribute vec2 p; void main(){gl_Position=vec4(p,0.,1.);}';
const fragmentShader = `precision mediump float;
uniform vec2 resolution;
uniform float time;
uniform vec3 c0;
uniform vec3 c1;
uniform vec3 c2;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
void main(){vec2 uv=gl_FragCoord.xy/resolution;float t=time*.24;
float wave=noise(uv*2.9+vec2(t,-t*.6));
float a=sin((uv.x+wave*.4+t*.36)*6.283)*.5+.5;
float b=cos((uv.y-wave*.3-t*.19)*6.283)*.5+.5;
vec3 col=mix(c0,c1,a);col=mix(col,c2,b*.65);
float spotlight=1.-smoothstep(.10,.93,length(uv-vec2(.5,.5)));
col*=.19+.42*spotlight;
col+=.08*pow(max(0.,1.-abs(uv.x+uv.y+wave*.19-.98)),6.);
gl_FragColor=vec4(col,1.);
}`;
function rgb(hex){const n=parseInt(hex.replace('#',''),16);return [(n>>16&255)/255,(n>>8&255)/255,(n&255)/255]}
function getPalette(){const s=getComputedStyle(document.documentElement);return ['--accent','--secondary','--tertiary'].map(v=>rgb(s.getPropertyValue(v).trim()||'#f5a981'))}
function makeShader(gl,type,src){const shader=gl.createShader(type);gl.shaderSource(shader,src);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(shader));return shader}
/** Lightweight WebGL gradient with static CSS fallback; renders only when visible. */
export function ShaderGradient({className=''}){
 const ref=useRef(null),reduce=useReducedMotion();
 useEffect(()=>{const canvas=ref.current;if(!canvas||reduce)return;
 const gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power',preserveDrawingBuffer:false});if(!gl)return;
 let frame=0,disposed=false,shown=true,last=0,frameTime=0,observer,resizeObserver,themeObserver,program,vbo;
 try{
  const v=makeShader(gl,gl.VERTEX_SHADER,vertexShader),f=makeShader(gl,gl.FRAGMENT_SHADER,fragmentShader);
  program=gl.createProgram();gl.attachShader(program,v);gl.attachShader(program,f);gl.linkProgram(program);gl.deleteShader(v);gl.deleteShader(f);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('shader program linking failed');
  gl.useProgram(program);vbo=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  const position=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  const res=gl.getUniformLocation(program,'resolution'),tick=gl.getUniformLocation(program,'time');
  const a=[0,1,2].map(i=>gl.getUniformLocation(program,'c'+i));
  const paint=()=>{const colors=getPalette();colors.forEach((c,i)=>gl.uniform3fv(a[i],c));};paint();
  const resize=()=>{const rect=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,1.4);canvas.width=Math.max(1,Math.floor(rect.width*dpr));canvas.height=Math.max(1,Math.floor(rect.height*dpr));gl.viewport(0,0,canvas.width,canvas.height);gl.uniform2f(res,canvas.width,canvas.height)};
  const draw=timestamp=>{if(disposed||!shown||document.hidden)return;if(timestamp-last>=33){frameTime+=Math.min((timestamp-last)/1000,.1);last=timestamp;gl.uniform1f(tick,frameTime);gl.drawArrays(gl.TRIANGLE_STRIP,0,4)}frame=requestAnimationFrame(draw)};
  const start=()=>{cancelAnimationFrame(frame);last=0;frame=requestAnimationFrame(draw)};
  observer=new IntersectionObserver(e=>{shown=e[0]?.isIntersecting||false;if(shown)start();else cancelAnimationFrame(frame)},{threshold:0});observer.observe(canvas);
  resizeObserver=new ResizeObserver(resize);resizeObserver.observe(canvas);resize();
  themeObserver=new MutationObserver(paint);themeObserver.observe(document.documentElement,{attributes:true,attributeFilter:['data-palette']});
  document.addEventListener('visibilitychange',start);
  return()=>{disposed=true;cancelAnimationFrame(frame);observer?.disconnect();resizeObserver?.disconnect();themeObserver?.disconnect();document.removeEventListener('visibilitychange',start);if(vbo)gl.deleteBuffer(vbo);if(program)gl.deleteProgram(program)};
 }catch(error){console.warn('Falling back to CSS gradient:',error);if(vbo)gl.deleteBuffer(vbo);if(program)gl.deleteProgram(program);return()=>{cancelAnimationFrame(frame);observer?.disconnect();resizeObserver?.disconnect();themeObserver?.disconnect()}}
 },[reduce]);
 return <div className={`shader-gradient ${className}`} aria-hidden="true"><canvas ref={ref}/><div className="shader-vignette"/></div>
}
function FloatingGeometry(){const reduce=useReducedMotion();return <div className="orbital-installation" aria-hidden="true"><div className="orbit-grid"/><motion.div className="orbital-sculpture" animate={reduce?undefined:{rotateY:[-22,338],rotateX:[12,21,12]}} transition={{duration:24,repeat:Infinity,ease:'linear'}}><span className="sculpture-ring sring-a"/><span className="sculpture-ring sring-b"/><span className="sculpture-ring sring-c"/><span className="sculpture-core"><Icon name="Sparkles" size={56}/></span></motion.div><span className="orbit-coordinate">X / 48.30°</span><span className="orbit-coordinate two">Y / 19.84°</span></div>}
function RivePlaceholder(){return <motion.div className="rive-fallback" initial={false} animate={{rotate:360}} transition={{duration:35,repeat:Infinity,ease:'linear'}} aria-hidden="true"><span/><span/><span/><div className="rive-center"><Icon name="Layers3" size={38}/></div></motion.div>}
export function MotionExperience(){const reduce=useReducedMotion(),[tab,setTab]=useState('shader');const tabs=['shader','3d','motion'];const ref=useRef(null);const {scrollYProgress}=useScroll({target:ref,offset:['start end','end start']});const scrollMove=useTransform(scrollYProgress,[0,1],[40,-40]);return <section className="experience-lab section section-container" id="creative-lab" ref={ref} aria-label="Interactive creative development showcase"><Reveal className="lab-heading"><div className="section-label"><span className="serial">04 /</span><span className="little-line"/> THE INTERACTIVE LAB</div><div className="lab-heading-row"><div><h2 className="section-heading">Digital craft, <span className="gradient-word">in motion.</span></h2><p className="section-description">Not just a portfolio. An interactive canvas for code, creativity and motion.</p></div><span className="lab-badge"><span className="live-dot"/> MADE TO MOVE</span></div></Reveal><Reveal delay={.08}><div className="lab-shell"><div className="lab-top"><div className="lab-window-dots"><i/><i/><i/></div><div className="lab-tabs" role="tablist" aria-label="Interactive preview mode">{tabs.map(t=><button type="button" role="tab" key={t} id={`lab-tab-${t}`} aria-controls="lab-stage" aria-selected={tab===t} className={tab===t?'active':''} onClick={()=>setTab(t)}>{t==='shader'?'01 / Shader gradient':t==='3d'?'02 / 3D scene':'03 / Motion'}</button>)}</div><div className="lab-top-tag">LIVE PREVIEW</div></div><div className="lab-stage" id="lab-stage" role="tabpanel" aria-labelledby={`lab-tab-${tab}`}>
 {tab==='shader'&&<><ShaderGradient className="lab-shader"/><motion.div className="lab-stage-copy" style={reduce?undefined:{y:scrollMove}}><span>DESIGNED TO FEEL ALIVE / 001</span><h3>A new dimension<br/><em>of interaction.</em></h3><div className="lab-preview-chip"><span className="live-dot"/> WEBGL / REAL-TIME</div></motion.div><div className="lab-floating lab-floating-one">realtime.render()</div><div className="lab-floating lab-floating-two">60 → 30 FPS adaptive</div></>}
 {tab==='3d'&&<><div className="lab-3d-scene">{scene&&!reduce?<Suspense fallback={<FloatingGeometry/>}><Spline scene={scene}/></Suspense>:<FloatingGeometry/>}</div><div className="lab-stage-overlay"><strong>Objects in orbit.</strong><span>Native CSS 3D · Spline-ready scene slot</span></div></>}
 {tab==='motion'&&<><div className="lab-motion-scene"><div className="motion-diagram"><div className="lottie-frame"><Suspense fallback={<Icon name="Sparkles" size={52}/>}><LottieAnimation paused={reduce}/></Suspense></div><motion.div className="motion-pill a" animate={reduce?undefined:{y:[0,-15,0]}} transition={{duration:3.9,repeat:Infinity}}>Spring physics</motion.div><motion.div className="motion-pill b" animate={reduce?undefined:{y:[0,12,0]}} transition={{duration:4.6,repeat:Infinity}}>Micro-interactions</motion.div><div className="rive-frame">{riveFile&&!reduce?<Suspense fallback={<RivePlaceholder/>}><RiveAnimation src={riveFile}/></Suspense>:<RivePlaceholder/>}</div></div></div><div className="lab-stage-overlay"><strong>Every detail responds.</strong><span>Motion · Lottie · Rive-ready slot</span></div></>}
 </div><div className="lab-bottom"><span><Icon name="MousePointer2" size={16}/> Try the different previews</span><span><Icon name="Sparkles" size={15}/> Built for mobile, tablet & desktop</span></div></div></Reveal><div className="lab-side-notes"><span>CREATIVE ENGINEERING</span><span>INTERACTION / VISUAL / EXPERIENCE</span></div></section>}
