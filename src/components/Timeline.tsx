import React, { useEffect, useState } from 'react';
import { Device } from '../types/types';
import DeviceCard from './DeviceCard';
import { saveDevices, loadDevices } from '../services/storageService';
import { Plus, Share } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

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
  const [globalIndex, setGlobalIndex] = useState(0);
  
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
      
      <div className="relative max-w-6xl mx-auto">
        {/* Vertical timeline line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-blue-200"></div>
        
        <div className="space-y-8">
          {years.map(year => (
            <div key={year} className="relative">
              {/* Year label */}
              <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 py-1 rounded-full border border-blue-200 shadow-sm z-10">
                <h3 className="text-lg font-bold text-gray-900">{year}</h3>
              </div>
              
              {/* Devices for this year */}
              <div className="mt-8 grid grid-cols-2 gap-x-16">
                {timeline[year].map((device, localIndex) => {
                  // Calculate global index for consistent alternation
                  const globalIndex = years
                    .slice(0, years.indexOf(year))
                    .reduce((acc, y) => acc + timeline[y].length, 0) + localIndex;
                  const isLeft = globalIndex % 2 === 0;
                  
                  // Calculate if this is a consecutive device on the same side
                  const prevDeviceIndex = localIndex - 2;
                  const isConsecutiveOnSameSide = prevDeviceIndex >= 0 && 
                    (globalIndex % 2 === (globalIndex - 2) % 2);
                  
                  return (
                    <div
                      key={device.id}
                      className={`relative ${isLeft ? 'col-start-1' : 'col-start-2'} ${isConsecutiveOnSameSide ? 'mt-6' : 'mt-4'}`}
                    >
                      {/* Connector line */}
                      <div 
                        className={`absolute top-1/2 ${isLeft ? 'right-0' : 'left-0'} w-8 h-0.5 bg-blue-200`}
                        style={{ [isLeft ? 'right' : 'left']: '-2rem' }}
                      />
                      
                      {/* Device card */}
                      <div className={`${isLeft ? 'mr-8' : 'ml-8'}`}>
                        <DeviceCard 
                          device={device}
                          onUpdate={onUpdateDevice}
                          onDelete={onDeleteDevice}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;