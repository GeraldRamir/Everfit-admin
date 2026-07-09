/**
 * Replaces all recipes with the new Everfit recipe set.
 * Does not wipe plans, challenges, contacts, or admin users.
 *
 * Usage: npx tsx prisma/update-recipes.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const recipes = [
  {
    title: "Tostadas Francesas Altas en Proteína",
    slug: "tostadas-francesas-altas-en-proteina",
    description:
      "Tostadas francesas altas en proteína, ideales para un desayuno saturante y rico en macros.",
    ingredients: JSON.stringify([
      "3 rebanadas de pan bajo en carbohidratos",
      "4 claras de huevo",
      "½ scoop (15 g) de proteína en polvo",
      "1 cucharadita de vainilla",
      "Endulzante sin calorías",
      "Canela",
    ]),
    instructions: JSON.stringify([
      "Bate las claras con la proteína en polvo, la vainilla, el endulzante y la canela.",
      "Remoja cada rebanada de pan en la mezcla.",
      "Cocina en sartén antiadherente a fuego medio hasta dorar por ambos lados.",
      "Sirve caliente. Si divides en 3 tostadas, cada una aporta aprox. 103 kcal.",
    ]),
    calories: 310,
    protein: 34,
    carbs: 25,
    fat: 6,
    fiber: null as number | null,
    notes:
      "Si se divide en 3 tostadas, cada una aporta aproximadamente: 103 kcal · 11.3 g proteína · 8.3 g carbohidratos · 2 g grasa.",
    prepTime: "15 min",
    servings: 3,
    category: "Desayuno",
    image:
      "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&q=80",
    featured: true,
  },
  {
    title: "Pancakes de Proteína",
    slug: "pancakes-de-proteina",
    description:
      "Pancakes esponjosos altos en proteína, perfectos para desayuno o post-entreno.",
    ingredients: JSON.stringify([
      "½ taza (40 g) de avena",
      "1 scoop (30 g) de proteína",
      "Un chorrito (60 ml) de leche de almendra",
      "1 plátano mediano",
      "2 huevos",
      "Vainilla",
      "Canela",
      "Sal",
      "Polvo para hornear",
    ]),
    instructions: JSON.stringify([
      "Licua o mezcla todos los ingredientes hasta obtener una masa homogénea.",
      "Calienta una sartén antiadherente a fuego medio.",
      "Vierte porciones de masa y cocina hasta que aparezcan burbujas; voltea y cocina el otro lado.",
      "Rinde aproximadamente 4 pancakes.",
    ]),
    calories: 493,
    protein: 39,
    carbs: 45,
    fat: 17,
    fiber: null as number | null,
    notes:
      "Si salen 4 pancakes, cada uno tendría aproximadamente: 123 kcal · 9.8 g proteína · 11.3 g carbohidratos · 4.2 g grasa.",
    prepTime: "20 min",
    servings: 4,
    category: "Desayuno",
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80",
    featured: true,
  },
  {
    title: "Avena Proteica con Chocolate y Mantequilla de Maní",
    slug: "avena-proteica-chocolate-mantequilla-mani",
    description:
      "Avena cremosa con proteína, chocolate y mantequilla de maní para un desayuno energético.",
    ingredients: JSON.stringify([
      "50 g de avena",
      "1 scoop de proteína",
      "1 cucharada (16 g) de mantequilla de maní",
      "1 taza de leche de almendra sin azúcar",
      "Canela",
      "Stevia",
    ]),
    instructions: JSON.stringify([
      "Calienta la leche de almendra en una olla a fuego medio.",
      "Agrega la avena y cocina hasta que espese.",
      "Retira del fuego, incorpora la proteína, la mantequilla de maní, la canela y la stevia.",
      "Mezcla bien y sirve.",
    ]),
    calories: 410,
    protein: 35,
    carbs: 37,
    fat: 13,
    fiber: null as number | null,
    notes: null as string | null,
    prepTime: "10 min",
    servings: 1,
    category: "Desayuno",
    image:
      "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&q=80",
    featured: true,
  },
  {
    title: "Parfait de Pudding de Chía",
    slug: "parfait-pudding-de-chia",
    description:
      "Pudding de chía ligero y fibroso. Los toppings (yogur, fruta y mantequilla de maní) no están incluidos en los macros.",
    ingredients: JSON.stringify([
      "2 cucharadas (28 g) de semillas de chía",
      "½ taza (120 ml) de leche de almendra sin azúcar",
      "1 cucharadita de jarabe de maple sin azúcar o stevia",
      "Canela al gusto",
      "Un toque de extracto de vainilla",
    ]),
    instructions: JSON.stringify([
      "Mezcla todos los ingredientes.",
      "Refrigera durante al menos 4 horas o toda la noche.",
      "Agrega los toppings de tu preferencia antes de servir.",
    ]),
    calories: 160,
    protein: 6,
    carbs: 14,
    fat: 10,
    fiber: 10 as number | null,
    notes:
      "Los toppings (yogur griego, manzana, fresas y mantequilla de maní) NO están incluidos en estos macros.",
    prepTime: "5 min + reposo",
    servings: 1,
    category: "Snack",
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80",
    featured: true,
  },
  {
    title: "Wrap Alto en Proteína",
    slug: "wrap-alto-en-proteina",
    description:
      "Wrap rápido y muy alto en proteína con atún, claras y requesón.",
    ingredients: JSON.stringify([
      "2 tortillas bajas en carbohidratos",
      "¼ taza de requesón (cottage cheese)",
      "1 lata o paquete de atún en agua (aprox. 70 g escurrido)",
      "3 claras de huevo",
    ]),
    instructions: JSON.stringify([
      "Mezcla el atún, las claras y el requesón.",
      "Cocina la mezcla hasta que las claras estén listas.",
      "Calienta las tortillas.",
      "Rellena y enrolla.",
    ]),
    calories: 345,
    protein: 46,
    carbs: 20,
    fat: 7,
    fiber: null as number | null,
    notes:
      "Si la receta rinde 2 wraps, cada uno aporta aproximadamente: 173 kcal · 23 g proteína · 10 g carbohidratos · 3.5 g grasa.",
    prepTime: "15 min",
    servings: 2,
    category: "Almuerzo",
    image:
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&q=80",
    featured: true,
  },
  {
    title: "Avena Nocturna con Matcha",
    slug: "avena-nocturna-con-matcha",
    description:
      "Overnight oats con matcha, chía y yogur griego. Preparación la noche anterior.",
    ingredients: JSON.stringify([
      "½ taza (40 g) de avena tradicional",
      "1 cucharada (14 g) de semillas de chía",
      "1 cucharadita de matcha",
      "¼ taza de yogur griego natural sin grasa",
      "⅔ taza de leche de almendra sin azúcar",
      "1 cucharada de jarabe de maple sin azúcar",
      "½ cucharada de extracto de vainilla",
    ]),
    instructions: JSON.stringify([
      "Mezcla todos los ingredientes.",
      "Refrigera durante toda la noche o por al menos 2 horas.",
      "Agrega fruta o tus toppings favoritos antes de consumir.",
    ]),
    calories: 305,
    protein: 21,
    carbs: 33,
    fat: 11,
    fiber: 9 as number | null,
    notes: null as string | null,
    prepTime: "5 min + reposo",
    servings: 1,
    category: "Desayuno",
    image:
      "https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=800&q=80",
    featured: true,
  },
];

async function main() {
  await prisma.recipe.deleteMany();
  await prisma.recipe.createMany({ data: recipes });
  console.log(`Reemplazadas ${recipes.length} recetas correctamente.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
