import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type TaxonomyKind =
  | "offer_category"
  | "offer_badge"
  | "build_category"
  | "build_badge";

/**
 * Hook que mescla opções padrão com opções persistidas em `taxonomy_options`.
 * Ao adicionar um novo valor via `addOption`, ele é gravado no banco e
 * passa a aparecer em todas as próximas sessões/usuários.
 */
export function useTaxonomyOptions(kind: TaxonomyKind, defaults: string[]) {
  const [options, setOptions] = useState<string[]>(defaults);

  const load = useCallback(async () => {
    const { data, error } = await (supabase as any)
      .from("taxonomy_options")
      .select("value")
      .eq("kind", kind);
    if (error || !data) return;
    const remote = data.map((r: { value: string }) => r.value);
    setOptions((prev) => {
      const merged = [...defaults];
      for (const v of remote) if (!merged.includes(v)) merged.push(v);
      // preserva também valores adicionados localmente que ainda não voltaram do server
      for (const v of prev) if (!merged.includes(v)) merged.push(v);
      return merged;
    });
  }, [kind, defaults]);

  useEffect(() => {
    load();
  }, [load]);

  const setLocal = useCallback((next: string[]) => {
    setOptions(next);
  }, []);

  const addOption = useCallback(
    async (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return;
      setOptions((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
      const { error } = await (supabase as any)
        .from("taxonomy_options")
        .insert({ kind, value: trimmed });
      // 23505 = unique violation (já existia) — ignoramos silenciosamente
      if (error && (error as any).code !== "23505") {
        console.warn("Falha ao salvar opção:", error.message);
      }
    },
    [kind]
  );

  return { options, setOptions: setLocal, addOption };
}
