import React from 'react';
import { X } from 'lucide-react';

interface ExportProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: number;
  title: string;
  subtitle: string;
}

const ExportProgressModal: React.FC<ExportProgressModalProps> = ({
  isOpen,
  onClose,
  progress,
  title,
  subtitle
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-600">{subtitle}</p>
          
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
              <div 
                style={{ width: `${progress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 ease-out"
              />
            </div>
            <div className="text-right mt-1">
              <span className="text-sm font-medium text-gray-600">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportProgressModal; 