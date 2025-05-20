import React, { useState } from 'react';
import { Device, DeviceCategory } from '../types/types';
import { formatTimeRange } from '../utils/dateUtils';
import { getYearOptions } from '../utils/dateUtils';
import { getDeviceImageFallback } from '../services/wikipediaService';
import { getCategoryColor } from '../utils/categoryUtils';
import { Edit2, Trash2, Save, X, ExternalLink } from 'lucide-react';

interface DeviceCardProps {
  device: Device;
  onUpdate: (device: Device) => void;
  onDelete: (id: string) => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDevice, setEditedDevice] = useState(device);
  const [imageFit, setImageFit] = useState<'cover' | 'contain'>('cover');
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

  const handleSave = () => {
    onUpdate(editedDevice);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedDevice(device);
    setIsEditing(false);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalHeight > img.naturalWidth) {
      setImageFit('contain');
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = getDeviceImageFallback(device.category);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
        <div className="space-y-2">
          <input
            type="text"
            value={editedDevice.name}
            onChange={(e) => setEditedDevice({ ...editedDevice, name: e.target.value })}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Device name"
          />
          <select
            value={editedDevice.category}
            onChange={(e) => setEditedDevice({ ...editedDevice, category: e.target.value as DeviceCategory })}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            {deviceCategories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={editedDevice.startYear}
              onChange={(e) => setEditedDevice({ ...editedDevice, startYear: parseInt(e.target.value) })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Start year"
            />
            <input
              type="number"
              value={editedDevice.endYear || ''}
              onChange={(e) => setEditedDevice({ ...editedDevice, endYear: e.target.value ? parseInt(e.target.value) : null })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="End year (optional)"
            />
          </div>
          <textarea
            value={editedDevice.notes}
            onChange={(e) => setEditedDevice({ ...editedDevice, notes: e.target.value })}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add notes..."
            rows={2}
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancel}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <X size={14} />
            </button>
            <button
              onClick={handleSave}
              className="p-1 text-blue-600 hover:text-blue-700"
            >
              <Save size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-20 h-20 flex-shrink-0 bg-gray-100">
          <img
            src={device.imageUrl}
            alt={device.name}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={`w-full h-full object-${imageFit} p-1`}
          />
        </div>
        <div className="flex-1 p-2 min-w-0">
          <div className="flex items-start justify-between mb-1">
            {device.wikiUrl ? (
              <a
                href={device.wikiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm sm:text-sm text-base font-medium text-blue-600 hover:text-blue-700 sm:truncate flex items-center break-words sm:break-normal"
              >
                {device.name}
              </a>
            ) : (
              <h3 className="text-sm sm:text-sm text-base font-medium text-gray-900 sm:truncate break-words sm:break-normal">{device.name}</h3>
            )}
            <div className="flex space-x-1 ml-2 flex-shrink-0">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <Edit2 size={12} />
              </button>
              <button
                onClick={() => onDelete(device.id)}
                className="p-1 text-gray-400 hover:text-red-600"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-2 mb-1">
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getCategoryColor(device.category)}`}>
              {deviceCategories.find(c => c.value === device.category)?.label}
            </span>
          </div>
          {device.notes && (
            <p className="text-xs text-gray-600 line-clamp-1 sm:line-clamp-2 md:line-clamp-3 hidden sm:block">{device.notes}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceCard;