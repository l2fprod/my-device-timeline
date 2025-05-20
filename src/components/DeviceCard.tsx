import React, { useState } from 'react';
import { Device, DeviceCategory } from '../types/types';
import { formatTimeRange } from '../utils/dateUtils';
import { getYearOptions } from '../utils/dateUtils';
import { getDeviceImageFallback } from '../services/wikipediaService';
import { getCategoryColor } from '../utils/categoryUtils';
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md">
      {isEditing ? (
        <div className="p-3">
          <div className="flex justify-between mb-3">
            <h3 className="text-base font-medium">Edit Device</h3>
            <div className="flex space-x-1">
              <button 
                onClick={handleSave} 
                className="p-1 text-green-600 hover:text-green-800"
                title="Save"
              >
                <Check size={16} />
              </button>
              <button 
                onClick={handleCancel} 
                className="p-1 text-red-600 hover:text-red-800"
                title="Cancel"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          
          <div className="grid gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={editedDevice.name}
                onChange={handleInputChange}
                className="w-full p-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={editedDevice.category}
                onChange={handleInputChange}
                className="w-full p-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                {deviceCategories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Start Year</label>
                <select
                  name="startYear"
                  value={editedDevice.startYear}
                  onChange={(e) => setEditedDevice({
                    ...editedDevice,
                    startYear: parseInt(e.target.value, 10)
                  })}
                  className="w-full p-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  {yearOptions.map(year => (
                    <option key={`start-${year}`} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">End Year</label>
                <select
                  name="endYear"
                  value={editedDevice.endYear === null ? 'present' : editedDevice.endYear}
                  onChange={handleYearChange}
                  className="w-full p-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="present">Present</option>
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
              <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                name="notes"
                value={editedDevice.notes}
                onChange={handleInputChange}
                className="w-full p-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 min-h-[60px]"
                placeholder="Your experience with this device..."
              ></textarea>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex">
          <div className="relative w-24 h-24 bg-gray-100 flex-shrink-0">
            <img 
              src={device.imageUrl || getDeviceImageFallback(device.category)} 
              alt={device.name}
              className="absolute inset-0 w-full h-full object-contain p-2"
              onError={(e) => {
                (e.target as HTMLImageElement).src = getDeviceImageFallback(device.category);
              }}
            />
          </div>
          
          <div className="flex-1 p-3 min-w-0">
            <div className="flex justify-between items-start mb-1">
              <div className="min-w-0">
                <h3 className="font-medium text-gray-900 text-sm truncate">{device.name}</h3>
                <span className="text-xs text-gray-600">{formatTimeRange(device.startYear, device.endYear)}</span>
              </div>
              <div className="flex space-x-1 ml-2">
                <button 
                  onClick={handleEdit} 
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button 
                  onClick={() => onDelete(device.id)} 
                  className="p-1 text-gray-400 hover:text-red-600"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-block px-1.5 py-0.5 text-xs font-medium rounded-full ${getCategoryColor(device.category)}`}>
                {deviceCategories.find(c => c.value === device.category)?.label}
              </span>
              {device.wikiUrl && (
                <a 
                  href={device.wikiUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink size={12} className="mr-0.5" />
                  Wiki
                </a>
              )}
            </div>
            
            {device.notes && (
              <p className="text-xs text-gray-700 line-clamp-2">{device.notes}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceCard;