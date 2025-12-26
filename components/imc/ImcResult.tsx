import React from 'react';

type Props = {
  bmi: number;
  bmiScaled: number;
  categoryLabel?: string | null;
  categoryDetail?: string | null;
  healthyMinKg: number;
  healthyMaxKg: number;
  targetKg: number;
  deltaMessage: string;
};

// Función para determinar el color según el IMC
function getBmiColor(bmi: number) {
  if (bmi < 18.5) return { bg: 'bg-blue-500', text: 'text-blue-600', ring: 'ring-blue-500/20' };
  if (bmi < 25) return { bg: 'bg-emerald-500', text: 'text-emerald-600', ring: 'ring-emerald-500/20' };
  if (bmi < 30) return { bg: 'bg-amber-500', text: 'text-amber-600', ring: 'ring-amber-500/20' };
  return { bg: 'bg-red-500', text: 'text-red-600', ring: 'ring-red-500/20' };
}

// Función para obtener el icono según categoría
function getCategoryIcon(bmi: number) {
  if (bmi < 18.5) {
    return (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
      </svg>
    );
  }
  if (bmi < 25) {
    return (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  if (bmi < 30) {
    return (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    );
  }
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

export default function ImcResult({ bmi, bmiScaled, categoryLabel, categoryDetail, healthyMinKg, healthyMaxKg, targetKg, deltaMessage }: Props) {
  const colors = getBmiColor(bmi);
  const categoryIcon = getCategoryIcon(bmi);

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 shadow-xl dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-900/50">
      {/* Header con resultado destacado */}
      <div className="border-b border-zinc-200 bg-gradient-to-r from-emerald-600 to-emerald-500 p-6 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-50">Tu Índice de Masa Corporal</p>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-5xl font-bold text-white md:text-6xl">
                {isFinite(bmi) ? bmi.toFixed(1) : '—'}
              </span>
              <span className="text-xl font-medium text-emerald-100">IMC</span>
            </div>
          </div>
          <div className="hidden rounded-2xl bg-white/20 p-4 backdrop-blur-sm md:block">
            <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Categoría */}
        <div className={`mb-6 rounded-xl border-2 ${colors.text.replace('text', 'border')} bg-white p-4 dark:bg-zinc-800/50`}>
          <div className="flex items-start gap-3">
            <div className={`rounded-lg ${colors.bg} p-2 text-white`}>
              {categoryIcon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {categoryLabel ?? '—'}
                </h3>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {categoryDetail ?? ''}
              </p>
            </div>
          </div>
        </div>

        {/* Escala visual de IMC */}
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Escala de IMC
            </h4>
            <span className="text-xs font-medium text-zinc-500">
              {bmiScaled.toFixed(0)}% de la escala
            </span>
          </div>
          
          {/* Barra de progreso con colores graduales */}
          <div className="relative">
            <div className="h-4 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div 
                className={`h-4 ${colors.bg} transition-all duration-700 ease-out`}
                style={{ width: `${Math.min(bmiScaled, 100)}%` }} 
              />
            </div>
            
            {/* Indicador de posición */}
            <div 
              className="absolute top-0 -mt-1 h-6 w-1 rounded-full bg-zinc-900 shadow-lg transition-all duration-700 dark:bg-zinc-100"
              style={{ left: `${Math.min(bmiScaled, 100)}%`, transform: 'translateX(-50%)' }}
            />
          </div>

          {/* Leyenda de rangos */}
          <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-zinc-600 dark:text-zinc-400">Bajo peso</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-zinc-600 dark:text-zinc-400">Normal</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="text-zinc-600 dark:text-zinc-400">Sobrepeso</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span className="text-zinc-600 dark:text-zinc-400">Obesidad</span>
            </div>
          </div>
        </div>

        {/* Información de peso saludable */}
        <div className="space-y-4">
          <div className="rounded-xl bg-zinc-100 p-4 dark:bg-zinc-800/50">
            <div className="mb-3 flex items-center gap-2">
              <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
                Rango de peso saludable
              </h4>
            </div>
            
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-white p-3 dark:bg-zinc-900">
                <p className="text-xs text-zinc-600 dark:text-zinc-400">Rango completo</p>
                <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {healthyMinKg.toFixed(1)} - {healthyMaxKg.toFixed(1)} kg
                </p>
              </div>
              <div className="rounded-lg bg-white p-3 dark:bg-zinc-900">
                <p className="text-xs text-zinc-600 dark:text-zinc-400">Peso objetivo (centro)</p>
                <p className="mt-1 text-lg font-bold text-emerald-600">
                  {targetKg.toFixed(1)} kg
                </p>
              </div>
            </div>
          </div>

          {/* Mensaje de diferencia */}
          {deltaMessage && (
            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                  <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Análisis
                  </h4>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {deltaMessage}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="mt-6 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/30">
          <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-500">
            <strong>Nota:</strong> El IMC es una herramienta de referencia general y no considera factores como masa muscular, densidad ósea o distribución de grasa. Para una evaluación completa de tu salud, consultá con un profesional médico.
          </p>
        </div>
      </div>
    </div>
  );
}
