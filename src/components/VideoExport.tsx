import React, { useEffect, useRef, useState } from 'react';
import { Device } from '../types/types';
import { Download } from 'lucide-react';

interface VideoExportProps {
  devices: Device[];
  onClose: () => void;
}

const VideoExport: React.FC<VideoExportProps> = ({ devices, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const calculateOptimalFontSize = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
    maxHeight: number,
    minFontSize: number = 20,
    maxFontSize: number = 40
  ): number => {
    let fontSize = maxFontSize;
    let fits = false;

    while (!fits && fontSize >= minFontSize) {
      ctx.font = `${fontSize}px Arial`;
      const words = text.split(' ');
      let lines = 1;
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine + word + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth) {
          lines++;
          currentLine = word + ' ';
        } else {
          currentLine = testLine;
        }
      }

      const lineHeight = fontSize * 1.2;
      const totalHeight = lines * lineHeight;

      if (totalHeight <= maxHeight) {
        fits = true;
      } else {
        fontSize -= 2;
      }
    }

    return fontSize;
  };

  const drawWrappedText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ): number => {
    const words = text.split(' ');
    let currentLine = '';
    let currentY = y;

    for (const word of words) {
      const testLine = currentLine + word + ' ';
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine !== '') {
        ctx.fillText(currentLine, x, currentY);
        currentLine = word + ' ';
        currentY += lineHeight;
      } else {
        currentLine = testLine;
      }
    }
    
    ctx.fillText(currentLine, x, currentY);
    return currentY + lineHeight;
  };

  const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (error) => {
        console.error("Failed to load image:", url, error);
        // If cross-origin fails, try without it
        const fallbackImg = new Image();
        fallbackImg.onload = () => resolve(fallbackImg);
        fallbackImg.onerror = (error) => reject(error);
        fallbackImg.src = url;
      };
      img.src = url;
    });
  };

  const handleDownload = async () => {
    console.log("Starting video export process...");
    console.log("Number of devices to process:", devices.length);
    
    if (!canvasRef.current) {
      console.error("Canvas reference is not available");
      return;
    }
    
    setIsDownloading(true);
    setProgress(0);

    try {
      console.log("Loading JSZip...");
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      console.log("JSZip loaded successfully");

      // Sort devices by start year (most recent first)
      const sortedDevices = [...devices].sort((a, b) => b.startYear - a.startYear);
      console.log("Devices sorted by year:", sortedDevices.map(d => d.name));

      // Generate images for each device
      for (let i = 0; i < sortedDevices.length; i++) {
        console.log(`Processing device ${i + 1}/${sortedDevices.length}:`, sortedDevices[i].name);
        
        const device = sortedDevices[i];
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          console.error("Failed to get canvas context");
          continue;
        }

        // Clear canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw year
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 120px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(device.startYear.toString(), 100, 200);

        // Draw device name
        ctx.font = 'bold 80px Arial';
        ctx.fillText(device.name, 100, 350);

        // Draw description if exists
        if (device.notes || device.description) {
          console.log("Drawing text for:", device.name);
          ctx.fillStyle = '#666666';
          
          // Use notes if available, otherwise use description
          const text = device.notes || device.description || '';
          
          // Calculate optimal font size for text
          const maxWidth = 400;
          const maxHeight = 400; // Leave space for year and name
          const fontSize = calculateOptimalFontSize(
            ctx,
            text,
            maxWidth,
            maxHeight
          );
          
          ctx.font = `${fontSize}px Arial`;
          const lineHeight = fontSize * 1.2;
          
          // Draw the wrapped text
          drawWrappedText(
            ctx,
            text,
            100,
            450,
            maxWidth,
            lineHeight
          );
        }

        // Draw device image if exists
        if (device.imageUrl) {
          try {
            console.log("Loading image for:", device.name, device.imageUrl);
            const img = await loadImage(device.imageUrl);
            console.log("Image loaded for:", device.name);
            
            // Calculate dimensions to maintain aspect ratio
            const maxSize = 600;
            const aspectRatio = img.width / img.height;
            let width = maxSize;
            let height = maxSize;
            
            if (aspectRatio > 1) {
              // Image is wider than tall
              height = maxSize / aspectRatio;
            } else {
              // Image is taller than wide
              width = maxSize * aspectRatio;
            }
            
            // Position image on the right side
            const x = canvas.width - width - 100;
            const y = (canvas.height - height) / 2;
            
            ctx.drawImage(img, x, y, width, height);
          } catch (error) {
            console.error("Failed to load image for:", device.name, error);
          }
        }

        // Add image to zip
        console.log("Converting canvas to PNG for:", device.name);
        const imageData = canvas.toDataURL('image/png').split(',')[1];
        zip.file(`slide_${i.toString().padStart(3, '0')}.png`, imageData, { base64: true });
        console.log("Added slide to zip:", device.name);

        // Update progress
        const newProgress = Math.round(((i + 1) / sortedDevices.length) * 100);
        console.log("Progress updated:", newProgress + "%");
        setProgress(newProgress);
      }

      console.log("Generating zip file...");
      const content = await zip.generateAsync({ type: 'blob' });
      console.log("Zip file generated, size:", content.size, "bytes");

      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tech-timeline-slides.zip';
      document.body.appendChild(a);
      console.log("Starting download...");
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log("Download completed");
    } catch (error) {
      console.error("Error during video export:", error);
    } finally {
      console.log("Cleaning up...");
      setIsDownloading(false);
      setProgress(0);
    }
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={1080}
        height={1080}
        className="hidden"
      />
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download size={16} className="mr-2" />
        {isDownloading ? (
          <span className="flex items-center">
            <span className="mr-2">Generating...</span>
            <span className="text-sm">{progress}%</span>
          </span>
        ) : (
          'Export Video'
        )}
      </button>
      {isDownloading && (
        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default VideoExport; 