import { useState, useEffect, useRef } from 'react';
import { Device, WikipediaSearchResult, DeviceCategory } from './types/types';
import Timeline from './components/Timeline';
import DeviceSearch from './components/DeviceSearch';
import { saveDevices, loadDevices } from './services/storageService';
import { getSampleDevices } from './utils/sampleDevices';
import { Plus, History, Linkedin, Image, FileText } from 'lucide-react';
import { formatForLinkedIn, copyToClipboard, exportAsLinkedInImage, exportAsPDF } from './utils/exportUtils';
import ExportProgressModal from './components/ExportProgressModal';

function App() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [copied, setCopied] = useState(false);
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

  const handleLoadSampleDevices = () => {
    if (window.confirm('This will add 20 sample devices to your timeline. Continue?')) {
      const sampleDevices = getSampleDevices();
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
    await exportAsLinkedInImage(devices, 'tech-timeline.png');
  };

  const handleDownloadPDF = async () => {
    try {
      setIsExporting(true);
      setExportTitle('Exporting PDF');
      setExportSubtitle('Generating your device timeline PDF...');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src="favicon.svg" alt="My Electronic Timeline" className="h-10 w-10 transform hover:scale-110 transition-transform duration-200" />
              <h1 className="text-ml font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                My Electronic Timeline
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleLoadSampleDevices}
                className="inline-flex items-center px-4 py-2 border border-gray-200 shadow-sm text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <History size={16} className="mr-2 text-indigo-500" />
                Load Sample Devices
              </button>
              <button
                onClick={handleAddDevice}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus size={16} className="mr-2" />
                Add Device
              </button>
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
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div ref={timelineRef} className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 transform hover:scale-[1.01] transition-transform duration-300">
          <Timeline 
            devices={devices}
            onAddDevice={handleAddDevice}
            onUpdateDevice={handleUpdateDevice}
            onDeleteDevice={handleDeleteDevice}
          />
        </div>
      </main>

      {showSearch && (
        <DeviceSearch 
          onSelectDevice={handleSelectDevice}
          onCancel={() => setShowSearch(false)}
        />
      )}

      <ExportProgressModal
        isOpen={isExporting}
        onClose={() => setIsExporting(false)}
        progress={exportProgress}
        title={exportTitle}
        subtitle={exportSubtitle}
      />

      <footer className="bg-white/80 backdrop-blur-md shadow-lg border-t border-gray-100 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-16">
            <p className="text-sm text-gray-600">
              built by fred with his AI minions
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;