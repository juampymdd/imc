"use client";

import { useTheme } from "./ThemeProvider";




export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="group relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-zinc-300 bg-white shadow-sm transition-all hover:scale-105 hover:shadow-md active:scale-95 dark:border-zinc-700 dark:bg-zinc-800"
      aria-label="Cambiar tema"
      title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
    >
      {/* Sol (modo claro) */}
      <svg
        className={`absolute h-6 w-6 text-amber-500 transition-all duration-300 ${
          theme === 'light' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>

      {/* Luna (modo oscuro) */}
      <svg
        className={`absolute h-6 w-6 text-blue-400 transition-all duration-300 ${
          theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>

      {/* Efecto de brillo al hover */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/0 via-amber-400/10 to-amber-400/0 opacity-0 transition-opacity group-hover:opacity-100 dark:from-blue-400/0 dark:via-blue-400/10 dark:to-blue-400/0" />
    </button>
  );
}
