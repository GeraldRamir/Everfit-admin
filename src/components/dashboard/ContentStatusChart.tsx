import { CONTACT_STATUS_LABELS } from "@/lib/constants";

const statusColors = {
  NEW: "bg-everfit-orange",
  READ: "bg-blue-400",
  REPLIED: "bg-emerald-400",
  ARCHIVED: "bg-gray-300",
};

export default function ContentStatusChart({
  data,
}: {
  data: { status: keyof typeof CONTACT_STATUS_LABELS; count: number }[];
}) {
  const total = data.reduce((sum, item) => sum + item.count, 0) || 1;
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="admin-card h-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-bold text-everfit-charcoal">
            Solicitudes por estado
          </h3>
          <p className="text-sm text-gray-500">Distribución de mensajes de contacto</p>
        </div>
        <span className="admin-pill-active">Total: {total}</span>
      </div>

      <div className="mb-6 flex h-44 items-end justify-between gap-3">
        {data.map((item) => (
          <div key={item.status} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-36 w-full items-end justify-center">
              <div
                className={`w-full max-w-[3rem] rounded-t-xl ${statusColors[item.status]} transition-all`}
                style={{ height: `${Math.max((item.count / max) * 100, item.count > 0 ? 12 : 4)}%` }}
                title={`${CONTACT_STATUS_LABELS[item.status]}: ${item.count}`}
              />
            </div>
            <span className="text-center text-[0.625rem] font-medium text-gray-500">
              {CONTACT_STATUS_LABELS[item.status]}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-4">
        {data.map((item) => (
          <div key={item.status} className="flex items-center gap-2 text-xs text-gray-600">
            <span className={`h-2.5 w-2.5 rounded-full ${statusColors[item.status]}`} />
            {CONTACT_STATUS_LABELS[item.status]} ({item.count})
          </div>
        ))}
      </div>
    </div>
  );
}
