import React, { useEffect, useState } from 'react';
import { Device } from '../types/types';
import DeviceCard from './DeviceCard';
import DeviceEditModal from './DeviceEditModal';

interface TimelineProps {
  devices: Device[];
  onUpdateDevice: (device: Device) => void;
  onDeleteDevice: (deviceId: string) => void;
  onEditDevice: (device: Device) => void;
}

const Timeline: React.FC<TimelineProps> = ({ 
  devices, 
  onUpdateDevice, 
  onDeleteDevice, 
  onEditDevice 
}) => {
  const [timeline, setTimeline] = useState<Record<number, Device[]>>({});
  const [globalIndex, setGlobalIndex] = useState(0);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  
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
  
  const handleEditDevice = (device: Device) => {
    setEditingDevice(device);
  };

  const handleSaveDevice = (device: Device) => {
    onUpdateDevice(device);
    setEditingDevice(null);
  };

  const handleCancelEdit = () => {
    setEditingDevice(null);
  };
  
  if (devices.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No devices yet</h3>
        <p className="mt-2 text-sm text-gray-500">Add your first device to start building your timeline.</p>
      </div>
    );
  }
  
  // Device count display
  const deviceCountDisplay = (
    <div className="flex items-center justify-center mb-12 select-none">
      <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent drop-shadow">
        {devices.length} Device{devices.length !== 1 ? 's' : ''} in your Timeline
      </span>
    </div>
  );
  
  return (
    <div className="relative">
      <div className="py-8 px-4">
        {deviceCountDisplay}
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
                            onEdit={onEditDevice}
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
      {editingDevice && (
        <DeviceEditModal
          device={editingDevice}
          onSave={handleSaveDevice}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
};

export default Timeline;