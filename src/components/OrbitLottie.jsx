import React from 'react';
import {Lottie} from 'lottie-react';
import {useReducedMotion} from 'motion/react';
import orbit from '../data/orbit-lottie.json';

export default function OrbitLottie() {
  const reduce = useReducedMotion();
  return <div className="hero-lottie-orbit" aria-hidden="true"><Lottie src={orbit} autoplay={!reduce} loop={!reduce}/></div>;
}
