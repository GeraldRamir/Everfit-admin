import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--admin-bg)] p-6 text-center">
      <p className="text-sm font-medium uppercase tracking-wider text-[var(--admin-muted)]">
        404
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold text-everfit-charcoal">
        Página no encontrada
      </h1>
      <p className="mt-3 max-w-md text-sm text-[var(--admin-muted)]">
        La ruta que buscas no existe en el panel de administración.
      </p>
      <Link href="/login" className="btn-admin-primary mt-8 px-6 py-3">
        Ir al inicio de sesión
      </Link>
    </div>
  );
}
