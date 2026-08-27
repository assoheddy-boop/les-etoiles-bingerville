import { formInt, formText, withAdminMutate } from "@/lib/admin-api";
import { activeSocialCase, isSocialDiscountType } from "@/lib/accounting";
import { newId } from "@/lib/school-life";

export async function POST(request: Request) {
  return withAdminMutate(request, "/admin/cas-sociaux", (data, form) => {
    const action = formText(form, "action") || "create";
    if (action === "close") {
      const row = data.socialCases.find((item) => item.id === formText(form, "id"));
      if (!row) throw new Error("missing");
      row.status = "clos";
      row.closedAt = new Date().toISOString();
      return "/admin/cas-sociaux?ok=1";
    }
    const studentId = formText(form, "studentId");
    const motif = formText(form, "motif");
    const discountType = formText(form, "discountType");
    const discountValue = formInt(form, "discountValue");
    if (!studentId || !motif || !isSocialDiscountType(discountType)) throw new Error("data");
    if (!Number.isFinite(discountValue) || discountValue <= 0) throw new Error("amount");
    if (discountType === "percent" && discountValue > 100) throw new Error("amount");
    if (activeSocialCase(studentId, data)) throw new Error("exists");
    data.socialCases.unshift({
      id: newId("cas"),
      studentId,
      motif,
      discountType,
      discountValue,
      note: formText(form, "note") || undefined,
      status: "actif",
      createdAt: new Date().toISOString(),
    });
    return "/admin/cas-sociaux?ok=1";
  });
}
