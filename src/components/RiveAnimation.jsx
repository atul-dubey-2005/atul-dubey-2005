import React from 'react';
import {useRive} from '@rive-app/react-canvas';
export default function RiveAnimation({src}){
 const {RiveComponent}=useRive({src,autoplay:true});
 return <RiveComponent className="rive-asset" aria-label="Rive interactive animation"/>;
}
