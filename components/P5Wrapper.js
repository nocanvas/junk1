"use client"
// components/P5Wrapper.js
import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import p5 from 'p5';


const P5Sketch = dynamic(() => import('p5'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const SketchComponent = () => {
  const sketchRef = useRef();

  useEffect(() => {
	new P5Sketch((p) => {
	  // Define your sketch here
	  p.setup = () => {/* ... */};
	  p.draw = () => {/* ... */};
	}, sketchRef.current);
  }, []);

  return <div ref={sketchRef}></div>;
};

export default SketchComponent;