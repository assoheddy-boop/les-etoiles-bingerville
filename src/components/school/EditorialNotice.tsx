type Props = {
  children: React.ReactNode;
  className?: string;
};

/** Bandeau honnête pour contenus à valider par la direction (tarifs, agréments, etc.). */
export function EditorialNotice({ children, className = "" }: Props) {
  return (
    <div
      className={`rounded-3xl border border-terracotta/30 bg-terracotta-soft px-5 py-4 text-sm font-medium text-ink ${className}`}
    >
      {children}
    </div>
  );
}
