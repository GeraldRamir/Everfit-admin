export const ADMIN_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/dashboard/mensajes", label: "Solicitudes", icon: "Mail" },
  { href: "/dashboard/notificaciones", label: "Notificaciones", icon: "Bell" },
  { href: "/dashboard/planes", label: "Planes", icon: "Dumbbell" },
  { href: "/dashboard/retos", label: "Retos", icon: "Flame" },
  { href: "/dashboard/recetas", label: "Recetas", icon: "Salad" },
  { href: "/dashboard/blog", label: "Blog", icon: "BookOpen" },
  { href: "/dashboard/testimonios", label: "Testimonios", icon: "MessageSquare" },
] as const;

export const CONTACT_STATUS_LABELS = {
  NEW: "Nueva",
  READ: "Leída",
  REPLIED: "Respondida",
  ARCHIVED: "Archivada",
} as const;

export const CONTACT_SUBJECT_LABELS = {
  "consulta-gratis": "Consulta Gratuita",
  "plan-entrenamiento": "Plan de Entrenamiento",
  "asesoria-nutricional": "Asesoría Nutricional",
  "coaching-online": "Coaching Online",
  reto: "Reto Fit",
  otro: "Otro",
} as const;

export const NOTIFICATION_TYPE_LABELS = {
  CONTACT: "Contacto",
  SYSTEM: "Sistema",
} as const;
