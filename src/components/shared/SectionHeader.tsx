import { Link } from "react-router-dom";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  linkTo?: string;
  linkLabel?: string;
}

const SectionHeader = ({ title, subtitle, linkTo, linkLabel }: SectionHeaderProps) => (
  <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
    <div>
      <h2 className="text-3xl font-bold text-foreground">{title}</h2>
      {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
    </div>
    {linkTo && linkLabel && (
      <Link
        to={linkTo}
        className="inline-flex items-center justify-center px-6 py-2 border border-border rounded-full text-sm font-medium text-muted-foreground bg-surface hover:bg-muted transition-colors"
      >
        {linkLabel}
        <span className="material-symbols-outlined text-sm ml-2">arrow_forward</span>
      </Link>
    )}
  </div>
);

export default SectionHeader;
