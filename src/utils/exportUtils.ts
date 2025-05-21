import { Device } from '../types/types';
import { formatTimeRange } from './dateUtils';
import html2canvas from 'html2canvas';

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
    container.style.backgroundColor = '#ffffff';
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