interface FilterGroupProps {
  title: string;
  options: string[];
  type?: "checkbox" | "radio";
  name?: string;
  defaultChecked?: number[];
  bordered?: boolean;
}

const FilterGroup = ({ title, options, type = "checkbox", name, defaultChecked = [], bordered = true }: FilterGroupProps) => (
  <div className={bordered ? "mb-6 border-b border-border pb-6" : "mb-6"}>
    <h4 className="font-semibold text-sm text-foreground mb-3 uppercase tracking-wide">{title}</h4>
    <div className="space-y-2">
      {options.map((opt, i) => (
        <label key={opt} className="flex items-center gap-2 cursor-pointer group">
          <input
            type={type}
            name={type === "radio" ? name : undefined}
            className="rounded border-border text-primary focus:ring-primary h-4 w-4 bg-muted"
            defaultChecked={defaultChecked.includes(i)}
          />
          <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">{opt}</span>
        </label>
      ))}
    </div>
  </div>
);

export default FilterGroup;
