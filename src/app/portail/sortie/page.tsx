import { redirect } from "next/navigation";

export default async function PortailSortieRedirect({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string; code?: string }>;
}) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  if (params.ok) qs.set("ok", params.ok);
  if (params.error) qs.set("error", params.error);
  if (params.code) qs.set("code", params.code);
  const suffix = qs.size ? `?${qs.toString()}` : "";
  redirect(`/espace-vigile${suffix}`);
}
