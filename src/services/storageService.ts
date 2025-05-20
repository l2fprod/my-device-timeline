import { Device } from '../types/types';

const STORAGE_KEY = 'device-timeline-data';

export const saveDevices = (devices: Device[]): void => {
  try {
    console.log('Saving devices:', devices);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(devices));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const loadDevices = (): Device[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const parsedData = data ? JSON.parse(data) : [];
    console.log('Loaded devices:', parsedData);
    return parsedData;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return [];
  }
};

export const clearDevices = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};