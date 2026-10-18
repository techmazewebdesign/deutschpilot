import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const dark = {
  navy: '#061526', panel: '#0B223A', panel2: '#102C49', gold: '#E0B873',
  cream: '#F6F0E6', white: '#FFFFFF', muted: '#A5B4C5', line: '#29455F',
  green: '#63DBA3', red: '#FF9298', blue: '#5DADE2', ink: '#061526',
  correct: '#123E35', wrong: '#431F2B',
};
const light: typeof dark = {
  navy: '#F7F5F0', panel: '#FFFFFF', panel2: '#EDE8DF', gold: '#916426',
  cream: '#172D43', white: '#172D43', muted: '#536579', line: '#D7DEE5',
  green: '#167549', red: '#B32636', blue: '#216D9B', ink: '#FFFFFF',
  correct: '#DCF3E7', wrong: '#FCE4E7',
};
export type Colors = typeof dark;
type Theme = { C: Colors; mode: 'light' | 'dark'; toggle: () => void };
const ThemeContext = createContext<Theme>({ C: light, mode: 'light', toggle: () => {} });
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [ready, setReady] = useState(false);
  useEffect(() => { AsyncStorage.getItem('deutschpilot:theme').then(value => {
    if (value === 'dark' || value === 'light') setMode(value);
  }).catch(() => {}).finally(() => setReady(true)); }, []);
  useEffect(() => { if (ready) AsyncStorage.setItem('deutschpilot:theme', mode).catch(() => {}); }, [mode, ready]);
  return <ThemeContext.Provider value={{ C: mode === 'dark' ? dark : light, mode, toggle: () => setMode(m => m === 'dark' ? 'light' : 'dark') }}>{children}</ThemeContext.Provider>;
}
export const useTheme = () => useContext(ThemeContext);
