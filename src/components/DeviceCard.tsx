import React, { useState } from 'react';
import { Device, DeviceCategory } from '../types/types';
import { formatTimeRange } from '../utils/dateUtils';
import { getYearOptions } from '../utils/dateUtils';
import { getDeviceImageFallback } from '../services/wikipediaService';
import { Pencil, Trash2, Check, X, ExternalLink } from 'lucide-react';

interface DeviceCardProps {
  device: Device;
  onUpdate: (updatedDevice: Device) => void;
  onDelete: (id: string) => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDevice, setEditedDevice] = useState<Device>({ ...device });
  const yearOptions = getYearOptions();
  
  const deviceCategories: { value: DeviceCategory; label: string }[] = [
    { value: 'smartphone', label: 'Smartphone' },
    { value: 'laptop', label: 'Laptop' },
    { value: 'desktop', label: 'Desktop' },
    { value: 'tablet', label: 'Tablet' },
    { value: 'smartwatch', label: 'Smartwatch' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'audio', label: 'Audio' },
    { value: 'camera', label: 'Camera' },
    { value: 'other', label: 'Other' }
  ];

  const getCategoryColor = (category: DeviceCategory): string => {
    const colors: Record<DeviceCategory, string> = {
      smartphone: 'bg-blue-100 text-blue-800',
      laptop: 'bg-purple-100 text-purple-800',
      desktop: 'bg-indigo-100 text-indigo-800',
      tablet: 'bg-green-100 text-green-800',
      smartwatch: 'bg-yellow-100 text-yellow-800',
      gaming: 'bg-red-100 text-red-800',
      audio: 'bg-pink-100 text-pink-800',
      camera: 'bg-cyan-100 text-cyan-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category];
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedDevice({ ...device });
    setIsEditing(false);
  };

  const handleSave = () => {
    onUpdate(editedDevice);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedDevice({ ...editedDevice, [name]: value });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedDevice({ 
      ...editedDevice, 
      [name]: value === 'present' ? null : parseInt(value, 10) 
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md">
      {isEditing ? (
        <div className="p-4">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-medium">Edit Device</h3>
            <div className="flex space-x-2">
              <button 
                onClick={handleSave} 
                className="p-1 text-green-600 hover:text-green-800"
                title="Save"
              >
                <Check size={20} />
              </button>
              <button 
                onClick={handleCancel} 
                className="p-1 text-red-600 hover:text-red-800"
                title="Cancel"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="grid gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={editedDevice.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={editedDevice.category}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {deviceCategories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Year</label>
                <select
                  name="startYear"
                  value={editedDevice.startYear}
                  onChange={(e) => setEditedDevice({
                    ...editedDevice,
                    startYear: parseInt(e.target.value, 10)
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {yearOptions.map(year => (
                    <option key={`start-${year}`} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Year</label>
                <select
                  name="endYear"
                  value={editedDevice.endYear === null ? 'present' : editedDevice.endYear}
                  onChange={handleYearChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="present">Present (still using)</option>
                  {yearOptions.map(year => (
                    <option 
                      key={`end-${year}`} 
                      value={year}
                      disabled={year < editedDevice.startYear}
                    >
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                name="notes"
                value={editedDevice.notes}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
                placeholder="Your experience with this device..."
              ></textarea>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="relative h-48 bg-gray-100">
            <img 
              src={device.imageUrl || getDeviceImageFallback(device.category)} 
              alt={device.name}
              className="absolute inset-0 w-full h-full object-contain p-2"
              onError={(e) => {
                (e.target as HTMLImageElement).src = getDeviceImageFallback(device.category);
              }}
            />
          </div>
          
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{device.name}</h3>
                <span className="text-sm text-gray-600">{formatTimeRange(device.startYear, device.endYear)}</span>
              </div>
              <div className="flex space-x-1">
                <button 
                  onClick={handleEdit} 
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button 
                  onClick={() => onDelete(device.id)} 
                  className="p-1 text-gray-400 hover:text-red-600"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="mb-3">
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(device.category)}`}>
                {deviceCategories.find(c => c.value === device.category)?.label}
              </span>
            </div>
            
            {device.notes && (
              <p className="text-sm text-gray-700 mb-3">{device.notes}</p>
            )}
            
            {device.wikiUrl && (
              <a 
                href={device.wikiUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800"
              >
                <ExternalLink size={12} className="mr-1" />
                Wikipedia
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DeviceCard;