import { useState, useEffect, useRef } from 'react';
import { Device, WikipediaSearchResult, DeviceCategory } from './types/types';
import Timeline from './components/Timeline';
import DeviceSearch from './components/DeviceSearch';
import Footer from './components/Footer';
import { saveDevices, loadDevices } from './services/storageService';
import { getSampleDevices } from './utils/sampleDevices';
import { Plus, Sparkles, Linkedin, Image, FileText, Trash2, Menu, X, Upload, Download } from 'lucide-react';
import { formatForLinkedIn, copyToClipboard, exportAsLinkedInImage, exportAsPDF } from './utils/exportUtils';
import ExportProgressModal from './components/ExportProgressModal';
import DeviceEditModal from './components/DeviceEditModal';
import { generateUUID } from './utils/uuid';

function App() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [exportTitle, setExportTitle] = useState('');
  const [exportSubtitle, setExportSubtitle] = useState('');

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

  // Add keyboard event handler for Escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showSearch) {
        setShowSearch(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showSearch]);

  const handleAddDevice = () => {
    setShowSearch(true);
  };

  const handleSelectDevice = (result: WikipediaSearchResult, category: DeviceCategory) => {
    const currentYear = new Date().getFullYear();
    const newDevice: Device = {
      id: generateUUID(), // Using our custom UUID generator instead of crypto.randomUUID()
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
    setEditingDevice(null);
  };

  const handleEditDevice = (device: Device) => {
    setEditingDevice(device);
  };

  const handleCancelEdit = () => {
    setEditingDevice(null);
  };

  const handleDeleteDevice = (id: string) => {
    setDevices(devices.filter(device => device.id !== id));
  };

  const handleLoadSampleDevices = () => {
    const sampleDevices = getSampleDevices();
    if (window.confirm(`This will add ${sampleDevices.length} sample devices to your timeline. Continue?`)) {
      setDevices([...devices, ...sampleDevices]);
    }
  };

  const handleCopyForLinkedIn = async () => {
    const text = formatForLinkedIn(devices);
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadImage = async () => {
    await exportAsLinkedInImage(devices, 'mytimeline.png');
  };

  const handleDownloadPDF = async () => {
    try {
      setIsExporting(true);
      setExportTitle('Exporting PDF');
      setExportSubtitle('Generating your timeline PDF...');
      setExportProgress(0);
      
      await exportAsPDF(devices, (progress) => {
        setExportProgress(progress);
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearTimeline = () => {
    if (window.confirm('Are you sure you want to clear your entire timeline? This action cannot be undone.')) {
      setDevices([]);
      localStorage.removeItem('device-timeline-data');
    }
  };

  const handleExportJSON = () => {
    const jsonString = JSON.stringify(devices, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mytimeline.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedDevices = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedDevices)) {
          // Validate each device has required fields
          const isValid = importedDevices.every(device => 
            device.id && 
            device.name && 
            device.category && 
            device.startYear && 
            device.imageUrl && 
            device.description
          );
          
          if (isValid) {
            if (window.confirm('Import these devices? This will add them to your existing timeline.')) {
              // Generate new IDs for imported devices to avoid conflicts
              const devicesWithNewIds = importedDevices.map(device => ({
                ...device,
                id: generateUUID()
              }));
              setDevices([...devices, ...devicesWithNewIds]);
            }
          } else {
            alert('Invalid device data in the JSON file. Please check the format.');
          }
        } else {
          alert('Invalid JSON format. The file should contain an array of devices.');
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
        alert('Error reading the JSON file. Please check the format.');
      }
    };
    reader.readAsText(file);
    // Reset the input value so the same file can be imported again
    event.target.value = '';
  };

  if (devices.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <img src="favicon.svg" alt="My Timeline" className="h-10 w-10 transform hover:scale-110 transition-transform duration-200" />
                <h1 className="text-ml font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  My Timeline
                </h1>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowSearch(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Plus size={16} className="mr-2" />
                  Add Device
                </button>
                <label
                  className="inline-flex items-center p-2 border border-gray-200 shadow-sm text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                  title="Import Timeline from JSON"
                >
                  <Upload size={16} className="text-blue-500" />
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJSON}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={handleLoadSampleDevices}
                  className="inline-flex items-center p-2 border border-gray-200 shadow-sm text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  title="Load Sample Timeline"
                >
                  <Sparkles size={16} className="text-indigo-500" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow flex items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
          <div className="text-center w-full">
            <div className="relative w-64 h-64 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full opacity-50 animate-pulse"></div>
              <div className="absolute inset-4 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute inset-8 bg-gradient-to-br from-indigo-300 to-purple-300 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <img 
                  src="favicon.svg" 
                  alt="My Timeline" 
                  className="w-32 h-32 text-indigo-500 animate-spin-slow"
                />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Start Building Your Timeline
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Track your journey through technology by adding the devices that have shaped your digital life. From your first computer to your latest smartphone, create a visual history of your tech evolution.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setShowSearch(true)}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus size={20} className="mr-2" />
                Add Your First Device
              </button>
              <button
                onClick={handleLoadSampleDevices}
                className="inline-flex items-center px-6 py-3 border border-gray-200 text-base font-medium rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Sparkles size={20} className="mr-2 text-indigo-500" />
                Try Sample Timeline
              </button>
            </div>
          </div>
        </main>

        <Footer />

        {showSearch && (
          <DeviceSearch 
            onSelectDevice={handleSelectDevice}
            onCancel={() => setShowSearch(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src="favicon.svg" alt="My Timeline" className="h-10 w-10 transform hover:scale-110 transition-transform duration-200" />
              <h1 className="text-ml font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                My Timeline
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              {/* Always visible Add Device button */}
              <button
                onClick={handleAddDevice}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus size={16} className="mr-2" />
                Add Device
              </button>

              {/* Menu button for mobile */}
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="lg:hidden inline-flex items-center p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {showMenu ? <X size={20} /> : <Menu size={20} />}
              </button>

              {/* Desktop toolbar */}
              <div className="hidden lg:flex items-center space-x-3">
                <button
                  onClick={handleCopyForLinkedIn}
                  className="inline-flex items-center px-4 py-2 border border-gray-200 shadow-sm text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Linkedin size={16} className="mr-2 text-blue-600" />
                  {copied ? 'Copied!' : 'Copy as Text'}
                </button>
                <button
                  onClick={handleDownloadImage}
                  className="inline-flex items-center px-4 py-2 border border-gray-200 shadow-sm text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Image size={16} className="mr-2 text-purple-500" />
                  PNG
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="inline-flex items-center px-4 py-2 border border-gray-200 shadow-sm text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FileText size={16} className="mr-2 text-red-500" />
                  PDF
                </button>
                <div className="h-6 w-px bg-gray-200 mx-2" />
                <button
                  onClick={handleExportJSON}
                  className="inline-flex items-center p-2 border border-gray-200 shadow-sm text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  title="Export Timeline as JSON"
                >
                  <Download size={16} className="text-green-500" />
                </button>
                <label
                  className="inline-flex items-center p-2 border border-gray-200 shadow-sm text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                  title="Import Timeline from JSON"
                >
                  <Upload size={16} className="text-blue-500" />
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJSON}
                    className="hidden"
                  />
                </label>
                {devices.length > 0 && (
                  <button
                    onClick={handleClearTimeline}
                    className="inline-flex items-center p-2 border border-red-200 shadow-sm text-sm font-medium rounded-full text-red-600 bg-white hover:bg-red-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    title="Clear Timeline"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <button
                  onClick={handleLoadSampleDevices}
                  className="inline-flex items-center p-2 border border-gray-200 shadow-sm text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  title="Load Sample Timeline"
                >
                  <Sparkles size={16} className="text-indigo-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {showMenu && (
            <div className="lg:hidden py-4 space-y-2">
              <button
                onClick={handleCopyForLinkedIn}
                className="w-full inline-flex items-center px-4 py-2 border border-gray-200 shadow-sm text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Linkedin size={16} className="mr-2 text-blue-600" />
                {copied ? 'Copied!' : 'Copy as Text'}
              </button>
              <button
                onClick={handleDownloadImage}
                className="w-full inline-flex items-center px-4 py-2 border border-gray-200 shadow-sm text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Image size={16} className="mr-2 text-purple-500" />
                PNG
              </button>
              <button
                onClick={handleDownloadPDF}
                className="w-full inline-flex items-center px-4 py-2 border border-gray-200 shadow-sm text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FileText size={16} className="mr-2 text-red-500" />
                PDF
              </button>
              <button
                onClick={handleExportJSON}
                className="w-full inline-flex items-center px-4 py-2 border border-gray-200 shadow-sm text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                title="Export Timeline as JSON"
              >
                <Download size={16} className="mr-2 text-green-500" />
                Export JSON
              </button>
              <label
                className="w-full inline-flex items-center px-4 py-2 border border-gray-200 shadow-sm text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                title="Import Timeline from JSON"
              >
                <Upload size={16} className="mr-2 text-blue-500" />
                Import JSON
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>
              {devices.length > 0 && (
                <button
                  onClick={handleClearTimeline}
                  className="w-full inline-flex items-center px-4 py-2 border border-red-200 shadow-sm text-sm font-medium rounded-full text-red-600 bg-white hover:bg-red-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash2 size={16} className="mr-2" />
                  Clear
                </button>
              )}
              <button
                onClick={handleLoadSampleDevices}
                className="w-full inline-flex items-center px-4 py-2 border border-gray-200 shadow-sm text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Sparkles size={16} className="mr-2 text-indigo-500" />
                Sample
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div ref={timelineRef} className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 transform hover:scale-[1.01] transition-transform duration-300">
          <Timeline 
            devices={devices}
            onAddDevice={handleAddDevice}
            onUpdateDevice={handleUpdateDevice}
            onDeleteDevice={handleDeleteDevice}
            onEditDevice={handleEditDevice}
          />
        </div>
      </main>

      {showSearch && (
        <DeviceSearch 
          onSelectDevice={handleSelectDevice}
          onCancel={() => setShowSearch(false)}
        />
      )}

      {editingDevice && (
        <DeviceEditModal
          device={editingDevice}
          onSave={handleUpdateDevice}
          onCancel={handleCancelEdit}
        />
      )}

      <ExportProgressModal
        isOpen={isExporting}
        onClose={() => setIsExporting(false)}
        progress={exportProgress}
        title={exportTitle}
        subtitle={exportSubtitle}
      />

      <Footer />
    </div>
  );
}

export default App;