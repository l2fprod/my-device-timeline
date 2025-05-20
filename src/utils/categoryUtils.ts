export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
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
  return colors[category] || colors.other;
}; 