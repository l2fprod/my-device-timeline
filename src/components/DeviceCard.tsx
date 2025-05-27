import React from 'react';
import { Device, DeviceCategory } from '../types/types';
import { Edit2, Trash2 } from 'lucide-react';
import { getDeviceImageFallback } from '../services/wikipediaService';
import { getCategoryColor } from '../utils/categoryUtils';
import { deviceCategories } from '../constants/deviceCategories';

interface DeviceCardProps {
  device: Device;
  onUpdate: (device: Device) => void;
  onDelete: (id: string) => void;
  onEdit: (device: Device) => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onDelete, onEdit }) => {
  const [imageError, setImageError] = React.useState(false);
  const [imageFit, setImageFit] = React.useState<'cover' | 'contain'>('cover');

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = getDeviceImageFallback(device.category);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalHeight > img.naturalWidth) {
      setImageFit('contain');
    }
  };

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
            {/* Desktop actions */}
            <div className="hidden sm:flex space-x-1 ml-2 flex-shrink-0">
              <button
                onClick={() => onEdit(device)}
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
          {/* Mobile actions */}
          <div className="sm:hidden flex space-x-2 mb-2">
            <button
              onClick={() => onEdit(device)}
              className="inline-flex items-center justify-center p-1.5 text-gray-400 hover:text-gray-600"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={() => onDelete(device.id)}
              className="inline-flex items-center justify-center p-1.5 text-gray-400 hover:text-red-600"
            >
              <Trash2 size={14} />
            </button>
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