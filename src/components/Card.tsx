import type {ReactNode} from "react";

type CardProps = {
    title: string;
    icon?: string;
    children: ReactNode;
};

export function Card({ title, icon, children }: CardProps) {
  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-line bg-card p-6 shadow-sm">
      <h3 className="flex items-center gap-2 text-lg font-bold">
        {icon && <img src={icon} alt="" className="icon h-6 w-6" />}
        {title}
      </h3>
      {children}
    </section>
  );
}