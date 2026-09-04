import React, { useState } from 'react';

export const HeroPortraitCanvas = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`hero-cutout-wrapper ${isLoaded ? 'loaded' : ''}`}>
      <img
        src="/ezgif-476a1f2348609364-jpg/profile.jpeg"
        alt="Shubham Kumar - Electronics & Communication Engineer"
        className="hero-cutout-canvas hero-profile-img"
        onLoad={() => setIsLoaded(true)}
        loading="eager"
        decoding="async"
      />
    </div>
  );
};
export default HeroPortraitCanvas;
