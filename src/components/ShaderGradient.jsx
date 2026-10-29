import React, {useEffect, useRef} from 'react';
import {useReducedMotion} from 'motion/react';

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
