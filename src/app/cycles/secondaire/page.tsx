import { redirect } from "next/navigation";

/** Le groupe n’accueille que garderie, maternelle et primaire — redirection vers l’aperçu des cycles. */
export default function SecondairePage() {
  redirect("/cycles");
}
