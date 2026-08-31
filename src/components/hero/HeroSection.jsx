import React, { useEffect, useState, useRef } from 'react';
import { HeroVideoCanvas } from './HeroVideoCanvas';

export const HeroSection = ({ onOpenResume }) => {
  const [counts, setCounts] = useState({ score: 0, projects: 0, tools: 0 });
  const metricsRef = useRef(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          
          let scoreVal = 0;
          let projVal = 0;
          let toolVal = 0;

          const duration = 1200;
          const steps = 30;
          const interval = duration / steps;

          const timer = setInterval(() => {
            scoreVal = Math.min(88, scoreVal + 88 / steps);
            projVal = Math.min(15, projVal + 15 / steps);
            toolVal = Math.min(12, toolVal + 12 / steps);

            setCounts({
              score: Math.ceil(scoreVal),
              projects: Math.ceil(projVal),
              tools: Math.ceil(toolVal)
            });

            if (scoreVal >= 88 && projVal >= 15 && toolVal >= 12) {
              clearInterval(timer);
            }
          }, interval);
        }
      });
    }, { threshold: 0.2 });

    if (metricsRef.current) {
      observer.observe(metricsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="hero-pinned-section" id="hero">
      <div className="hero-sticky-viewport">
        <div className="container hero-frame-wrapper">
          
          {/* 16:9 Landscape Frame */}
          <div className="hero-16-9-frame glass-card">
            {/* Canvas Video Engine */}
            <HeroVideoCanvas />
          </div>

          {/* Bottom Metric Quick Cards */}
          <div className="hero-bottom-metrics-row" ref={metricsRef}>
            <div className="metric-pill glass-card">
              <span className="metric-num counter">{counts.score}</span>
              <span className="metric-sub">.69%</span>
              <span className="metric-text">CBSE 10th Score (2024)</span>
            </div>
            <div className="metric-pill glass-card">
              <span className="metric-num counter">{counts.projects}</span>
              <span className="metric-sub">+</span>
              <span className="metric-text">Hardware & IoT Projects</span>
            </div>
            <div className="metric-pill glass-card">
              <span className="metric-num counter">{counts.tools}</span>
              <span className="metric-sub">+</span>
              <span className="metric-text">Tools & Frameworks</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
