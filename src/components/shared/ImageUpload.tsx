import { useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";

interface ImageUploadProps {
  label?: string;
  hint?: string;
  compact?: boolean;
  previewUrl?: string;
  onFileSelect?: (file: File) => void;
  onUrlSubmit?: (url: string) => void;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const ImageUpload = ({ label, hint = "JPG, PNG ou WEBP até 5MB (comprimido para ~1MB)", compact = false, previewUrl, onFileSelect, onUrlSubmit }: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [urlValue, setUrlValue] = useState("");
  const [compressing, setCompressing] = useState(false);

  const handleClick = () => {
    if (!compressing) inputRef.current?.click();
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Formato inválido. Use JPG, PNG ou WEBP.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    try {
      setCompressing(true);
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      });
      const finalFile = new File([compressedFile], file.name, { type: compressedFile.type || file.type });
      if (onFileSelect) onFileSelect(finalFile);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao comprimir imagem.");
    } finally {
      setCompressing(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleUrlConfirm = () => {
    if (urlValue.trim() && onUrlSubmit) {
      onUrlSubmit(urlValue.trim());
      setUrlValue("");
    }
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium text-foreground mb-2">{label}</label>}

      {/* Mode toggle */}
      <div className="flex gap-1 mb-2">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`text-xs px-3 py-1 rounded-md transition-colors ${mode === "upload" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
        >
          Upload
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`text-xs px-3 py-1 rounded-md transition-colors ${mode === "url" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
        >
          URL
        </button>
      </div>

      {mode === "upload" ? (
        <>
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleChange} />
          <div
            onClick={handleClick}
            className={`border-2 border-dashed border-border rounded-lg ${compact ? "p-4" : "p-8"} flex flex-col items-center justify-center ${compressing ? "cursor-wait opacity-70" : "cursor-pointer"} hover:border-primary hover:bg-muted/50 transition-colors text-center`}
          >
            {compressing ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mb-2" />
                <p className="text-sm text-muted-foreground">Comprimindo imagem...</p>
              </>
            ) : (
              <>
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="max-h-32 object-contain rounded mb-2" />
                ) : (
                  <span className={`material-symbols-outlined ${compact ? "text-3xl" : "text-4xl"} text-muted-foreground mb-1`}>cloud_upload</span>
                )}
                <p className="text-sm text-muted-foreground">{previewUrl ? "Clique para trocar" : compact ? "Clique para upload" : "Arraste uma imagem ou clique para selecionar"}</p>
                {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
              </>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://exemplo.com/imagem.jpg"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              className="flex-1 rounded-lg border border-border bg-card text-foreground text-sm px-3 py-2 focus:ring-primary focus:border-primary"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleUrlConfirm())}
            />
            <button
              type="button"
              onClick={handleUrlConfirm}
              disabled={!urlValue.trim()}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              Usar
            </button>
          </div>
          {previewUrl && (
            <div className="border border-border rounded-lg p-3 flex items-center justify-center">
              <img src={previewUrl} alt="Preview" className="max-h-32 object-contain rounded" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
