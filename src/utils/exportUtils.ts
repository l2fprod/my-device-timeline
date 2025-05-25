import { Device } from '../types/types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const formatForLinkedIn = (devices: Device[]): string => {
  // Sort devices by start year (most recent first)
  const sortedDevices = [...devices].sort((a, b) => b.startYear - a.startYear);
  
  let output = '📱 My Technology Journey 💻\n\n';
  
  // Group devices by year
  const devicesByYear = sortedDevices.reduce((acc, device) => {
    if (!acc[device.startYear]) {
      acc[device.startYear] = [];
    }
    acc[device.startYear].push(device);
    return acc;
  }, {} as Record<number, Device[]>);
  
  // Output devices grouped by year
  Object.entries(devicesByYear)
    .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
    .forEach(([year, yearDevices]) => {
      output += `📅 ${year}\n`;
      yearDevices.forEach(device => {
        output += `🔹 ${device.name}\n`;
        if (device.notes) {
          output += `   ${device.notes}\n`;
        }
      });
      output += '\n';
    });
  
  output += '#TechJourney #Technology #ProfessionalDevelopment';
  
  return output;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
};

export const exportAsLinkedInImage = async (devices: Device[], fileName: string = 'tech-timeline.png'): Promise<void> => {
  try {
    // Card and layout settings
    const cardWidth = 220;
    const cardHeight = 280;
    const cardGapX = 32;
    const cardGapY = 48;
    const imageWidth = 1080;
    const margin = 40;
    const zigzagOffset = 40; // vertical offset for zig-zag

    // Sort devices by year (oldest first)
    const sortedDevices = [...devices].sort((a, b) => a.startYear - b.startYear);
    const numCardsPerRow = Math.max(1, Math.floor((imageWidth - margin * 2 + cardGapX) / (cardWidth + cardGapX)));
    const numRows = Math.ceil(sortedDevices.length / numCardsPerRow);
    const imageHeight = margin * 2 + numRows * cardHeight + (numRows - 1) * cardGapY + zigzagOffset;

    // Create container
    const container = document.createElement('div');
    container.style.width = `${imageWidth}px`;
    container.style.height = `${imageHeight}px`;
    container.style.background = 'linear-gradient(to bottom right, #eef2ff, #ffffff, #faf5ff)';
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.padding = '0';
    document.body.appendChild(container);

    function getCardColors(seed: string) {
      // Simple hash to pick a color pair from a palette
      const palette = [
        ['#ffb347', '#ffcc33'], // orange-yellow
        ['#6dd5ed', '#2193b0'], // blue-cyan
        ['#f7971e', '#ffd200'], // orange-gold
        ['#f953c6', '#b91d73'], // pink-purple
        ['#43cea2', '#185a9d'], // green-blue
        ['#ff6e7f', '#bfe9ff'], // pink-lightblue
        ['#f7797d', '#FBD786'], // red-yellow
        ['#c471f5', '#fa71cd'], // purple-pink
        ['#30cfd0', '#330867'], // teal-indigo
        ['#f857a6', '#ff5858'], // magenta-red
      ];
      let hash = 0;
      for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) % palette.length;
      return palette[Math.abs(hash) % palette.length];
    }

    // Add cards in zig-zag, wrapping layout
    sortedDevices.forEach((device, i) => {
      const row = Math.floor(i / numCardsPerRow);
      const col = i % numCardsPerRow;
      const zigzag = (col % 2 === 0) ? 0 : zigzagOffset;
      const left = margin + col * (cardWidth + cardGapX);
      const top = margin + row * (cardHeight + cardGapY) + zigzag;

      // Get unique colors for this card
      const [color1, color2] = getCardColors(`${device.startYear}${device.name}`);

      const card = document.createElement('div');
      card.style.position = 'absolute';
      card.style.left = `${left}px`;
      card.style.top = `${top}px`;
      card.style.width = `${cardWidth}px`;
      card.style.height = `${cardHeight}px`;
      card.style.background = `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
      card.style.borderRadius = '28px';
      card.style.borderBottomLeftRadius = '10px';
      card.style.borderBottomRightRadius = '10px';
      card.style.boxShadow = `0 8px 32px 0 ${color1}55, 0 2px 8px 0 #0002`;
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.alignItems = 'center';
      card.style.justifyContent = 'flex-start';
      card.style.padding = '0';
      card.style.overflow = 'hidden';
      card.style.gap = '0';
      card.style.border = `4px solid #fff8`;
      card.style.position = 'absolute';

      // Title area: year as background watermark, device name on top
      const titleArea = document.createElement('div');
      titleArea.style.position = 'relative';
      titleArea.style.width = '100%';
      titleArea.style.height = '60px';
      titleArea.style.display = 'flex';
      titleArea.style.flexDirection = 'column';
      titleArea.style.alignItems = 'center';
      titleArea.style.justifyContent = 'center';
      titleArea.style.overflow = 'hidden';

      // Year (background watermark)
      const year = document.createElement('div');
      year.textContent = device.startYear.toString();
      year.style.position = 'absolute';
      year.style.top = '-20px';
      year.style.left = '0';
      year.style.width = '100%';
      year.style.height = '100%';
      year.style.fontFamily = 'Arial Black, Arial, sans-serif';
      year.style.fontSize = '60px';
      year.style.fontWeight = 'bold';
      year.style.color = 'rgba(255,255,255,0.22)';
      year.style.textAlign = 'center';
      year.style.letterSpacing = '2px';
      year.style.lineHeight = '60px';
      year.style.userSelect = 'none';
      year.style.pointerEvents = 'none';
      year.style.textShadow = '0 2px 8px #0002';
      titleArea.appendChild(year);

      // Device name (on top)
      const name = document.createElement('div');
      name.textContent = device.name;
      name.style.marginTop = '10px';
      name.style.position = 'relative';
      name.style.fontFamily = 'Arial Black, Arial, sans-serif';
      name.style.fontSize = '18px';
      name.style.fontWeight = 'bold';
      name.style.color = '#fff';
      name.style.textAlign = 'center';
      name.style.overflow = 'hidden';
      name.style.textOverflow = 'ellipsis';
      name.style.display = '-webkit-box';
      name.style.webkitLineClamp = '2';
      name.style.webkitBoxOrient = 'vertical';
      name.style.width = '100%';
      name.style.zIndex = '2';
      name.style.textShadow = '0 2px 8px #0008, 0 1px 0 #fff8';
      name.style.lineHeight = '60px';
      titleArea.appendChild(name);

      card.appendChild(titleArea);

      // Image with glow
      const imgContainer = document.createElement('div');
      imgContainer.style.width = 'calc(100% - 20px)';
      if (device.notes) {
        imgContainer.style.height = '100px';
      } else {
        imgContainer.style.flex = '1 1 auto';
        imgContainer.style.marginBottom = '10px';
      }
      imgContainer.style.display = 'flex';
      imgContainer.style.alignItems = 'center';
      imgContainer.style.justifyContent = 'center';
      imgContainer.style.background = 'rgba(255,255,255,0.25)';
      imgContainer.style.borderRadius = '10px';
      imgContainer.style.position = 'relative';
      imgContainer.style.boxShadow = `0 0 24px 0 ${color2}55`;
      imgContainer.style.marginTop = '15px';

      const img = document.createElement('img');
      img.src = device.imageUrl;
      img.alt = device.name;
      img.style.maxWidth = '80%';
      img.style.width = 'auto';
      img.style.height = 'auto';
      if (device.notes) {
        img.style.minHeight = '90px';
        img.style.maxHeight = '90px';
      } else {
        img.style.maxHeight = '160px';
      }
      img.style.objectFit = 'contain';
      img.style.borderRadius = '12px';
      img.style.boxShadow = `0 0 16px 0 ${color1}55`;
      imgContainer.appendChild(img);
      card.appendChild(imgContainer);

      // Notes area (like a Pokémon card description box)
      if (device.notes) {
        const notes = document.createElement('div');
        notes.textContent = device.notes;
        notes.style.fontFamily = 'Inter, Segoe UI, Arial, sans-serif';
        notes.style.fontSize = '13px';
        notes.style.color = '#222';
        notes.style.background = 'rgba(255,255,255,0.7)';
        notes.style.borderRadius = '10px';
        // notes.style.padding = '10px 12px';
        notes.style.marginTop = '10px';
        notes.style.flex = '1 1 auto';
        notes.style.overflow = 'hidden';
        notes.style.maxHeight = '80px';
        notes.style.textOverflow = 'ellipsis';
        notes.style.width = 'calc(100% - 16px)';
        notes.style.boxShadow = `0 1px 6px 0 #0001`;
        notes.style.textAlign = 'center';
        notes.style.display = '-webkit-box';
        notes.style.webkitLineClamp = '4';
        notes.style.webkitBoxOrient = 'vertical';
        notes.style.wordBreak = 'break-word';
        card.appendChild(notes);
      }

      // Optional: sparkle overlay
      const sparkle = document.createElement('div');
      sparkle.style.position = 'absolute';
      sparkle.style.left = '0';
      sparkle.style.top = '0';
      sparkle.style.width = '100%';
      sparkle.style.height = '100%';
      sparkle.style.pointerEvents = 'none';
      sparkle.style.background = 'repeating-linear-gradient(135deg,rgba(255,255,255,0.08) 0 2px,transparent 2px 8px)';
      sparkle.style.borderRadius = '28px';
      card.appendChild(sparkle);

      container.appendChild(card);
    });

    // Generate image
    const canvas = await html2canvas(container, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
      useCORS: true,
      width: imageWidth,
      height: imageHeight
    });

    // Clean up
    document.body.removeChild(container);

    // Download image
    const link = document.createElement('a');
    link.download = fileName;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Failed to export LinkedIn image:', error);
  }
};

export const exportAsPDF = async (
  devices: Device[],
  onProgress?: (progress: number) => void
): Promise<void> => {
  try {
    // Create a new PDF document with square page size (1080x1080)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [1080, 1080],
      compress: true // Enable PDF compression
    });

    // Sort devices by year (most recent first)
    const sortedDevices = [...devices].sort((a, b) => b.startYear - a.startYear);

    // Process each device
    for (let i = 0; i < sortedDevices.length; i++) {
      const device = sortedDevices[i];
      
      // Update progress
      const progress = ((i + 1) / sortedDevices.length) * 100;
      onProgress?.(progress);
      
      // Create a temporary container for the device card
      const container = document.createElement('div');
      container.style.width = '1080px';
      container.style.height = '1080px';
      container.style.background = 'linear-gradient(to bottom right, #eef2ff, #ffffff, #faf5ff)';
      container.style.padding = '40px';
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      document.body.appendChild(container);

      // Create device card content with fixed heights and dynamic text sizing
      container.innerHTML = `
        <div style="display: flex; flex-direction: column; height: 100%;">
          <div style="text-align: center; height: 120px; display: flex; flex-direction: column; justify-content: center;">
            <h1 style="font-family: 'Arial', sans-serif; font-size: 48px; color: #1a1a1a; margin: 0; line-height: 1.2;">
              ${device.name}
            </h1>
            <p style="font-family: 'Arial', sans-serif; font-size: 24px; color: #666; margin: 10px 0 0;">
              ${device.startYear}
            </p>
          </div>
          
          <div style="flex: 1; display: flex; gap: 40px; margin-top: 20px; height: calc(100% - 140px);">
            <div style="flex: 1; display: flex; justify-content: center; align-items: center; background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              <img 
                src="${device.imageUrl}" 
                alt="${device.name}"
                style="max-width: 100%; max-height: 100%; object-fit: contain;"
              />
            </div>
            
            <div style="flex: 1; display: flex; flex-direction: column; background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              ${device.notes ? `
                <div style="margin-bottom: 30px; flex: 1; display: flex; flex-direction: column; min-height: 0;">
                  <h2 style="font-family: 'Arial', sans-serif; font-size: 24px; color: #1a1a1a; margin: 0 0 15px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                    My Notes
                  </h2>
                  <div class="auto-size-text" style="font-family: 'Arial', sans-serif; color: #666; line-height: 1.5; flex: 1; overflow: hidden;">
                    ${device.notes}
                  </div>
                </div>
              ` : ''}
              
              <div style="margin-bottom: 30px; flex: 1; display: flex; flex-direction: column; min-height: 0;">
                <h2 style="font-family: 'Arial', sans-serif; font-size: 24px; color: #1a1a1a; margin: 0 0 15px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                  Device Information
                </h2>
                <div class="auto-size-text" style="font-family: 'Arial', sans-serif; color: #666; line-height: 1.5; flex: 1; overflow: hidden;">
                  ${device.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      // Wait for images to load before resizing text
      const images = container.getElementsByTagName('img');
      await Promise.all(Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      }));

      // Function to resize text
      const resizeText = () => {
        const textContainers = container.querySelectorAll('.auto-size-text');
        textContainers.forEach(textContainer => {
          const parent = textContainer.parentElement;
          if (!parent) return;

          const parentHeight = parent.clientHeight - 60; // Account for header and margins
          const container = textContainer as HTMLElement;
          
          // Start with a large font size
          let fontSize = 24;
          container.style.fontSize = fontSize + 'px';
          
          // Reduce font size until text fits
          while (container.scrollHeight > parentHeight && fontSize > 8) {
            fontSize -= 0.5;
            container.style.fontSize = fontSize + 'px';
          }
        });
      };

      // Initial resize
      resizeText();

      // Convert the container to canvas with compression settings
      const canvas = await html2canvas(container, {
        scale: 1.5, // Reduced from 2 for better compression
        useCORS: true,
        logging: false,
        backgroundColor: null,
        imageTimeout: 0,
        onclone: (clonedDoc) => {
          // Resize text in the cloned document
          const textContainers = clonedDoc.querySelectorAll('.auto-size-text');
          textContainers.forEach(textContainer => {
            const parent = textContainer.parentElement;
            if (!parent) return;

            const parentHeight = parent.clientHeight - 60;
            const container = textContainer as HTMLElement;
            
            let fontSize = 24;
            container.style.fontSize = fontSize + 'px';
            
            while (container.scrollHeight > parentHeight && fontSize > 8) {
              fontSize -= 0.5;
              container.style.fontSize = fontSize + 'px';
            }
          });
        }
      });

      // Compress the canvas image data
      const imgData = canvas.toDataURL('image/jpeg', 0.7); // Use JPEG with 70% quality instead of PNG

      // Add the compressed image to the PDF
      pdf.addImage(imgData, 'JPEG', 0, 0, 1080, 1080, undefined, 'FAST');

      // Remove the temporary container
      document.body.removeChild(container);

      // Add a new page if this isn't the last device
      if (i < sortedDevices.length - 1) {
        pdf.addPage();
      }
    }

    // Save the PDF with compression
    pdf.save('tech-timeline.pdf');
    
    // Set progress to 100% when complete
    onProgress?.(100);
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw error;
  }
};