import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { useScrollReveal } from './hooks/useScrollReveal';
import { CircuitBackground } from './components/layout/CircuitBackground';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/hero/HeroSection';
import { AboutSection } from './components/about/AboutSection';
import { TimelineSection } from './components/timeline/TimelineSection';
import { AchievementsSection } from './components/achievements/AchievementsSection';
import { ContactSection } from './components/contact/ContactSection';
import { ToastContainer } from './components/contact/ToastContainer';
import { ResumeModal } from './components/resume/ResumeModal';

export const AppContent = () => {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Initialize IntersectionObserver scroll reveal
  useScrollReveal();

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  return (
    <>
      {/* Interactive Ambient Background */}
      <CircuitBackground />

      {/* Primary Header / Navigation */}
      <Navbar />

      {/* Main Content Flow */}
      <main>
        <HeroSection onOpenResume={() => setIsResumeOpen(true)} />
        <AboutSection />
        <TimelineSection />
        <AchievementsSection />
        <ContactSection onShowToast={showToast} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Resume Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

      {/* Toast Notification Stack */}
      <ToastContainer toasts={toasts} />
    </>
  );
};

export const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
