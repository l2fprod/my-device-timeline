import { Device } from '../types/types';
import { formatTimeRange } from './dateUtils';

export const formatForLinkedIn = (devices: Device[]): string => {
  // Sort devices by start year (most recent first)
  const sortedDevices = [...devices].sort((a, b) => b.startYear - a.startYear);
  
  let output = '📱 My Technology Journey 💻\n\n';
  
  sortedDevices.forEach(device => {
    const timeRange = formatTimeRange(device.startYear, device.endYear);
    output += `🔹 ${device.name} (${timeRange})\n`;
    if (device.notes) {
      output += `   ${device.notes}\n`;
    }
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