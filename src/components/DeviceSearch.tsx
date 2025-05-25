import React, { useState, useEffect } from 'react';
import { searchWikipedia } from '../services/wikipediaService';
import { WikipediaSearchResult, DeviceCategory } from '../types/types';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface DeviceSearchProps {
  onSelectDevice: (device: WikipediaSearchResult, category: DeviceCategory) => void;
  onCancel: () => void;
}

const getCategoryColor = (category: DeviceCategory): string => {
  const colors: Record<DeviceCategory, string> = {
    smartphone: 'bg-blue-100 text-blue-800',
    laptop: 'bg-purple-100 text-purple-800',
    desktop: 'bg-indigo-100 text-indigo-800',
    tablet: 'bg-green-100 text-green-800',
    smartwatch: 'bg-yellow-100 text-yellow-800',
    gaming: 'bg-red-100 text-red-800',
    audio: 'bg-pink-100 text-pink-800',
    camera: 'bg-cyan-100 text-cyan-800',
    other: 'bg-gray-100 text-gray-800'
  };
  return colors[category];
};

const DeviceSearch: React.FC<DeviceSearchProps> = ({ onSelectDevice, onCancel }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<WikipediaSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<DeviceCategory>('smartphone');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState<Record<string, number>>({});

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

  // Debounce the search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  // Perform search when debounced query changes
  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.length < 3) {
        setResults([]);
        return;
      }

      setLoading(true);
      const searchResults = await searchWikipedia(debouncedQuery);
      setResults(searchResults);
      setLoading(false);
    };

    fetchResults();
  }, [debouncedQuery]);

  const handleSelectDevice = (device: WikipediaSearchResult) => {
    const selectedIndex = selectedImageIndex[device.title] || 0;
    const updatedDevice = {
      ...device,
      imageUrl: device.additionalImages[selectedIndex] || device.imageUrl
    };
    onSelectDevice(updatedDevice, device.category);
  };

  const handleImageSelect = (deviceTitle: string, imageIndex: number) => {
    setSelectedImageIndex(prev => ({
      ...prev,
      [deviceTitle]: imageIndex
    }));
  };

  const cycleNextImage = (deviceTitle: string, currentIndex: number, totalImages: number) => {
    const nextIndex = (currentIndex + 1) % totalImages;
    handleImageSelect(deviceTitle, nextIndex);
  };

  const cyclePrevImage = (deviceTitle: string, currentIndex: number, totalImages: number) => {
    const prevIndex = (currentIndex - 1 + totalImages) % totalImages;
    handleImageSelect(deviceTitle, prevIndex);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <div className="p-6 flex-none">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Search for a device</h2>
            <button 
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search Wikipedia..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {loading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          {!loading && debouncedQuery.length >= 3 && results.length === 0 && (
            <p className="text-center py-4 text-gray-500">
              No results with images found. Try a different search term or device name.
            </p>
          )}
          
          <div className="space-y-3">
            {results.map((result, index) => (
              <div 
                key={index}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start mb-2">
                  <div className="w-32 h-32 mr-4 relative flex-shrink-0">
                    <img 
                      src={result.additionalImages[selectedImageIndex[result.title] || 0]} 
                      alt={result.title}
                      className="w-full h-full object-contain rounded bg-gray-100"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    {result.additionalImages.length > 1 && (
                      <>
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-1">
                          <button
                            onClick={() => cyclePrevImage(
                              result.title,
                              selectedImageIndex[result.title] || 0,
                              result.additionalImages.length
                            )}
                            className="bg-white/90 rounded-full p-1 shadow-sm hover:bg-white transition-colors"
                            title="Previous image"
                          >
                            <ChevronLeft size={16} className="text-gray-600" />
                          </button>
                          <button
                            onClick={() => cycleNextImage(
                              result.title,
                              selectedImageIndex[result.title] || 0,
                              result.additionalImages.length
                            )}
                            className="bg-white/90 rounded-full p-1 shadow-sm hover:bg-white transition-colors"
                            title="Next image"
                          >
                            <ChevronRight size={16} className="text-gray-600" />
                          </button>
                        </div>
                        <span className="absolute top-0 right-0 bg-gray-800/75 text-white text-xs px-1.5 py-0.5 rounded-full">
                          {result.additionalImages.length}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <a
                        href={result.wikiUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {result.title}
                      </a>
                      <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(result.category)}`}>
                        {deviceCategories.find(c => c.value === result.category)?.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3 mt-1">{result.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSelectDevice(result)}
                  className="w-full mt-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                  Select Device
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceSearch;