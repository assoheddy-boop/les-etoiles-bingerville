import { demoHintsEnabled } from "@/lib/runtime";

export function DemoHints({ children }: { children: React.ReactNode }) {
  if (!demoHintsEnabled()) return null;
  return <p className="mt-6 rounded-2xl bg-paper-2 p-4 text-xs text-muted">{children}</p>;
}
