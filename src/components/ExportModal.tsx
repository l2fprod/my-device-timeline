import React, { useState } from 'react';
import { Device } from '../types/types';
import { formatForLinkedIn, copyToClipboard } from '../utils/exportUtils';
import { X, Copy, CheckCircle, FileText } from 'lucide-react';

interface ExportModalProps {
  devices: Device[];
  onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ devices, onClose }) => {
  const [copied, setCopied] = useState(false);
  const exportText = formatForLinkedIn(devices);
  
  const handleCopy = async () => {
    const success = await copyToClipboard(exportText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
      </div>
    </div>
  );
};

export default ExportModal;