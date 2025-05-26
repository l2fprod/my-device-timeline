import React, { useState, useEffect } from 'react';
import { Device, DeviceCategory } from '../types/types';
import { X } from 'lucide-react';

interface DeviceEditModalProps {
  device: Device;
  onSave: (device: Device) => void;
  onCancel: () => void;
}

const DeviceEditModal: React.FC<DeviceEditModalProps> = ({ device, onSave, onCancel }) => {
  const [editedDevice, setEditedDevice] = useState(device);
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onCancel]);

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
    onSave(editedDevice);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">Edit Device</h3>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-3 sm:space-y-0">
              <input
                type="text"
                value={editedDevice.name}
                onChange={(e) => setEditedDevice({ ...editedDevice, name: e.target.value })}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Device name"
              />
              <select
                value={editedDevice.category}
                onChange={(e) => setEditedDevice({ ...editedDevice, category: e.target.value as DeviceCategory })}
                className="w-full sm:w-48 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {deviceCategories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="number"
                value={editedDevice.startYear}
                onChange={(e) => setEditedDevice({ ...editedDevice, startYear: parseInt(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Start year"
              />
              <input
                type="number"
                value={editedDevice.endYear || ''}
                onChange={(e) => setEditedDevice({ ...editedDevice, endYear: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="End year (optional)"
              />
            </div>
            <textarea
              value={editedDevice.notes}
              onChange={(e) => setEditedDevice({ ...editedDevice, notes: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add notes..."
              rows={3}
            />
            <input
              type="text"
              value={editedDevice.imageUrl}
              onChange={(e) => setEditedDevice({ ...editedDevice, imageUrl: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Image URL"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 p-4 border-t">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceEditModal; 