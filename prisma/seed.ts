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
        title: "Bowl Proteico de Pollo y Quinoa",
        slug: "bowl-proteico-pollo-quinoa",
        description:
          "Un bowl completo, colorido y lleno de proteína ideal para post-entreno.",
        ingredients: JSON.stringify([
          "150g pechuga de pollo",
          "80g quinoa cocida",
          "1/2 aguacate",
          "1 taza espinacas",
          "1/2 taza tomate cherry",
          "2 cdas hummus",
          "Limón, sal y pimienta",
        ]),
        instructions: JSON.stringify([
          "Cocina la quinoa según instrucciones del paquete.",
          "Sazona el pollo con sal, pimienta y pimentón. Cocina a la plancha 5-6 min por lado.",
          "Arma el bowl: base de espinacas, quinoa, pollo en rodajas.",
          "Agrega aguacate, tomates y hummus.",
          "Exprime limón y sirve.",
        ]),
        calories: 485,
        protein: 42,
        carbs: 38,
        fat: 18,
        prepTime: "25 min",
        servings: 1,
        category: "Almuerzo",
        image:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
        featured: true,
      },
      {
        title: "Overnight Oats de Proteína",
        slug: "overnight-oats-proteina",
        description:
          "Desayuno preparado la noche anterior, cremoso y con 30g de proteína.",
        ingredients: JSON.stringify([
          "1/2 taza avena",
          "1 scoop proteína vainilla",
          "3/4 taza leche de almendras",
          "1 cdta mantequilla de maní",
          "1/2 plátano en rodajas",
          "1 cdta semillas de chía",
          "Canela al gusto",
        ]),
        instructions: JSON.stringify([
          "Mezcla avena, proteína, leche y chía en un frasco.",
          "Refrigera toda la noche (mínimo 6 horas).",
          "Por la mañana, agrega plátano, mantequilla de maní y canela.",
          "Disfruta frío o a temperatura ambiente.",
        ]),
        calories: 380,
        protein: 30,
        carbs: 45,
        fat: 10,
        prepTime: "5 min + reposo",
        servings: 1,
        category: "Desayuno",
        image:
          "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80",
        featured: true,
      },
      {
        title: "Wrap Fit de Atún y Vegetales",
        slug: "wrap-fit-atun",
        description:
          "Opción rápida, práctica y alta en proteína para llevar al trabajo o gym.",
        ingredients: JSON.stringify([
          "1 tortilla integral grande",
          "1 lata atún en agua",
          "2 cdas yogur griego",
          "Lechuga, tomate, pepino",
          "1/4 aguacate",
          "Mostaza y limón",
        ]),
        instructions: JSON.stringify([
          "Mezcla atún escurrido con yogur, mostaza y limón.",
          "Calienta ligeramente la tortilla.",
          "Coloca lechuga, mezcla de atún y vegetales.",
          "Agrega aguacate, enrolla firmemente y corta por la mitad.",
        ]),
        calories: 320,
        protein: 35,
        carbs: 28,
        fat: 12,
        prepTime: "10 min",
        servings: 1,
        category: "Snack",
        image:
          "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&q=80",
        featured: true,
      },
      {
        title: "Smoothie Verde Energético",
        slug: "smoothie-verde-energetico",
        description:
          "Bebida refrescante pre-entreno con carbohidratos y micronutrientes.",
        ingredients: JSON.stringify([
          "1 plátano congelado",
          "1 taza espinacas",
          "1/2 taza piña",
          "1 taza leche de coco light",
          "1 cdta miel",
          "Hielo al gusto",
        ]),
        instructions: JSON.stringify([
          "Agrega todos los ingredientes a la licuadora.",
          "Licua hasta obtener consistencia cremosa.",
          "Sirve inmediatamente.",
        ]),
        calories: 210,
        protein: 4,
        carbs: 48,
        fat: 3,
        prepTime: "5 min",
        servings: 1,
        category: "Bebida",
        image:
          "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=800&q=80",
        featured: false,
      },
      {
        title: "Brownies Fit de Cacao",
        slug: "brownies-fit-cacao",
        description:
          "Postre saludable sin culpa, perfecto para antojos dulces.",
        ingredients: JSON.stringify([
          "2 plátanos maduros",
          "1/4 taza cacao en polvo",
          "1/2 taza avena molida",
          "2 huevos",
          "1 scoop proteína chocolate",
          "1 cdta polvo de hornear",
          "Chips de chocolate oscuro",
        ]),
        instructions: JSON.stringify([
          "Precalienta horno a 180°C.",
          "Licua plátanos, huevos y proteína.",
          "Mezcla con cacao, avena y polvo de hornear.",
          "Vierte en molde engrasado, agrega chips.",
          "Hornea 20-25 minutos. Deja enfriar antes de cortar.",
        ]),
        calories: 145,
        protein: 8,
        carbs: 18,
        fat: 5,
        prepTime: "30 min",
        servings: 8,
        category: "Postre",
        image:
          "https://images.unsplash.com/photo-1606313564200-e75d5e30476e?w=800&q=80",
        featured: false,
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
        content:
          "Entrenar no es solo sobre verse bien, es sobre sentirte poderosa. Mejora tu salud cardiovascular, reduce el estrés, aumenta tu confianza y crea disciplina que trasciende al gym. Cada sesión es una inversión en la mejor versión de ti. En Everfit creemos que el mejor momento para empezar fue ayer, el segundo mejor es ahora.",
        category: "Motivación",
        image:
          "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
      },
      {
        title: "Cómo superar el miedo al gym si eres principiante",
        slug: "superar-miedo-gym",
        excerpt:
          "El gym puede intimidar, pero con la mentalidad correcta y una guía adecuada, se convierte en tu lugar favorito.",
        content:
          "Es normal sentirse observada o no saber qué hacer. Empieza con un plan claro, horarios menos concurridos y recuerda: todos empezaron desde cero. Enfócate en tu progreso, no en compararte. Usa audífonos, lleva tu botella de agua y celebra cada pequeña victoria.",
        category: "Mindset",
        image:
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
      },
      {
        title: "Meal prep: la clave para mantener tu alimentación fit",
        slug: "meal-prep-clave-alimentacion",
        excerpt:
          "Preparar tus comidas con anticipación te ahorra tiempo, dinero y te mantiene en el camino hacia tus objetivos.",
        content:
          "Dedica 2 horas el domingo a preparar proteínas, carbohidratos y vegetales. Usa contenedores porcionados, congela lo que no comerás en 3 días y varía tus condimentos para no aburrirte. Un buen meal prep es la diferencia entre cumplir tus macros o caer en comida rápida.",
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
