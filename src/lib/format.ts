export const formatBRL = (value: number | null | undefined): string => {
  if (value == null) return "—";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export const formatDiscount = (pct: number | null | undefined): string => {
  if (pct == null || pct === 0) return "";
  return `-${Math.round(pct)}%`;
};
