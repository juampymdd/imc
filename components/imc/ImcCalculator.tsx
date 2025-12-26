"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import ImcResult from './ImcResult';
import { normalizeInputs, bmiFromKgAndM, bmiScale0To100, resolveCategory, healthyRangeKg, targetKgMidpoint, deltaMessage } from '../../lib/imc';

const schema = z.object({
  weightValue: z.number().min(10, { message: 'Ingresá tu peso.' }).max(500),
  weightUnit: z.enum(['kg', 'lb']),
  heightValue: z.number().min(50, { message: 'Ingresá tu altura.' }).max(272),
  heightUnit: z.enum(['cm', 'in'])
});

type FormValues = z.infer<typeof schema>;

export default function ImcCalculator() {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { weightValue: undefined as any, weightUnit: 'kg', heightValue: undefined as any, heightUnit: 'cm' }
  });

  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('imc.form');
      if (stored) {
        const parsed = JSON.parse(stored);
        for (const k of ['weightValue','weightUnit','heightValue','heightUnit']) {
          if (parsed[k] !== undefined) setValue(k as any, parsed[k]);
        }
        if (parsed.weightValue && parsed.heightValue) handleSubmit(onSubmit)();
      }
    } catch {}
  }, []);

  useEffect(() => {
    const sub = watch((value) => {
      try { localStorage.setItem('imc.form', JSON.stringify(value)); } catch {}
    });
    return () => sub.unsubscribe();
  }, [watch]);

  const onSubmit = (data: FormValues) => {
    const { weightKg, heightM, heightCm } = normalizeInputs(data.weightValue, data.weightUnit, data.heightValue, data.heightUnit);
    const bmi = bmiFromKgAndM(weightKg, heightM, 1);
    const category = resolveCategory(bmi);
    const { minKg, maxKg } = healthyRangeKg(heightM, 1);
    const targetKg = targetKgMidpoint(heightM, 1);
    const bmiScaled = bmiScale0To100(bmi);
    const delta = deltaMessage(bmi, weightKg, heightM);
    setResult({ bmi, bmiScaled, categoryLabel: category?.label, categoryDetail: category?.copy.detail, healthyMinKg: minKg, healthyMaxKg: maxKg, targetKg, deltaMessage: delta });
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 md:text-4xl">
          Calculadora de IMC
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Calculá tu Índice de Masa Corporal y conocé tu estado de salud
        </p>
      </div>

      {/* Form Card */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 shadow-lg dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-900/50">
        <div className="border-b border-zinc-200 bg-white/50 p-6 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/50">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Ingresá tus datos
          </h2>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(onSubmit)(); }} className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Weight Section */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                Peso
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input 
                    type="number" 
                    step="0.1" 
                    {...register('weightValue', { valueAsNumber: true })} 
                    placeholder="Ej: 92.5" 
                    className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-lg text-zinc-900 placeholder:text-zinc-400 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-emerald-500" 
                  />
                </div>
                <select 
                  {...register('weightUnit')} 
                  className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  <option value="kg">kg</option>
                  <option value="lb">lb</option>
                </select>
              </div>
              {errors.weightValue && (
                <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {String(errors.weightValue.message)}
                </div>
              )}
            </div>

            {/* Height Section */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                Altura
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input 
                    type="number" 
                    step="0.1" 
                    {...register('heightValue', { valueAsNumber: true })} 
                    placeholder="Ej: 175" 
                    className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-lg text-zinc-900 placeholder:text-zinc-400 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-emerald-500" 
                  />
                </div>
                <select 
                  {...register('heightUnit')} 
                  className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  <option value="cm">cm</option>
                  <option value="in">in</option>
                </select>
              </div>
              {errors.heightValue && (
                <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {String(errors.heightValue.message)}
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button 
              type="submit" 
              className="group relative flex-1 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/40 active:scale-[0.98]"
            >
              <span className="relative flex items-center justify-center gap-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Calcular IMC
              </span>
            </button>
            <button 
              type="button" 
              onClick={() => { 
                reset({ weightValue: undefined as any, weightUnit: 'kg', heightValue: undefined as any, heightUnit: 'cm' }); 
                setResult(null); 
                localStorage.removeItem('imc.form'); 
              }} 
              className="flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-6 py-3.5 font-medium text-zinc-700 transition-all hover:bg-zinc-50 active:scale-[0.98] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Limpiar
            </button>
          </div>
        </form>
      </div>

      {/* Result */}
      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ImcResult 
            bmi={result.bmi} 
            bmiScaled={result.bmiScaled} 
            categoryLabel={result.categoryLabel} 
            categoryDetail={result.categoryDetail} 
            healthyMinKg={result.healthyMinKg} 
            healthyMaxKg={result.healthyMaxKg} 
            targetKg={result.targetKg} 
            deltaMessage={result.deltaMessage} 
          />
        </div>
      )}
    </div>
  );
}
