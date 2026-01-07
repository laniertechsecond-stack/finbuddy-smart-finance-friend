import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, Download, Check } from 'lucide-react';
import { useBackgroundRemoval } from '@/hooks/useBackgroundRemoval';
import { cn } from '@/lib/utils';

interface LogoUploaderProps {
  onLogoProcessed?: (blob: Blob, url: string) => void;
  className?: string;
}

export function LogoUploader({ onLogoProcessed, className }: LogoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const { isProcessing, progress, error, processImage, processedImageUrl } = useBackgroundRemoval();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show original preview
    setOriginalPreview(URL.createObjectURL(file));

    // Process the image
    const resultBlob = await processImage(file);
    
    if (resultBlob && processedImageUrl) {
      onLogoProcessed?.(resultBlob, processedImageUrl);
    }
  };

  const handleDownload = () => {
    if (!processedImageUrl) return;
    
    const link = document.createElement('a');
    link.href = processedImageUrl;
    link.download = 'logo-transparent.png';
    link.click();
  };

  return (
    <div className={cn("space-y-4", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={isProcessing}
        className="w-full h-12 rounded-xl"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {progress}
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            Upload Logo
          </>
        )}
      </Button>

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      {(originalPreview || processedImageUrl) && (
        <div className="grid grid-cols-2 gap-4">
          {originalPreview && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground text-center">Original</p>
              <div className="bg-muted rounded-xl p-4 flex items-center justify-center min-h-[120px]">
                <img
                  src={originalPreview}
                  alt="Original"
                  className="max-w-full max-h-24 object-contain"
                />
              </div>
            </div>
          )}

          {processedImageUrl && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                <Check className="w-3 h-3 text-finbud-green" />
                Transparent
              </p>
              <div 
                className="rounded-xl p-4 flex items-center justify-center min-h-[120px]"
                style={{
                  backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                }}
              >
                <img
                  src={processedImageUrl}
                  alt="Transparent"
                  className="max-w-full max-h-24 object-contain"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {processedImageUrl && (
        <Button
          variant="hero"
          onClick={handleDownload}
          className="w-full h-10 rounded-xl"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Transparent PNG
        </Button>
      )}
    </div>
  );
}
