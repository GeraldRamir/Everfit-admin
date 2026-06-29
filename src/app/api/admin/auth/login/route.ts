import { NextResponse } from "next/server";
import { createSession, verifyCredentials } from "@/lib/auth";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email y contraseña requeridos." }, { status: 400 });
  }

  const user = await verifyCredentials(String(email), String(password));
  if (!user) {
    return NextResponse.json({ error: "Credenciales inválidas." }, { status: 401 });
  }

  await createSession(user.id, user.email);
  return NextResponse.json({ success: true, name: user.name });
}
