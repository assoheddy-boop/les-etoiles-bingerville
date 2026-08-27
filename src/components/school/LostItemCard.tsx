import { lostItemPhotoSrc } from "@/lib/lost-item-photos";
import type { LostItem } from "@/lib/school-life-types";
import { formatDateFr } from "@/lib/utils";
import type { ReactNode } from "react";

function LostItemPhoto({ item, size = "md" }: { item: LostItem; size?: "sm" | "md" }) {
  const src = lostItemPhotoSrc(item);
  const box = size === "sm" ? "h-20 w-20 rounded-xl" : "h-28 w-28 rounded-2xl sm:h-32 sm:w-32";

  if (src) {
    return (
      <div className={`${box} shrink-0 overflow-hidden border border-line bg-paper`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`${box} flex shrink-0 items-center justify-center border border-dashed border-line bg-paper text-center text-xs font-medium text-muted`}
      aria-hidden
    >
      Pas de photo
    </div>
  );
}

export function LostItemCard({
  item,
  children,
  compact,
}: {
  item: LostItem;
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <article className="flex gap-4 rounded-3xl border border-line bg-white p-5 sm:gap-5 sm:p-6">
      <LostItemPhoto item={item} size={compact ? "sm" : "md"} />
      <div className="min-w-0 flex-1">
        <h2 className={`font-display text-green-deep ${compact ? "text-lg" : "text-xl sm:text-2xl"}`}>
          {item.description}
        </h2>
        <p className="mt-2 text-sm text-muted">
          {item.place} · {formatDateFr(item.foundAt)}
        </p>
        {children}
      </div>
    </article>
  );
}

export function LostItemListRow({ item, children }: { item: LostItem; children?: ReactNode }) {
  const src = lostItemPhotoSrc(item);

  return (
    <li className="flex gap-3 rounded-2xl bg-paper px-4 py-3">
      {src ? (
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-line bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-dashed border-line bg-white text-[10px] font-medium text-muted">
          —
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{item.description}</p>
        <p className="text-sm text-muted">
          {item.place} · {formatDateFr(item.foundAt)}
        </p>
        {children}
      </div>
    </li>
  );
}
