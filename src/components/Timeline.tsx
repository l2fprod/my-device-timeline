import React, { useEffect, useState } from 'react';
import { Device, WikipediaSearchResult, DeviceCategory } from '../types/types';
import DeviceCard from './DeviceCard';
import { saveDevices, loadDevices } from '../services/storageService';
import { Plus, Share } from 'lucide-react';
import { v4 as uuidv4 } from '@types/uuid'; // Simulated UUID

interface TimelineProps {
  onAddDevice: () => void;
  onExport: () => void;
  devices: Device[];
  onUpdateDevice: (updatedDevice: Device) => void;
  onDeleteDevice: (id: string) => void;
}

const Timeline: React.FC<TimelineProps> = ({ 
  onAddDevice, 
  onExport, 
  devices, 
  onUpdateDevice, 
  onDeleteDevice 
}) => {
  const [timeline, setTimeline] = useState<Record<number, Device[]>>({});
  
  // Group devices by year for timeline display
  useEffect(() => {
    const groupedByYear: Record<number, Device[]> = {};
    
    // Sort devices by start year (most recent first)
    const sortedDevices = [...devices].sort((a, b) => b.startYear - a.startYear);
    
    sortedDevices.forEach(device => {
      if (!groupedByYear[device.startYear]) {
        groupedByYear[device.startYear] = [];
      }
      groupedByYear[device.startYear].push(device);
    });
    
    setTimeline(groupedByYear);
  }, [devices]);
  
  const years = Object.keys(timeline).map(Number).sort((a, b) => b - a);
  
  if (devices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="mb-8">
          <img 
            src="https://images.pexels.com/photos/3785927/pexels-photo-3785927.jpeg" 
            alt="Tech devices"
            className="w-full max-w-md h-auto rounded-lg shadow-lg mx-auto"
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Technology Timeline</h2>
        <p className="text-gray-600 mb-8 max-w-lg">
          Document your journey through technology by adding devices you've used throughout your life. 
          Search for devices on Wikipedia and create your personal tech timeline.
        </p>
        <button
          onClick={onAddDevice}
          className="flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors shadow-lg"
        >
          <Plus size={20} className="mr-2" />
          Add Your First Device
        </button>
      </div>
    );
  }
  
  return (
    <div className="py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Your Technology Timeline</h2>
        <div className="flex space-x-3">
          <button
            onClick={onAddDevice}
            className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} className="mr-1" />
            Add Device
          </button>
          <button
            onClick={onExport}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Share size={18} className="mr-1" />
            Export
          </button>
        </div>
      </div>
      
      <div className="space-y-10">
        {years.map(year => (
          <div key={year} className="relative">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg z-10">
                {year}
              </div>
              <div className="h-1 bg-blue-200 flex-grow ml-4"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-16">
              {timeline[year].map(device => (
                <DeviceCard 
                  key={device.id} 
                  device={device}
                  onUpdate={onUpdateDevice}
                  onDelete={onDeleteDevice}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;