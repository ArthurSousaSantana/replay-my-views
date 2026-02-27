interface AdminFormSectionProps {
  icon: string;
  iconColor?: string;
  title: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
  highlighted?: boolean;
}

const AdminFormSection = ({
  icon,
  iconColor = "bg-blue-100 text-blue-600",
  title,
  children,
  headerRight,
  highlighted = false,
}: AdminFormSectionProps) => (
  <section className={`bg-card rounded-xl shadow-lg border overflow-hidden ${highlighted ? "border-primary/30 ring-1 ring-primary/20" : "border-border"}`}>
    <div className={`border-b border-border p-6 flex justify-between items-center ${highlighted ? "bg-primary/5" : "bg-muted/50"}`}>
      <div className="flex items-center gap-3">
        <span className={`p-2 rounded-lg ${iconColor}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </span>
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
      </div>
      {headerRight}
    </div>
    <div className="p-6">{children}</div>
  </section>
);

export default AdminFormSection;
