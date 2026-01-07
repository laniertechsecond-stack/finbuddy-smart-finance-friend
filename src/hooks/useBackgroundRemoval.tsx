import { useState, useCallback } from 'react';
import { removeBackground, loadImage } from '@/lib/removeBackground';

interface UseBackgroundRemovalReturn {
  isProcessing: boolean;
  progress: string;
  error: string | null;
  processImage: (file: File) => Promise<Blob | null>;
  processedImageUrl: string | null;
}

export function useBackgroundRemoval(): UseBackgroundRemovalReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);

  const processImage = useCallback(async (file: File): Promise<Blob | null> => {
    setIsProcessing(true);
    setError(null);
    setProgress('Loading image...');

    try {
      const imageElement = await loadImage(file);
      setProgress('Removing background (this may take a moment)...');
      
      const resultBlob = await removeBackground(imageElement);
      
      // Create URL for preview
      const url = URL.createObjectURL(resultBlob);
      setProcessedImageUrl(url);
      setProgress('Done!');
      
      return resultBlob;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove background';
      setError(message);
      setProgress('');
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    isProcessing,
    progress,
    error,
    processImage,
    processedImageUrl,
  };
}
