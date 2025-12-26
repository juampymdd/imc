export const lbToKg = (lb: number) => lb * 0.45359237;
export const inToCm = (inch: number) => inch * 2.54;
export const cmToM = (cm: number) => cm / 100;

const round = (value: number, decimals: number) => {
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
};

export const bmiFromKgAndM = (kg: number, m: number, decimals = 1) => {
  if (!isFinite(kg) || !isFinite(m) || m <= 0) return NaN;
  return round(kg / (m * m), decimals);
};

export const bmiScale0To100 = (bmi: number, minBmi = 15, maxBmi = 45) => {
  if (!isFinite(bmi)) return 0;
  const scaled = ((bmi - minBmi) / (maxBmi - minBmi)) * 100;
  const clamped = Math.max(0, Math.min(100, scaled));
  return round(clamped, 0);
};

type Category = {
  key: string;
  label: string;
  bmiMin: number | null;
  bmiMax: number | null;
  copy: { short: string; detail: string };
};

const CATEGORIES: Category[] = [
  { key: 'underweight', label: 'Bajo peso', bmiMin: null, bmiMax: 18.5, copy: { short: 'IMC por debajo de lo saludable.', detail: 'Podría convenir evaluar alimentación y hábitos con un profesional.' } },
  { key: 'healthy', label: 'Saludable', bmiMin: 18.5, bmiMax: 24.9, copy: { short: 'Rango saludable.', detail: 'Mantené hábitos sostenibles: alimentación, descanso y actividad.' } },
  { key: 'overweight', label: 'Sobrepeso', bmiMin: 25, bmiMax: 29.9, copy: { short: 'Por encima del rango saludable.', detail: 'Un pequeño ajuste de hábitos puede impactar mucho en salud.' } },
  { key: 'obesity_1', label: 'Obesidad (Grado I)', bmiMin: 30, bmiMax: 34.9, copy: { short: 'Riesgo aumentado.', detail: 'Recomendable apoyo profesional para un plan realista y sostenido.' } },
  { key: 'obesity_2', label: 'Obesidad (Grado II)', bmiMin: 35, bmiMax: 39.9, copy: { short: 'Riesgo alto.', detail: 'Es buena idea consultar con un equipo de salud para objetivos seguros.' } },
  { key: 'obesity_3', label: 'Obesidad (Grado III)', bmiMin: 40, bmiMax: null, copy: { short: 'Riesgo muy alto.', detail: 'Priorizá acompañamiento profesional para un abordaje integral y seguro.' } }
];

export const resolveCategory = (bmi: number) => {
  if (!isFinite(bmi)) return null;
  for (const c of CATEGORIES) {
    const minOk = c.bmiMin === null || bmi >= c.bmiMin;
    const maxOk = c.bmiMax === null || bmi <= c.bmiMax;
    if (minOk && maxOk) return c;
  }
  return null;
};

export const healthyRangeKg = (m: number, decimals = 1) => {
  const minKg = 20 * m * m;
  const maxKg = 24.9 * m * m;
  return { minKg: round(minKg, decimals), maxKg: round(maxKg, decimals) };
};

export const targetKgMidpoint = (m: number, decimals = 1) => {
  const { minKg, maxKg } = healthyRangeKg(m, decimals + 2);
  return round((minKg + maxKg) / 2, decimals);
};

export const deltaMessage = (bmi: number, weightKg: number, m: number) => {
  if (!isFinite(bmi) || !isFinite(weightKg) || !isFinite(m)) return '';
  const { minKg, maxKg } = healthyRangeKg(m, 1);
  if (bmi < 18.5) {
    const kgToMin = round(minKg - weightKg, 1);
    return `Necesitás aproximadamente +${kgToMin} kg para entrar a rango saludable (IMC 18.5).`;
  }
  if (bmi >= 18.5 && bmi <= 24.9) return 'Estás dentro del rango saludable.';
  const kgToMax = round(weightKg - maxKg, 1);
  return `Necesitás aproximadamente -${kgToMax} kg para volver a rango saludable (IMC 24.9).`;
};

export const normalizeInputs = (weightValue: number, weightUnit: 'kg' | 'lb', heightValue: number, heightUnit: 'cm' | 'in') => {
  const weightKg = weightUnit === 'kg' ? weightValue : lbToKg(weightValue);
  const heightCm = heightUnit === 'cm' ? heightValue : inToCm(heightValue);
  const heightM = cmToM(heightCm);
  return {
    weightKg: round(weightKg, 4),
    heightCm: round(heightCm, 2),
    heightM: round(heightM, 4)
  };
};

export default null as unknown as void;
