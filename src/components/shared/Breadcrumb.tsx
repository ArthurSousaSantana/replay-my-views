import { Link } from "react-router-dom";

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  variant?: "light" | "dark";
}

const Breadcrumb = ({ items, variant = "dark" }: BreadcrumbProps) => {
  const textColor = variant === "light" ? "text-blue-200" : "text-muted-foreground";
  const activeColor = variant === "light" ? "text-white" : "text-foreground";
  const hoverColor = variant === "light" ? "hover:text-white" : "hover:text-primary";

  return (
    <nav aria-label="Breadcrumb" className={`flex text-sm ${textColor}`}>
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, i) => (
          <li key={i} className={i === 0 ? "inline-flex items-center" : ""} aria-current={i === items.length - 1 ? "page" : undefined}>
            <div className="flex items-center">
              {i > 0 && <span className="material-symbols-outlined text-sm mx-1">chevron_right</span>}
              {i === 0 && item.to && (
                <span className="material-symbols-outlined text-sm mr-1">home</span>
              )}
              {item.to && i < items.length - 1 ? (
                <Link to={item.to} className={`${hoverColor} transition-colors`}>
                  {item.label}
                </Link>
              ) : (
                <span className={i === items.length - 1 ? `font-medium ${activeColor}` : ""}>
                  {item.label}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
