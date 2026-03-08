interface FormFieldBaseProps {
  label: string;
  hint?: string;
  labelSize?: "sm" | "xs";
  className?: string;
}

interface InputFieldProps extends FormFieldBaseProps {
  type: "text" | "number" | "email" | "url";
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  disabled?: boolean;
  defaultValue?: string | number;
  value?: string | number;
  onChange?: (value: string) => void;
}

interface SelectFieldProps extends FormFieldBaseProps {
  type: "select";
  options: string[];
  multiple?: boolean;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
}

interface TextareaFieldProps extends FormFieldBaseProps {
  type: "textarea";
  rows?: number;
  placeholder?: string;
  mono?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

type FormFieldProps = InputFieldProps | SelectFieldProps | TextareaFieldProps;

const baseClasses = "w-full rounded-lg border border-border bg-card text-foreground focus:ring-primary focus:border-primary text-sm px-3 py-2";

const FormField = (props: FormFieldProps) => {
  const labelClass = props.labelSize === "xs"
    ? "block text-xs font-medium text-foreground mb-1"
    : "block text-sm font-medium text-foreground mb-2";

  return (
    <div className={props.className}>
      <label className={labelClass}>{props.label}</label>

      {props.type === "select" ? (
        <select
          className={baseClasses}
          multiple={props.multiple}
          value={props.value}
          defaultValue={props.value === undefined ? props.defaultValue : undefined}
          onChange={props.onChange ? (e) => props.onChange!(e.target.value) : undefined}
        >
          {props.options.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      ) : props.type === "textarea" ? (
        <>
          <textarea
            className={`${baseClasses} ${props.mono ? "font-mono" : ""}`}
            rows={props.rows || 4}
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange ? (e) => props.onChange!(e.target.value) : undefined}
          />
          {props.hint && <p className="text-xs text-muted-foreground mt-1">{props.hint}</p>}
        </>
      ) : (
        <>
          <div className={props.prefix || props.suffix ? "relative" : ""}>
            {props.prefix && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{props.prefix}</span>
            )}
            <input
              className={`${baseClasses} ${props.prefix ? "pl-8" : ""} ${props.suffix ? "pr-10" : ""} ${props.disabled ? "bg-muted text-muted-foreground cursor-not-allowed" : ""}`}
              type={props.type}
              placeholder={props.placeholder}
              disabled={props.disabled}
              value={props.value}
              defaultValue={props.value === undefined ? props.defaultValue : undefined}
              onChange={props.onChange ? (e) => props.onChange!(e.target.value) : undefined}
            />
            {props.suffix && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{props.suffix}</span>
            )}
          </div>
          {props.hint && <p className="text-xs text-muted-foreground mt-1">{props.hint}</p>}
        </>
      )}
    </div>
  );
};

export default FormField;
