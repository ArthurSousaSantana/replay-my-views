import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface ShareButtonsProps {
  variant?: "full" | "compact";
  url?: string;
  text?: string;
}

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0h-.056zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
  </svg>
);

const shareUrl = () => typeof window !== "undefined" ? window.location.href : "";

const handleShare = (platform: string, url: string, text: string) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);

  switch (platform) {
    case "whatsapp":
      window.open(`https://wa.me/?text=${encodedText}%20${encodedUrl}`, "_blank", "noopener,noreferrer");
      break;
    case "telegram":
      window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`, "_blank", "noopener,noreferrer");
      break;
    case "x":
      window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`, "_blank", "noopener,noreferrer");
      break;
  }
};

const ShareButtons = ({ variant = "full", url, text = "Confira esta oferta!" }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);
  const finalUrl = url || shareUrl();

  const handleCopy = () => {
    navigator.clipboard.writeText(finalUrl).then(() => {
      setCopied(true);
      toast({ title: "Link copiado!", description: "O link foi copiado para a área de transferência." });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const buttons = [
    { platform: "whatsapp", label: "WhatsApp", icon: <WhatsAppIcon className="w-5 h-5" />, bg: "bg-green-500 hover:bg-green-600", compactBg: "bg-green-50 hover:bg-green-100 text-green-600" },
    { platform: "telegram", label: "Telegram", icon: <TelegramIcon className="w-5 h-5" />, bg: "bg-[#0088cc] hover:bg-[#0077b5]", compactBg: "bg-blue-50 hover:bg-blue-100 text-[#0088cc]" },
    { platform: "x", label: "X", icon: <XIcon className="w-5 h-5" />, bg: "bg-black hover:bg-gray-800", compactBg: "bg-gray-100 hover:bg-gray-200 text-black" },
  ];

  if (variant === "compact") {
    return (
      <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>Compartilhar:</span>
        <div className="flex gap-2">
          {buttons.map((btn) => (
            <button key={btn.platform} onClick={() => handleShare(btn.platform, finalUrl, text)} className={`w-10 h-10 rounded-full ${btn.compactBg} flex items-center justify-center transition-colors`}>
              {btn.icon}
            </button>
          ))}
          <button onClick={handleCopy} className="w-10 h-10 rounded-full bg-muted hover:opacity-80 text-muted-foreground flex items-center justify-center transition-colors">
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Compartilhar</h4>
      <div className="flex gap-4">
        {buttons.map((btn) => (
          <button key={btn.platform} onClick={() => handleShare(btn.platform, finalUrl, text)} className={`flex-1 ${btn.bg} text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm`}>
            {btn.icon}
            <span className="hidden xl:inline">{btn.label}</span>
          </button>
        ))}
        <button onClick={handleCopy} className="flex-1 bg-muted hover:opacity-80 text-foreground border border-border py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm">
          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          <span className="hidden xl:inline">{copied ? "Copiado!" : "Copiar Link"}</span>
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;
