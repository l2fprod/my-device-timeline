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