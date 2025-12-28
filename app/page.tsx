import ImcCalculator from "@/components/imc/ImcCalculator";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 transition-colors dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Patrón decorativo de fondo */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.1),rgba(255,255,255,0))] dark:bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.05),rgba(0,0,0,0))]" />
      {/* Header con toggle de tema */}
      <header className="relative">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4 md:p-6">
          {/* Logo o espacio vacío para balance */}
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-500 p-2 shadow-lg">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <span className="hidden text-lg font-bold text-zinc-900 dark:text-zinc-100 sm:inline">
              IMC Calculator
            </span>
          </div>

          {/* Navigation and Theme Toggle */}
          <div className="flex items-center gap-3">
            <Link href="/meal-plan">
              <button className="group flex items-center gap-2 rounded-xl border border-emerald-600 bg-emerald-50 px-4 py-2.5 font-semibold text-emerald-700 transition-all hover:bg-emerald-600 hover:text-white dark:border-emerald-500 dark:bg-emerald-950 dark:text-emerald-400 dark:hover:bg-emerald-600 dark:hover:text-white">
                <UtensilsCrossed className="h-5 w-5" />
                <span className="hidden sm:inline">Plan de Comidas</span>
              </button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="relative px-4 pb-12 pt-8">
        <ImcCalculator />
      </main>

      {/* Footer removed as requested */}
    </div>
  );
}
