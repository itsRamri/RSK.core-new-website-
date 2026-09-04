import React, { useState } from 'react';

export const HeroPortraitCanvas = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`hero-cutout-wrapper ${isLoaded ? 'loaded' : ''}`}>
      <img
        src="/ezgif-476a1f2348609364-jpg/shubham-cutout.png"
        alt="Shubham Kumar - Portfolio Portrait"
        className="hero-cutout-canvas"
        onLoad={() => setIsLoaded(true)}
        loading="eager"
        decoding="async"
      />
    </div>
  );
};
export default HeroPortraitCanvas;
