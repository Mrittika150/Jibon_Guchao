type StatTileProps = {
  label: string;
  value: string;
  detail?: string;
};

export function StatTile({ label, value, detail }: StatTileProps) {
  return (
    <div className="flex flex-col gap-0.5 rounded-3xl border border-line bg-card p-4 shadow-sm">
      <p className="text-sm font-semibold text-ink-soft">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      {detail && <p className="text-sm text-ink-soft">{detail}</p>}
    </div>
  );
}