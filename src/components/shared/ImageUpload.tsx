import { useRef } from "react";

interface ImageUploadProps {
  label?: string;
  hint?: string;
  compact?: boolean;
  previewUrl?: string;
  onFileSelect?: (file: File) => void;
}

const ImageUpload = ({ label, hint = "PNG, JPG até 5MB", compact = false, previewUrl, onFileSelect }: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) onFileSelect(file);
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium text-foreground mb-2">{label}</label>}
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
    </div>
  );
};

export default ImageUpload;
