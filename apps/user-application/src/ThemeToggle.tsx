import { useState } from 'react';

type Theme = 'light' | 'dark';
const storageKey = 'klascraft-theme';

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f3f1df' : '#18271e');
}

export function initializeTheme() {
  let theme: Theme = 'dark';
  try {
    if (localStorage.getItem(storageKey) === 'light') theme = 'light';
  } catch { /* Theme switching still works when browser storage is unavailable. */ }
  applyTheme(theme);
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  const label = theme === 'dark' ? 'Włącz jasny motyw' : 'Włącz ciemny motyw';
  return <button className="theme-toggle" type="button" aria-label={label} title={label} onClick={() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
    try { localStorage.setItem(storageKey, next); } catch { /* Keep the selection for this page. */ }
  }}>
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor">
      {theme === 'dark' ? <path d="M8 8h8v8H8zM10 1h4v4h-4zM10 19h4v4h-4zM1 10h4v4H1zM19 10h4v4h-4zM3 3h3v3H3zM18 3h3v3h-3zM3 18h3v3H3zM18 18h3v3h-3z"/> : <path d="M9 2h6v3h-3v3H9v8h3v3h7v-3h3v5h-3v2H8v-3H5v-3H2V8h3V5h4z"/>}
    </svg>
  </button>;
}
