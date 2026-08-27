export function ModuleBlocked({
  title,
  lead,
}: {
  title: string;
  lead: string;
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="font-display text-2xl text-green-deep">{title}</h1>
      <p className="mt-3 text-muted">{lead}</p>
    </div>
  );
}
