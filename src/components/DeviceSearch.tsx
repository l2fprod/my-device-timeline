import React, { useState, useEffect } from 'react';
import { searchWikipedia } from '../services/wikipediaService';
import { WikipediaSearchResult, DeviceCategory } from '../types/types';
import { Search, X } from 'lucide-react';

interface DeviceSearchProps {
  onSelectDevice: (device: WikipediaSearchResult, category: DeviceCategory) => void;
  onCancel: () => void;
}

const DeviceSearch: React.FC<DeviceSearchProps> = ({ onSelectDevice, onCancel }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<WikipediaSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<DeviceCategory>('smartphone');
  const [debouncedQuery, setDebouncedQuery] = useState('');

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
    onSelectDevice(device, selectedCategory);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Search for a device</h2>
          <button 
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Device Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as DeviceCategory)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {deviceCategories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="relative mb-4">
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
        
        {loading && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {!loading && debouncedQuery.length >= 3 && results.length === 0 && (
          <p className="text-center py-4 text-gray-500">No results found. Try a different search term.</p>
        )}
        
        <div className="space-y-3">
          {results.map((result, index) => (
            <div 
              key={index}
              onClick={() => handleSelectDevice(result)}
              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center">
                {result.imageUrl && (
                  <img 
                    src={result.imageUrl} 
                    alt={result.title}
                    className="w-16 h-16 object-contain mr-3 rounded bg-gray-100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{result.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{result.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeviceSearch;