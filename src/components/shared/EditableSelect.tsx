import { useState } from "react";

interface EditableSelectProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  onOptionsChange?: (options: string[]) => void;
  onAdd?: (value: string) => void | Promise<void>;
  labelSize?: "sm" | "xs";
  className?: string;
  addLabel?: string;
}

const baseClasses =
  "w-full rounded-lg border border-border bg-card text-foreground focus:ring-primary focus:border-primary text-sm px-3 py-2";

const ADD_SENTINEL = "__add_new__";

/**
 * Select com opção "Adicionar novo..." que revela um campo de texto inline.
 * Ao confirmar, o novo valor é incluído nas opções e selecionado automaticamente.
 * Persistência: as opções adicionadas vivem no estado local da página (sessão).
 */
const EditableSelect = ({
  label,
  options,
  value,
  onChange,
  onOptionsChange,
  onAdd,
  labelSize = "sm",
  className,
  addLabel = "➕ Adicionar novo...",
}: EditableSelectProps) => {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const labelClass =
    labelSize === "xs"
      ? "block text-xs font-medium text-foreground mb-1"
      : "block text-sm font-medium text-foreground mb-2";

  const confirmAdd = () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      setAdding(false);
      setDraft("");
      return;
    }
    if (!options.includes(trimmed)) {
      onOptionsChange?.([...options, trimmed]);
    }
    onAdd?.(trimmed);
    onChange(trimmed);
    setDraft("");
    setAdding(false);
  };

  const cancelAdd = () => {
    setDraft("");
    setAdding(false);
  };

  return (
    <div className={className}>
      <label className={labelClass}>{label}</label>

      {adding ? (
        <div className="flex gap-2">
          <input
            autoFocus
            type="text"
            className={baseClasses}
            placeholder="Digite o novo valor"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                confirmAdd();
              } else if (e.key === "Escape") {
                e.preventDefault();
                cancelAdd();
              }
            }}
          />
          <button
            type="button"
            onClick={confirmAdd}
            className="px-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
            aria-label="Confirmar"
          >
            <span className="material-symbols-outlined text-base align-middle">check</span>
          </button>
          <button
            type="button"
            onClick={cancelAdd}
            className="px-3 rounded-lg bg-muted text-foreground text-sm font-medium border border-border hover:opacity-80"
            aria-label="Cancelar"
          >
            <span className="material-symbols-outlined text-base align-middle">close</span>
          </button>
        </div>
      ) : (
        <select
          className={baseClasses}
          value={value}
          onChange={(e) => {
            if (e.target.value === ADD_SENTINEL) {
              setAdding(true);
              return;
            }
            onChange(e.target.value);
          }}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt === "" ? "—" : opt}
            </option>
          ))}
          <option value={ADD_SENTINEL}>{addLabel}</option>
        </select>
      )}
    </div>
  );
};

export default EditableSelect;
