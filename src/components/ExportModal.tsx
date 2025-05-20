import React, { useState, useRef } from 'react';
import { Device } from '../types/types';
import { formatForLinkedIn, copyToClipboard, exportAsImage } from '../utils/exportUtils';
import { formatTimeRange } from '../utils/dateUtils';
import { getDeviceImageFallback } from '../services/wikipediaService';
import { getCategoryColor } from '../utils/categoryUtils';
import { X, Copy, CheckCircle, Image, FileText } from 'lucide-react';

interface ExportModalProps {
  devices: Device[];
  onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ devices, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [exportType, setExportType] = useState<'text' | 'image'>('text');
  const exportText = formatForLinkedIn(devices);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  const handleCopy = async () => {
    const success = await copyToClipboard(exportText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportImage = async () => {
    if (timelineRef.current) {
      await exportAsImage(timelineRef.current, 'tech-timeline.png');
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Export Timeline</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setExportType('text')}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              exportType === 'text' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FileText size={18} className="mr-2" />
            Text Format
          </button>
          <button
            onClick={() => setExportType('image')}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              exportType === 'image' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Image size={18} className="mr-2" />
            Image Format
          </button>
        </div>
        
        {exportType === 'text' ? (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Copy the text below and paste it into your LinkedIn post. You can edit it before posting.
              </p>
              
              <div className="relative">
                <pre className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-sm text-gray-800 border border-gray-200 max-h-[300px] overflow-y-auto">
                  {exportText}
                </pre>
                
                <button
                  onClick={handleCopy}
                  className="absolute top-2 right-2 p-2 bg-white rounded-md border border-gray-200 shadow-sm hover:bg-gray-50"
                  title="Copy to clipboard"
                >
                  {copied ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-2">Preview</h3>
              <div className="bg-white rounded-lg border border-gray-200 p-4 max-h-[200px] overflow-y-auto">
                {exportText.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line.trim() === '' ? <br /> : <p>{line}</p>}
                  </React.Fragment>
                ))}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                {copied ? 
                  <>
                    <CheckCircle size={16} className="mr-2" />
                    Copied!
                  </> : 
                  <>
                    <Copy size={16} className="mr-2" />
                    Copy to Clipboard
                  </>
                }
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Export your timeline as an image to share on social media or save for your records.
            </p>
            <div ref={timelineRef} className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">My Technology Timeline</h2>
              {Object.entries(devices.reduce((acc, device) => {
                const year = device.startYear;
                if (!acc[year]) acc[year] = [];
                acc[year].push(device);
                return acc;
              }, {} as Record<number, Device[]>))
                .sort(([a], [b]) => Number(b) - Number(a))
                .map(([year, yearDevices]) => (
                  <div key={year} className="mb-8">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                        {year}
                      </div>
                      <div className="h-1 bg-blue-200 flex-grow ml-4"></div>
                    </div>
                    <div className="ml-16 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {yearDevices.map(device => (
                        <div key={device.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                          <div className="relative h-32 bg-gray-100">
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
                                <h3 className="font-semibold text-gray-900">{device.name}</h3>
                                <span className="text-sm text-gray-600">{formatTimeRange(device.startYear, device.endYear)}</span>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(device.category)}`}>
                                {device.category.charAt(0).toUpperCase() + device.category.slice(1)}
                              </span>
                            </div>
                            {device.notes && (
                              <p className="text-sm text-gray-700 mt-2">{device.notes}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleExportImage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Image size={16} className="mr-2" />
                Download Image
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportModal;