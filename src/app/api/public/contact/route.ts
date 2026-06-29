import { prisma, jsonResponse, corsOptions } from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";
import { CONTACT_SUBJECT_LABELS } from "@/lib/constants";

export async function OPTIONS() {
  return corsOptions();
}

function formatSubjectLabel(subject: string) {
  return CONTACT_SUBJECT_LABELS[subject as keyof typeof CONTACT_SUBJECT_LABELS] ?? subject;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message, sourcePlan, sourcePage } = body;

    if (!name || !email || !subject || !message) {
      return jsonResponse({ error: "Campos requeridos incompletos." }, { status: 400 });
    }

    const contact = await prisma.contactMessage.create({
      data: {
        name: String(name),
        email: String(email),
        phone: phone ? String(phone) : null,
        subject: String(subject),
        message: String(message),
        sourcePlan: sourcePlan ? String(sourcePlan) : null,
        sourcePage: sourcePage ? String(sourcePage) : null,
      },
    });

    const subjectLabel = formatSubjectLabel(String(subject));
    const planNote = sourcePlan ? ` · ${sourcePlan}` : "";

    await createNotification({
      type: "CONTACT",
      title: "Nueva solicitud de servicio",
      message: `${name} — ${subjectLabel}${planNote}`,
      link: `/dashboard/mensajes?id=${contact.id}`,
    });

    return jsonResponse({ success: true, id: contact.id });
  } catch {
    return jsonResponse({ error: "Error al procesar el mensaje." }, { status: 500 });
  }
}
