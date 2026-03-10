import { useRef, useState } from "react";

interface ImageUploadProps {
  label?: string;
  hint?: string;
  compact?: boolean;
  previewUrl?: string;
  onFileSelect?: (file: File) => void;
  onUrlSubmit?: (url: string) => void;
}

const ImageUpload = ({ label, hint = "PNG, JPG até 5MB", compact = false, previewUrl, onFileSelect, onUrlSubmit }: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [urlValue, setUrlValue] = useState("");

  const handleClick = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) onFileSelect(file);
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
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
          <div
            onClick={handleClick}
            className={`border-2 border-dashed border-border rounded-lg ${compact ? "p-4" : "p-8"} flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors text-center`}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="max-h-32 object-contain rounded mb-2" />
            ) : (
              <span className={`material-symbols-outlined ${compact ? "text-3xl" : "text-4xl"} text-muted-foreground mb-1`}>cloud_upload</span>
            )}
            <p className="text-sm text-muted-foreground">{previewUrl ? "Clique para trocar" : compact ? "Clique para upload" : "Arraste uma imagem ou clique para selecionar"}</p>
            {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
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
