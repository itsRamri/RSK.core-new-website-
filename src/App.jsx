import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { useScrollReveal } from './hooks/useScrollReveal';
import { CircuitBackground } from './components/layout/CircuitBackground';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/hero/HeroSection';
import { AboutSection } from './components/about/AboutSection';
import { SkillsSection } from './components/skills/SkillsSection';
import { ProjectsSection } from './components/projects/ProjectsSection';
import { ProjectModal } from './components/projects/ProjectModal';
import { LabSection } from './components/lab/LabSection';
import { TimelineSection } from './components/timeline/TimelineSection';
import { CertificationsSection } from './components/certifications/CertificationsSection';
import { AchievementsSection } from './components/achievements/AchievementsSection';
import { ContactSection } from './components/contact/ContactSection';
import { ToastContainer } from './components/contact/ToastContainer';
import { ResumeModal } from './components/resume/ResumeModal';

export const AppContent = () => {
  const [selectedProject, setSelectedProject] = useState(null);
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
      {/* Interactive Circuit Particle Canvas */}
      <CircuitBackground />

      {/* Ambient Glow Elements */}
      <div className="ambient-glow glow-1"></div>
      <div className="ambient-glow glow-2"></div>
      <div className="ambient-glow glow-3"></div>

      {/* Primary Header / Navigation */}
      <Navbar />

      {/* Main Content Flow */}
      <main>
        <HeroSection onOpenResume={() => setIsResumeOpen(true)} />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection onSelectProject={(project) => setSelectedProject(project)} />
        <LabSection />
        <TimelineSection />
        <CertificationsSection />
        <AchievementsSection />
        <ContactSection onShowToast={showToast} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Portals */}
      <ProjectModal
        project={selectedProject}
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
      />

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
