import Link from "next/link";
import AdminPageHeader from "@/components/layout/AdminPageHeader";

export default function ResourceTable({
  title,
  description,
  rows,
  columns,
}: {
  title: string;
  description: string;
  rows: Record<string, string | number | boolean>[];
  columns: { key: string; label: string }[];
}) {
  return (
    <div>
      <AdminPageHeader title={title} description={description} />

      <div className="admin-table-wrap">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="py-10 text-center text-gray-500">
                    No hay registros.
                  </td>
                </tr>
              )}
              {rows.map((row, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key}>{String(row[col.key] ?? "—")}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-6 text-sm text-gray-500">
        La edición avanzada estará disponible en la siguiente fase. Revisa la{" "}
        <Link
          href={process.env.COMMERCIAL_SITE_URL ?? "http://localhost:3000"}
          className="font-semibold text-everfit-orange"
        >
          página comercial
        </Link>
        .
      </p>
    </div>
  );
}
