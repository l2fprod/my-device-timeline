import { Device } from '../types/types';
import { formatTimeRange } from './dateUtils';
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

export const exportAsImage = async (element: HTMLElement, fileName: string): Promise<void> => {
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher quality
      logging: false,
      useCORS: true,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });
    
    const link = document.createElement('a');
    link.download = fileName;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Failed to export image:', error);
  }
};

export const exportAsLinkedInImage = async (devices: Device[], fileName: string = 'tech-timeline.png'): Promise<void> => {
  try {
    // Create a temporary container for the timeline
    const container = document.createElement('div');
    container.style.width = '1080px';
    container.style.height = '1080px';
    container.style.background = 'linear-gradient(to bottom right, #eef2ff, #ffffff, #faf5ff)'; // from-indigo-50 via-white to-purple-50
    container.style.padding = '40px';
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    document.body.appendChild(container);

    // Sort devices by year (oldest first)
    const sortedDevices = [...devices].sort((a, b) => a.startYear - b.startYear);

    // Create header
    const header = document.createElement('div');
    header.style.textAlign = 'center';
    header.style.marginBottom = '40px';
    header.innerHTML = `
      <h1 style="font-family: 'Arial', sans-serif; font-size: 48px; color: #1a1a1a; margin: 0;">
        My Technology Journey
      </h1>
      <p style="font-family: 'Arial', sans-serif; font-size: 24px; color: #666; margin: 10px 0 0;">
        ${sortedDevices.length} devices and counting
      </p>
    `;
    container.appendChild(header);

    // Create timeline grid
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    
    // Calculate optimal grid layout based on number of devices
    const numDevices = sortedDevices.length;
    let gridCols = 2;
    let cardHeight = '180px';
    let cardPadding = '15px';
    let imageHeight = '60%';
    let titleFontSize = '14px';
    let yearFontSize = '12px';
    
    // Adjust grid layout based on number of devices
    if (numDevices <= 4) {
      gridCols = 2;
      cardHeight = '240px';
      cardPadding = '20px';
      imageHeight = '70%';
      titleFontSize = '16px';
      yearFontSize = '14px';
    } else if (numDevices <= 9) {
      gridCols = 3;
      cardHeight = '200px';
      cardPadding = '15px';
      imageHeight = '65%';
      titleFontSize = '15px';
      yearFontSize = '13px';
    } else if (numDevices <= 16) {
      gridCols = 4;
      cardHeight = '180px';
      cardPadding = '12px';
      imageHeight = '60%';
      titleFontSize = '14px';
      yearFontSize = '12px';
    } else {
      gridCols = 5;
      cardHeight = '160px';
      cardPadding = '10px';
      imageHeight = '55%';
      titleFontSize = '13px';
      yearFontSize = '11px';
    }
    
    grid.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;
    grid.style.gap = '15px';
    grid.style.overflow = 'hidden';
    grid.style.maxHeight = '900px'; // Increased to use more vertical space
    grid.style.overflowY = 'auto';
    container.appendChild(grid);

    // Add devices to grid
    sortedDevices.forEach(device => {
      const deviceCard = document.createElement('div');
      deviceCard.style.backgroundColor = '#f8f9fa';
      deviceCard.style.borderRadius = '12px';
      deviceCard.style.padding = cardPadding;
      deviceCard.style.display = 'flex';
      deviceCard.style.flexDirection = 'column';
      deviceCard.style.gap = '8px';
      deviceCard.style.height = cardHeight;
      deviceCard.style.overflow = 'hidden';

      // Device image
      const imgContainer = document.createElement('div');
      imgContainer.style.width = '100%';
      imgContainer.style.height = imageHeight;
      imgContainer.style.display = 'flex';
      imgContainer.style.alignItems = 'center';
      imgContainer.style.justifyContent = 'center';
      imgContainer.style.backgroundColor = '#ffffff';
      imgContainer.style.borderRadius = '8px';
      imgContainer.style.overflow = 'hidden';
      imgContainer.style.position = 'relative';

      const img = document.createElement('img');
      img.src = device.imageUrl;
      img.style.position = 'absolute';
      img.style.top = '50%';
      img.style.left = '50%';
      img.style.transform = 'translate(-50%, -50%)';
      img.style.maxWidth = '90%';
      img.style.maxHeight = '90%';
      img.style.width = 'auto';
      img.style.height = 'auto';
      img.style.objectFit = 'contain';
      img.onload = () => {
        // Adjust image size after load to maintain aspect ratio
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        if (aspectRatio > 1) {
          // Image is wider than tall
          img.style.width = '90%';
          img.style.height = 'auto';
        } else {
          // Image is taller than wide
          img.style.width = 'auto';
          img.style.height = '90%';
        }
      };
      imgContainer.appendChild(img);

      // Device info
      const info = document.createElement('div');
      info.style.flex = '1';
      info.style.display = 'flex';
      info.style.flexDirection = 'column';
      info.style.gap = '4px';
      info.style.minHeight = '0';
      info.style.padding = '4px 0';

      const year = document.createElement('div');
      year.style.fontFamily = 'Arial, sans-serif';
      year.style.fontSize = yearFontSize;
      year.style.color = '#666';
      year.textContent = device.startYear.toString();

      const name = document.createElement('div');
      name.style.fontFamily = 'Arial, sans-serif';
      name.style.fontSize = titleFontSize;
      name.style.fontWeight = 'bold';
      name.style.color = '#1a1a1a';
      name.style.whiteSpace = 'nowrap';
      name.style.overflow = 'hidden';
      name.style.textOverflow = 'ellipsis';
      name.style.lineHeight = '1.2';
      name.textContent = device.name;

      info.appendChild(year);
      info.appendChild(name);
      deviceCard.appendChild(imgContainer);
      deviceCard.appendChild(info);
      grid.appendChild(deviceCard);
    });

    // Add footer with adjusted spacing
    const footer = document.createElement('div');
    footer.style.textAlign = 'center';
    footer.style.marginTop = '15px';
    footer.style.paddingTop = '12px';
    footer.style.borderTop = '1px solid #eee';
    footer.innerHTML = `
      <p style="font-family: 'Arial', sans-serif; font-size: 16px; color: #666; margin: 0;">
        #TechJourney #Technology #ProfessionalDevelopment
      </p>
    `;
    container.appendChild(footer);

    // Generate image
    const canvas = await html2canvas(container, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher quality
      logging: false,
      useCORS: true,
      width: 1080,
      height: 1080
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
      format: [1080, 1080]
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
              
              ${device.wikiUrl ? `
                <div style="flex: 0 0 auto;">
                  <h2 style="font-family: 'Arial', sans-serif; font-size: 24px; color: #1a1a1a; margin: 0 0 15px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                    Learn More
                  </h2>
                  <p style="font-family: 'Arial', sans-serif; font-size: 18px; color: #666; margin: 0;">
                    <a href="${device.wikiUrl}" style="color: #2563eb; text-decoration: none;">
                      Read on Wikipedia
                    </a>
                  </p>
                </div>
              ` : ''}
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

      // Convert the container to canvas
      const canvas = await html2canvas(container, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // Enable CORS for images
        logging: false,
        backgroundColor: null,
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

      // Add the canvas to the PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 1080, 1080);

      // Remove the temporary container
      document.body.removeChild(container);

      // Add a new page if this isn't the last device
      if (i < sortedDevices.length - 1) {
        pdf.addPage();
      }
    }

    // Save the PDF
    pdf.save('tech-timeline.pdf');
    
    // Set progress to 100% when complete
    onProgress?.(100);
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw error;
  }
};