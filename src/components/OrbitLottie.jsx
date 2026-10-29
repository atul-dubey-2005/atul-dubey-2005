import React from 'react';
import {Lottie} from 'lottie-react';
import orbit from '../data/orbit-lottie.json';
export default function OrbitLottie({paused=false}){return <Lottie src={orbit} autoplay={!paused} loop={!paused} aria-label="Animated orbit illustration"/>}
