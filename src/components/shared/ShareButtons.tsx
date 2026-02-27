interface ShareButtonsProps {
  variant?: "full" | "compact";
}

const buttons = [
  { icon: "chat", label: "WhatsApp", bg: "bg-green-500 hover:bg-green-600", compactBg: "bg-green-50 hover:bg-green-100 text-green-500" },
  { icon: "send", label: "Telegram", bg: "bg-blue-500 hover:bg-blue-600", compactBg: "bg-blue-50 hover:bg-blue-100 text-blue-500" },
  { icon: "post", label: "X / Twitter", bg: "bg-gray-900 hover:bg-gray-800", compactBg: "bg-sky-50 hover:bg-sky-100 text-sky-500" },
  { icon: "content_copy", label: "Copiar Link", bg: "bg-muted hover:opacity-80 text-foreground border border-border", compactBg: "bg-muted hover:opacity-80 text-muted-foreground" },
];

const ShareButtons = ({ variant = "full" }: ShareButtonsProps) => {
  if (variant === "compact") {
    return (
      <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>Compartilhar:</span>
        <div className="flex gap-2">
          {buttons.map((btn) => (
            <button key={btn.icon} className={`w-10 h-10 rounded-full ${btn.compactBg} flex items-center justify-center transition-colors`}>
              <span className="material-symbols-outlined fill-current">{btn.icon}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Compartilhar</h4>
      <div className="flex gap-4">
        {buttons.map((btn) => (
          <button key={btn.icon} className={`flex-1 ${btn.bg} ${btn.bg.includes("text-foreground") ? "" : "text-white"} py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm`}>
            <span className="material-symbols-outlined">{btn.icon}</span>
            <span className="hidden xl:inline">{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShareButtons;
