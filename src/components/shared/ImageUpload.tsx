interface ImageUploadProps {
  label?: string;
  hint?: string;
  compact?: boolean;
}

const ImageUpload = ({ label, hint = "PNG, JPG até 5MB", compact = false }: ImageUploadProps) => (
  <div>
    {label && <label className="block text-sm font-medium text-foreground mb-2">{label}</label>}
    <div className={`border-2 border-dashed border-border rounded-lg ${compact ? "p-4" : "p-8"} flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors text-center`}>
      <span className={`material-symbols-outlined ${compact ? "text-3xl" : "text-4xl"} text-muted-foreground mb-1`}>cloud_upload</span>
      <p className="text-sm text-muted-foreground">{compact ? "Clique para upload" : "Arraste uma imagem ou clique para selecionar"}</p>
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  </div>
);

export default ImageUpload;
