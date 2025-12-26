import ImcCalculator from '@/components/imc/ImcCalculator';
import ThemeToggle from '@/components/ThemeToggle';


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
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="hidden text-lg font-bold text-zinc-900 dark:text-zinc-100 sm:inline">
              IMC Calculator
            </span>
          </div>

          {/* Toggle de tema */}
          <ThemeToggle />
        </div>
      </header>

      {/* Contenido principal */}
      <main className="relative px-4 pb-12 pt-8">
        <ImcCalculator />
      </main>

      {/* Footer */}
      <footer className="relative border-t border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-zinc-600 dark:text-zinc-400 sm:flex-row">
            <p>
              © 2025 Calculadora de IMC. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                Sobre nosotros
              </a>
              <span className="text-zinc-300 dark:text-zinc-700">•</span>
              <a
                href="#"
                className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                Privacidad
              </a>
              <span className="text-zinc-300 dark:text-zinc-700">•</span>
              <a
                href="#"
                className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                Contacto
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
