import React, { useState, useEffect } from 'react';
import { Device, WikipediaSearchResult, DeviceCategory } from './types/types';
import Timeline from './components/Timeline';
import DeviceSearch from './components/DeviceSearch';
import ExportModal from './components/ExportModal';
import { saveDevices, loadDevices } from './services/storageService';
import { Monitor } from 'lucide-react';

function App() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showExport, setShowExport] = useState(false);

  // Load devices from localStorage on component mount
  useEffect(() => {
    const savedDevices = loadDevices();
    setDevices(savedDevices);
  }, []);

  // Save devices to localStorage whenever they change
  useEffect(() => {
    if (devices.length > 0) {
      saveDevices(devices);
    }
  }, [devices]);

  const handleAddDevice = () => {
    setShowSearch(true);
  };

  const handleSelectDevice = (result: WikipediaSearchResult, category: DeviceCategory) => {
    const currentYear = new Date().getFullYear();
    const newDevice: Device = {
      id: crypto.randomUUID(), // Modern browsers have this built-in
      name: result.title,
      category,
      startYear: result.releaseYear || currentYear,
      endYear: null, // Still using
      imageUrl: result.imageUrl,
      description: result.description,
      notes: '',
      wikiUrl: result.wikiUrl
    };

    setDevices([...devices, newDevice]);
    setShowSearch(false);
  };

  const handleUpdateDevice = (updatedDevice: Device) => {
    setDevices(devices.map(device => 
      device.id === updatedDevice.id ? updatedDevice : device
    ));
  };

  const handleDeleteDevice = (id: string) => {
    setDevices(devices.filter(device => device.id !== id));
  };

  const handleExport = () => {
    setShowExport(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Monitor className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-semibold text-gray-900">TechTimeline</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Timeline 
          devices={devices}
          onAddDevice={handleAddDevice}
          onExport={handleExport}
          onUpdateDevice={handleUpdateDevice}
          onDeleteDevice={handleDeleteDevice}
        />
      </main>

      {showSearch && (
        <DeviceSearch 
          onSelectDevice={handleSelectDevice}
          onCancel={() => setShowSearch(false)}
        />
      )}

      {showExport && (
        <ExportModal 
          devices={devices}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
}

export default App;