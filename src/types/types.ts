export interface Device {
  id: string;
  name: string;
  category: DeviceCategory;
  startYear: number;
  endYear: number | null; // null means "still using"
  imageUrl: string;
  description: string;
  notes: string;
  wikiUrl: string;
}

export type DeviceCategory = 
  | 'smartphone'
  | 'laptop'
  | 'desktop'
  | 'tablet'
  | 'smartwatch'
  | 'gaming'
  | 'audio'
  | 'camera'
  | 'other';

export interface WikipediaSearchResult {
  title: string;
  description: string;
  imageUrl: string;
  additionalImages: string[];
  wikiUrl: string;
  releaseYear: number | null;
  category: DeviceCategory;
}