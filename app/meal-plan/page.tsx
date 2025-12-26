'use client';

import React, { useState, useEffect } from 'react';
import { recipesData, Recipe, MealType } from '@/lib/recipes';
import { Sunrise, Sun, Apple, Moon, RefreshCw, Calculator, Flame, Beef, Wheat, Droplet, ClipboardList, BookOpen, Lightbulb, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Función para obtener una receta aleatoria de un tipo específico
function getRandomRecipe(mealType: MealType, excludeId?: string): Recipe {
  const recipes = recipesData.recipes[mealType];
  let availableRecipes = recipes;
  
  // Si hay un ID a excluir, filtrarlo
  if (excludeId) {
    availableRecipes = recipes.filter(r => r.id !== excludeId);
  }
  
  const randomIndex = Math.floor(Math.random() * availableRecipes.length);
  return availableRecipes[randomIndex];
}

// Configuración de cada tipo de comida
const mealConfig = {
  breakfast: {
    title: 'Desayuno',
    icon: Sunrise,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950/20',
    borderColor: 'border-amber-200 dark:border-amber-900',
    textColor: 'text-amber-700 dark:text-amber-400'
  },
  lunch: {
    title: 'Almuerzo',
    icon: Sun,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
    borderColor: 'border-emerald-200 dark:border-emerald-900',
    textColor: 'text-emerald-700 dark:text-emerald-400'
  },
  snack: {
    title: 'Merienda',
    icon: Apple,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50 dark:bg-pink-950/20',
    borderColor: 'border-pink-200 dark:border-pink-900',
    textColor: 'text-pink-700 dark:text-pink-400'
  },
  dinner: {
    title: 'Cena',
    icon: Moon,
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
    borderColor: 'border-indigo-200 dark:border-indigo-900',
    textColor: 'text-indigo-700 dark:text-indigo-400'
  }
};

type DailyMeals = {
  breakfast: Recipe;
  lunch: Recipe;
  snack: Recipe;
  dinner: Recipe;
};

export default function MealPlanPage() {
  const [meals, setMeals] = useState<DailyMeals | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generar plan de comidas aleatorio al cargar
  useEffect(() => {
    generateAllMeals();
  }, []);

  // Generar todas las comidas
  const generateAllMeals = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setMeals({
        breakfast: getRandomRecipe('breakfast'),
        lunch: getRandomRecipe('lunch'),
        snack: getRandomRecipe('snack'),
        dinner: getRandomRecipe('dinner')
      });
      setIsGenerating(false);
    }, 300);
  };

  // Cambiar una comida específica
  const changeMeal = (mealType: MealType) => {
    if (!meals) return;
    
    const newRecipe = getRandomRecipe(mealType, meals[mealType].id);
    setMeals({
      ...meals,
      [mealType]: newRecipe
    });
  };

  // Calcular totales
  const getTotals = () => {
    if (!meals) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    
    return {
      calories: meals.breakfast.calories + meals.lunch.calories + meals.snack.calories + meals.dinner.calories,
      protein: meals.breakfast.macros.protein + meals.lunch.macros.protein + meals.snack.macros.protein + meals.dinner.macros.protein,
      carbs: meals.breakfast.macros.carbs + meals.lunch.macros.carbs + meals.snack.macros.carbs + meals.dinner.macros.carbs,
      fat: meals.breakfast.macros.fat + meals.lunch.macros.fat + meals.snack.macros.fat + meals.dinner.macros.fat
    };
  };

  const totals = getTotals();

  if (!meals) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Generando tu plan de comidas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 pb-12">
      {/* Back button */}
      <div>
        <Link href="/">
          <button className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Volver al IMC
          </button>
        </Link>
      </div>

      {/* Header */}
      <div className="text-center">
        <h1 className="flex items-center justify-center gap-3 text-3xl font-bold text-zinc-900 dark:text-zinc-100 md:text-4xl">
          <Calculator className="h-8 w-8 text-emerald-600" />
          Tu Plan de Comidas del Día
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Plan nutricional aleatorio con 4 comidas balanceadas
        </p>
      </div>

      {/* Botón generar todo */}
      <div className="flex justify-center">
        <button
          onClick={generateAllMeals}
          disabled={isGenerating}
          className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50"
        >
          <RefreshCw className={`h-5 w-5 ${isGenerating ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          {isGenerating ? 'Generando...' : 'Generar Nuevo Plan Completo'}
        </button>
      </div>

      {/* Resumen nutricional */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-6 shadow-lg dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-900/50">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-zinc-900 dark:text-zinc-100">
          <Calculator className="h-6 w-6 text-emerald-600" />
          Resumen Nutricional del Día
        </h2>
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 text-white">
            <div className="flex items-center gap-2 text-sm font-medium opacity-90">
              <Flame className="h-4 w-4" />
              Calorías
            </div>
            <div className="mt-1 text-3xl font-bold">{totals.calories}</div>
            <div className="text-xs opacity-75">kcal</div>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white">
            <div className="flex items-center gap-2 text-sm font-medium opacity-90">
              <Beef className="h-4 w-4" />
              Proteínas
            </div>
            <div className="mt-1 text-3xl font-bold">{totals.protein}</div>
            <div className="text-xs opacity-75">g</div>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 p-4 text-white">
            <div className="flex items-center gap-2 text-sm font-medium opacity-90">
              <Wheat className="h-4 w-4" />
              Carbohidratos
            </div>
            <div className="mt-1 text-3xl font-bold">{totals.carbs}</div>
            <div className="text-xs opacity-75">g</div>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 p-4 text-white">
            <div className="flex items-center gap-2 text-sm font-medium opacity-90">
              <Droplet className="h-4 w-4" />
              Grasas
            </div>
            <div className="mt-1 text-3xl font-bold">{totals.fat}</div>
            <div className="text-xs opacity-75">g</div>
          </div>
        </div>
      </div>

      {/* Grid de comidas */}
      <div className="grid gap-6 md:grid-cols-2">
        {(Object.keys(meals) as MealType[]).map((mealType) => {
          const meal = meals[mealType];
          const config = mealConfig[mealType];

          return (
            <div
              key={mealType}
              className={`overflow-hidden rounded-2xl border ${config.borderColor} ${config.bgColor} shadow-lg transition-all hover:shadow-xl`}
            >
              {/* Header de la comida */}
              <div className={`bg-gradient-to-r ${config.color} p-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <config.icon className="h-7 w-7 text-white" />
                    <h3 className="text-xl font-bold text-white">{config.title}</h3>
                  </div>
                  <button
                    onClick={() => changeMeal(mealType)}
                    className="rounded-lg bg-white/20 p-2 backdrop-blur-sm transition-all hover:bg-white/30 hover:scale-110 active:scale-95"
                    title="Cambiar esta comida"
                  >
                    <RefreshCw className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Contenido de la comida */}
              <div className="p-5">
                {/* Nombre de la receta */}
                <h4 className="mb-3 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {meal.name}
                </h4>

                {/* Calorías destacadas */}
                <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-sm dark:bg-zinc-800">
                  <Flame className="h-5 w-5 text-emerald-600" />
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">{meal.calories}</span>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">kcal</span>
                </div>

                {/* Macros */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">Proteínas</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{meal.macros.protein}g</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">Carbohidratos</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">{meal.macros.carbs}g</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">Grasas</span>
                    <span className="font-semibold text-rose-600 dark:text-rose-400">{meal.macros.fat}g</span>
                  </div>
                </div>

                {/* Ingredientes */}
                <div className="mb-4 rounded-lg bg-white p-3 dark:bg-zinc-800/50">
                  <h5 className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    <ClipboardList className="h-4 w-4 text-emerald-600" />
                    Ingredientes
                  </h5>
                  <ul className="space-y-1">
                    {meal.ingredients.map((ingredient, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500"></span>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Preparación */}
                <div className="mb-4 rounded-lg bg-white p-3 dark:bg-zinc-800/50">
                  <h5 className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    <BookOpen className="h-4 w-4 text-emerald-600" />
                    Preparación
                  </h5>
                  <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                    {meal.preparation}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {meal.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`rounded-full ${config.bgColor} ${config.textColor} px-3 py-1 text-xs font-medium`}
                    >
                      {tag.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info adicional */}
      <div className="rounded-xl border border-zinc-200 bg-white/50 p-4 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/50">
        <p className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <Lightbulb className="h-5 w-5 flex-shrink-0 text-amber-500" />
          <span><strong>Tip:</strong> Hacé clic en el ícono de recarga de cada comida para cambiarla individualmente, o generá un plan completamente nuevo con el botón de arriba.</span>
        </p>
      </div>
    </div>
  );
}
