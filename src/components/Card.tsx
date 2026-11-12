import type { ReactNode } from "react";
import { Sticker, type StickerName } from "./stickers/Sticker";

type CardProps = {
  title: string;
  icon?: string;
  sticker?: StickerName;
  children: ReactNode;
};

export function Card({ title, icon, sticker, children }: CardProps) {
  return (
    <section className="pop-in relative flex flex-col gap-3 rounded-3xl border border-line bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      {sticker && (
        <Sticker name={sticker} className="sticker-wiggle absolute -top-5 -right-3 h-14 w-14 rotate-12" />
      )}
      <h3 className="flex items-center gap-2 text-base font-bold">
        {icon && <img src={icon} alt="" className="icon h-5 w-5" />}
        {title}
      </h3>
      {children}
    </section>
  );
}
