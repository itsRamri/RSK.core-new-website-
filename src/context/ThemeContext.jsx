import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEMES = ['cyan', 'purple', 'green', 'orange', 'dark-minimal'];

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('rsk-theme-mode') || 'light';
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('rsk-portfolio-theme') || 'cyan';
  });

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    document.body.setAttribute('data-mode', mode);
    localStorage.setItem('rsk-portfolio-theme', theme);
    localStorage.setItem('rsk-theme-mode', mode);
  }, [theme, mode]);

  const toggleMode = () => {
    setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const changeTheme = (newTheme) => {
    if (THEMES.includes(newTheme)) {
      setTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleMode, theme, changeTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
