import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState('light');
  const [currency, setCurrency] = useState('USD');

  const toggleTheme = () => {
    setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <AppContext.Provider value={{ themeMode, toggleTheme, currency, setCurrency }}>
      {children}
    </AppContext.Provider>
  );
};
