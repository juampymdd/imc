import type { Recipe, MealType } from "./recipes";

export type DailyMeals = Record<MealType, Recipe>;

export async function downloadMealPlanPdf(meals: DailyMeals) {
  const pdfMakeModule = await import("pdfmake/build/pdfmake");
  const pdfFontsModule = await import("pdfmake/build/vfs_fonts");
  const pdfMake: any = pdfMakeModule.default || pdfMakeModule;
  const pdfFonts: any = pdfFontsModule.default || pdfFontsModule;

  // pdfmake's vfs export shape varies across builds; handle common variants
  try {
    if (typeof pdfMake.addVirtualFileSystem === "function") {
      // some builds export a helper to register vfs directly
      pdfMake.addVirtualFileSystem(pdfFonts);
    } else if (pdfFonts && pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
    } else if (pdfFonts && pdfFonts.vfs) {
      pdfMake.vfs = pdfFonts.vfs;
    } else {
      // fallback: assume the imported module is the vfs object itself
      pdfMake.vfs = pdfFonts;
    }
  } catch (err) {
    // If something goes wrong, surface a helpful error in console and rethrow
    // so the calling code can handle it if needed.
    console.error("Failed to configure pdfMake vfs:", err, {
      pdfMake,
      pdfFonts,
    });
    throw err;
  }

  const dateStr = new Date().toLocaleString();

  const content: any[] = [
    { text: "Tu plan de comidas para hoy es:", style: "header" },
    { text: `Generado: ${dateStr}`, style: "subheader" },
    { text: "\n" },
    {
      table: {
        headerRows: 1,
        widths: ["auto", "*", "auto", "auto", "auto", "auto", "auto", "*"],
        body: [
          [
            { text: "Comida", style: "tableHeader" },
            { text: "Receta", style: "tableHeader" },
            { text: "kcal", style: "tableHeader", alignment: "right" },
            { text: "Proteínas (g)", style: "tableHeader", alignment: "right" },
            { text: "Carbs (g)", style: "tableHeader", alignment: "right" },
            { text: "Grasas (g)", style: "tableHeader", alignment: "right" },
            { text: "Ingredientes", style: "tableHeader" },
            { text: "Preparación", style: "tableHeader" },
          ],
        ],
      },
      layout: {
        fillColor: (rowIndex: number) => {
          // Resaltar la cabecera y la última fila (totales)
          const lastRow = content[3].table.body.length - 1;
          return rowIndex === 0 || rowIndex === lastRow ? "#f3f4f6" : null;
        },
      },
    },
  ];

  const order: MealType[] = ["breakfast", "lunch", "snack", "dinner"];
  const mealLabels: Record<MealType, string> = {
    breakfast: "Desayuno",
    lunch: "Almuerzo",
    snack: "Merienda",
    dinner: "Cena",
  };

  // Añadir filas a la tabla y calcular totales
  const tableBody = content[3].table.body as any[];

  const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };

  order.forEach((mealType) => {
    const meal = meals[mealType];
    const mealLabel =
      mealLabels[mealType] ??
      mealType.charAt(0).toUpperCase() + mealType.slice(1);

    totals.calories += Number(meal.calories || 0);
    totals.protein += Number(meal.macros?.protein || 0);
    totals.carbs += Number(meal.macros?.carbs || 0);
    totals.fat += Number(meal.macros?.fat || 0);


    tableBody.push([
      { text: mealLabel, style: "mealTitle" },
      { text: meal.name, style: "mealName" },
      { text: String(meal.calories), alignment: "right" },
      { text: String(meal.macros.protein), alignment: "right" },
      { text: String(meal.macros.carbs), alignment: "right" },
      { text: String(meal.macros.fat), alignment: "right" },
      meal.ingredients && meal.ingredients.length
        ? { ul: meal.ingredients.map((i) => String(i)) }
        : { text: "" },
      { text: meal.preparation ?? "" },
    ]);
  });

  // Fila de totales por columna
  tableBody.push([
    { text: "Totales", style: "totals" },
    { text: "", style: "totals" },
    { text: String(totals.calories), style: "totals", alignment: "right" },
    { text: String(totals.protein), style: "totals", alignment: "right" },
    { text: String(totals.carbs), style: "totals", alignment: "right" },
    { text: String(totals.fat), style: "totals", alignment: "right" },
    { text: "", style: "totals" },
    { text: "", style: "totals" }
  ]);

  const docDefinition: any = {
    info: { title: "Plan de Comidas", author: "Calculadora de IMC" },
    pageSize: "A4",
    pageMargins: [40, 60, 40, 60],
    content,
    styles: {
      header: { fontSize: 20, bold: true, margin: [0, 0, 0, 8] },
      subheader: { fontSize: 10, color: "#666666", margin: [0, 0, 0, 8] },
      tableHeader: { fontSize: 11, bold: true, color: "#111827" },
      mealTitle: { fontSize: 12, bold: true, color: "#047857" },
      mealName: { fontSize: 13, bold: true, margin: [0, 2, 0, 4] },
      mealMeta: { fontSize: 10, color: "#444444" },
      subtle: { fontSize: 11, color: "#444444", italics: true },
      totals: { fontSize: 11, bold: true, color: "#0f172a" },
    },
  };

  pdfMake
    .createPdf(docDefinition)
    .download(`plan-de-comidas-${new Date().toISOString().slice(0, 10)}.pdf`);
}
