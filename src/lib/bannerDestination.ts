export type DestinationType = "offers" | "builds" | "offer" | "build" | "link";

export interface BannerDestination {
  destination_type: DestinationType | string;
  destination_category?: string | null;
  destination_listing_category?: string | null;
  destination_min_discount?: number | null;
  destination_id?: string | null;
  link?: string | null;
}

export const OFFER_LISTING_CATEGORIES = ["Ofertas Tech", "Seleção de Portáteis"];

export const OFFER_CATEGORIES = [
  "Hardware", "Smartphones", "Periféricos", "Mobiliário", "Acessórios",
  "Gadgets", "Notebooks", "Áudio", "Monitores", "Redes",
  "Armazenamento", "Games", "Iluminação", "Escritório", "Ergonomia",
  "Componentes", "Conectividade", "Tablets", "Wearables", "Suportes",
];

export const BUILD_CATEGORIES = ["Básico", "Intermediário", "Avançado", "Extremo"];

export const DISCOUNT_FILTER_OPTIONS = [
  { label: "Qualquer desconto", value: 0 },
  { label: "Mais de 10%", value: 10 },
  { label: "Mais de 30%", value: 30 },
  { label: "Mais de 50%", value: 50 },
];

export const buildBannerHref = (b: BannerDestination): string => {
  const type = b.destination_type || "link";

  if (type === "offers" || type === "builds") {
    const base = type === "offers" ? "/ofertas" : "/builds";
    const params = new URLSearchParams();
    if (b.destination_category) params.set("categoria", b.destination_category);
    if (type === "offers" && b.destination_listing_category) {
      params.set("listagem", b.destination_listing_category);
    }
    if (b.destination_min_discount && b.destination_min_discount > 0) {
      params.set("desconto", String(b.destination_min_discount));
    }
    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
  }

  if (type === "offer" && b.destination_id) return `/ofertas/${b.destination_id}`;
  if (type === "build" && b.destination_id) return `/builds/${b.destination_id}`;

  return b.link || "";
};
