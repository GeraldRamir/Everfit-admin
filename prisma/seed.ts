import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.notification.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.service.deleteMany();

  await prisma.service.createMany({
    data: [
      {
        title: "Planes de Entrenamiento",
        description:
          "Rutinas personalizadas según tu objetivo: pérdida de grasa, ganancia muscular o recomposición corporal.",
        icon: "dumbbell",
        order: 1,
      },
      {
        title: "Asesoría Nutricional",
        description:
          "Planes alimenticios balanceados con recetas fit, macros calculados y seguimiento semanal.",
        icon: "nutrition",
        order: 2,
      },
      {
        title: "Coaching Online",
        description:
          "Acompañamiento 100% online con videollamadas, ajustes en tiempo real y soporte por WhatsApp.",
        icon: "video",
        order: 3,
      },
      {
        title: "Recetas Fit",
        description:
          "Biblioteca de recetas saludables, fáciles y deliciosas para complementar tu plan nutricional.",
        icon: "recipe",
        order: 4,
      },
    ],
  });

  await prisma.plan.createMany({
    data: [
      {
        title: "Everfit Ignite",
        slug: "everfit-ignite",
        description:
          "El lugar perfecto para empezar. Construye hábitos saludables, aprende entrenamiento correcto y crea una base sólida con guía personalizada.",
        longDesc:
          "Everfit Ignite está diseñado para quienes dan su primer paso o quieren reconstruir su relación con el fitness. Aprenderás técnica, estructura y hábitos que puedes mantener. Incluye entrenamiento personalizado, orientación nutricional y el apoyo de Michelle para que empieces con confianza y claridad.",
        price: 0,
        duration: "Programa continuo",
        level: "Fundación",
        features: JSON.stringify([
          "Entrenamiento personalizado adaptado a tu nivel",
          "Plan nutricional flexible y sostenible",
          "Aprende técnica y estructura de entrenamiento",
          "Construcción de hábitos saludables",
          "Soporte y accountability con Michelle",
          "Ideal para empezar o retomar",
        ]),
        image:
          "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
        featured: true,
      },
      {
        title: "Everfit Power",
        slug: "everfit-power",
        description:
          "Lleva tus resultados al siguiente nivel. Diseñado para quienes están listas para exigirse más, mantenerse responsables y progresar más rápido.",
        longDesc:
          "Everfit Power es para quienes ya tienen base y quieren resultados más visibles con mayor acompañamiento. Más estructura, más accountability y ajustes frecuentes para mantenerte en el camino. Michelle estará más cerca de ti en cada fase del proceso.",
        price: 0,
        duration: "Programa continuo",
        level: "Progreso",
        features: JSON.stringify([
          "Programa de entrenamiento avanzado personalizado",
          "Nutrición optimizada para tus metas",
          "Mayor frecuencia de check-ins y ajustes",
          "Accountability y seguimiento cercano",
          "Estrategias para superar mesetas",
          "Soporte prioritario de Michelle",
        ]),
        image:
          "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80",
        featured: true,
      },
      {
        title: "Everfit Elite",
        slug: "everfit-elite",
        description:
          "La experiencia de coaching definitiva. El programa más completo con coaching personalizado, guía cercana y todo lo que necesitas para tus mejores resultados.",
        longDesc:
          "Everfit Elite es la experiencia premium de Everfit by Mich. Coaching altamente personalizado, comunicación directa y un plan integral diseñado exclusivamente para ti. Si buscas el máximo nivel de apoyo y resultados, este es tu programa.",
        price: 0,
        duration: "Programa continuo",
        level: "Elite",
        features: JSON.stringify([
          "Coaching 1:1 altamente personalizado",
          "Plan de entrenamiento y nutrición premium",
          "Comunicación directa y seguimiento constante",
          "Ajustes en tiempo real según tu progreso",
          "Estrategia completa para tus metas específicas",
          "La experiencia Everfit más completa",
        ]),
        image:
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
        featured: true,
      },
    ],
  });

  await prisma.challenge.createMany({
    data: [
      {
        title: "21-Day Fat Loss Challenge",
        slug: "21-day-fat-loss-challenge",
        description:
          "Reto intensivo de 21 días enfocado en pérdida de grasa con entrenamiento estructurado y guía nutricional.",
        duration: "21 días",
        price: 19.99,
        order: 1,
        featured: true,
        image:
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
      },
      {
        title: "Booty Builder Challenge (30 días)",
        slug: "booty-builder-challenge",
        description:
          "Reto de 30 días diseñado para desarrollar y tonificar glúteos con rutinas progresivas y efectivas.",
        duration: "30 días",
        price: 24.99,
        order: 2,
        featured: true,
        image:
          "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800&q=80",
      },
      {
        title: "Everfit Glow Up Challenge (30 días)",
        slug: "everfit-glow-up-challenge",
        description:
          "Transformación completa de 30 días: entrenamiento, nutrición y mindset para tu mejor versión.",
        duration: "30 días",
        price: 29.99,
        order: 3,
        featured: true,
        image:
          "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
      },
      {
        title: "Home Workout Challenge (30 días)",
        slug: "home-workout-challenge",
        description:
          "30 días de entrenamiento efectivo desde casa. Sin excusas, sin equipamiento complicado.",
        duration: "30 días",
        price: 19.99,
        order: 4,
        featured: true,
        image:
          "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
      },
      {
        title: "Holiday Balance Challenge",
        slug: "holiday-balance-challenge",
        description:
          "Mantén el equilibrio durante las fiestas: disfruta sin perder tu progreso ni tu salud.",
        duration: "Programa especial",
        price: 19.99,
        order: 5,
        featured: true,
        image:
          "https://images.unsplash.com/photo-1486218119243-13883505764c?w=800&q=80",
      },
    ],
  });

  await prisma.recipe.createMany({
    data: [
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
        fiber: null,
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
        fiber: null,
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
        fiber: null,
        notes: null,
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
        fiber: 10,
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
        fiber: null,
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
        fiber: 9,
        notes: null,
        prepTime: "5 min + reposo",
        servings: 1,
        category: "Desayuno",
        image:
          "https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=800&q=80",
        featured: true,
      },
    ],
  });

  await prisma.testimonial.createMany({
    data: [
      {
        name: "María González",
        role: "Cliente Everfit Ignite",
        content:
          "Michelle cambió mi relación con el gym. Su apoyo constante y enfoque realista hicieron toda la diferencia.",
        rating: 5,
        image:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
      },
      {
        name: "Carolina Ruiz",
        role: "Cliente Everfit Power",
        content:
          "Las rutinas de Michelle son desafiantes pero adaptadas a mi nivel. Me siento más fuerte y segura que nunca.",
        rating: 5,
        image:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
      },
      {
        name: "Ana Lucía Pérez",
        role: "Cliente Everfit Elite",
        content:
          "Michelle me enseñó todo desde cero con paciencia. Ahora entreno con confianza y amo el proceso.",
        rating: 5,
        image:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
      },
    ],
  });

  await prisma.blogPost.createMany({
    data: [
      {
        title: "5 razones por las que deberías empezar a entrenar hoy",
        slug: "5-razones-empezar-entrenar",
        excerpt:
          "No esperes al lunes, al mes que viene o al año nuevo. Tu cuerpo y tu mente te lo agradecerán desde el primer día.",
        content: `Entrenar no es solo sobre verse bien, es sobre sentirte poderosa. Cada sesión es una inversión en la mejor versión de ti.

## Beneficios que notarás desde la primera semana

- Mejora tu salud cardiovascular y tu energía diaria
- Reduce el estrés y mejora tu calidad de sueño
- Aumenta tu confianza y disciplina fuera del gym

## La mentalidad Everfit

> El mejor momento para empezar fue ayer. El segundo mejor es ahora.

Crea hábitos pequeños pero constantes. No necesitas entrenar dos horas: 30 minutos bien ejecutados cambian tu día. Celebra cada victoria, por mínima que parezca.`,
        category: "Motivación",
        image:
          "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
      },
      {
        title: "Cómo superar el miedo al gym si eres principiante",
        slug: "superar-miedo-gym",
        excerpt:
          "El gym puede intimidar, pero con la mentalidad correcta y una guía adecuada, se convierte en tu lugar favorito.",
        content: `Es normal sentirse observada o no saber qué hacer. Todos — incluso quienes hoy parecen expertos — empezaron desde cero.

## Consejos para tu primer mes

- Lleva un plan claro de entrenamiento (no improvises en la sala)
- Elige horarios menos concurridos si te ayuda a concentrarte
- Enfócate en tu progreso, no en compararte con nadie más

## Tu kit mental

Usa audífonos, lleva tu botella de agua y celebra cada pequeña victoria. El gym deja de ser intimidante cuando entiendes que es tu espacio de crecimiento.

> La incomodidad inicial es señal de que estás saliendo de tu zona de confort — y eso es exactamente lo que buscamos.`,
        category: "Mindset",
        image:
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
      },
      {
        title: "Meal prep: la clave para mantener tu alimentación fit",
        slug: "meal-prep-clave-alimentacion",
        excerpt:
          "Preparar tus comidas con anticipación te ahorra tiempo, dinero y te mantiene en el camino hacia tus objetivos.",
        content: `Un buen meal prep es la diferencia entre cumplir tus macros o caer en comida rápida cuando el día se complica.

## Plan de 2 horas el domingo

- Cocina proteínas en lote (pollo, pescado, huevos)
- Prepara carbohidratos base (arroz, camote, avena)
- Lava y corta vegetales para la semana

## Tips para no aburrirte

Usa contenedores porcionados, congela lo que no comerás en 3 días y varía condimentos y salsas fit. La variedad mantiene la adherencia.

> Preparar hoy es regalarte disciplina mañana.`,
        category: "Nutrición",
        image:
          "https://images.unsplash.com/photo-1498837167922-ddd27525cd34?w=800&q=80",
      },
    ],
  });

  const adminEmail = process.env.ADMIN_EMAIL ?? "everfitbymich@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "everfit2026";

  await prisma.adminUser.create({
    data: {
      email: adminEmail,
      name: "Michelle Ruiz",
      passwordHash: bcrypt.hashSync(adminPassword, 10),
    },
  });

  console.log("Seed completado exitosamente");
  console.log(`Admin: ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
