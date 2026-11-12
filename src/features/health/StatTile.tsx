import { Sticker, type StickerName } from "../../components/stickers/Sticker";

type StatTileProps = {
  label: string;
  value: string;
  detail?: string;
  sticker?: StickerName;
};

export function StatTile({ label, value, detail, sticker }: StatTileProps) {
  return (
    <div className="pop-in relative flex flex-col gap-0.5 rounded-3xl border border-line bg-card p-4 shadow-sm">
      {sticker && <Sticker name={sticker} className="sticker-wiggle absolute -top-5 -right-3 h-12 w-12 rotate-12" />}
      <p className="text-sm font-semibold text-ink-soft">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      {detail && <p className="text-sm text-ink-soft">{detail}</p>}
    </div>
  );
}
