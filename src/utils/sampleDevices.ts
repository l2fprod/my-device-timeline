import { Device } from '../types/types';

const sampleDevices: Device[] = [
  {
    id: '1',
    name: 'Commodore 64',
    category: 'desktop',
    startYear: 1982,
    endYear: 1989,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Commodore-64-Computer-FL.jpg/640px-Commodore-64-Computer-FL.jpg',
    description: 'One of the most popular home computers of all time',
    notes: 'My first computer! Learned BASIC programming on this.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Commodore_64'
  },
  {
    id: '2',
    name: 'Nintendo Entertainment System',
    category: 'gaming',
    startYear: 1985,
    endYear: 1991,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Nintendo-Entertainment-System-NES-FL.jpg/640px-Nintendo-Entertainment-System-NES-FL.jpg',
    description: 'Revolutionary 8-bit home video game console',
    notes: 'Countless hours playing Super Mario Bros and Zelda',
    wikiUrl: 'https://en.wikipedia.org/wiki/Nintendo_Entertainment_System'
  },
  {
    id: '3',
    name: 'Macintosh Classic',
    category: 'desktop',
    startYear: 1990,
    endYear: 1994,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Macintosh_Classic.jpg/640px-Macintosh_Classic.jpg',
    description: 'First affordable Macintosh computer',
    notes: 'Used for school work and early desktop publishing',
    wikiUrl: 'https://en.wikipedia.org/wiki/Macintosh_Classic'
  },
  {
    id: '4',
    name: 'Sony PlayStation',
    category: 'gaming',
    startYear: 1994,
    endYear: 2000,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/PSX-Console-wController.jpg/640px-PSX-Console-wController.jpg',
    description: 'Revolutionary 32-bit gaming console',
    notes: 'Final Fantasy VII and Metal Gear Solid were amazing!',
    wikiUrl: 'https://en.wikipedia.org/wiki/PlayStation_(console)'
  },
  {
    id: '5',
    name: 'Nokia 3310',
    category: 'smartphone',
    startYear: 2000,
    endYear: 2003,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Nokia_3310_blue.jpg/640px-Nokia_3310_blue.jpg',
    description: 'Legendary indestructible mobile phone',
    notes: 'Best phone ever made - survived countless drops!',
    wikiUrl: 'https://en.wikipedia.org/wiki/Nokia_3310'
  },
  {
    id: '6',
    name: 'iPod Classic',
    category: 'audio',
    startYear: 2001,
    endYear: 2007,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/IPod_classic_5th_generation_black.jpg/640px-IPod_classic_5th_generation_black.jpg',
    description: 'Revolutionary portable music player',
    notes: 'Changed how we listen to music on the go',
    wikiUrl: 'https://en.wikipedia.org/wiki/IPod_Classic'
  },
  {
    id: '7',
    name: 'Nintendo DS',
    category: 'gaming',
    startYear: 2004,
    endYear: 2009,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Nintendo-DS-Fat-Blue.jpg/640px-Nintendo-DS-Fat-Blue.jpg',
    description: 'Innovative dual-screen handheld console',
    notes: 'Great for travel and casual gaming',
    wikiUrl: 'https://en.wikipedia.org/wiki/Nintendo_DS'
  },
  {
    id: '8',
    name: 'iPhone 3G',
    category: 'smartphone',
    startYear: 2008,
    endYear: 2010,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/IPhone_3G_White.png/640px-IPhone_3G_White.png',
    description: 'First iPhone with 3G and App Store',
    notes: 'My first smartphone - changed everything!',
    wikiUrl: 'https://en.wikipedia.org/wiki/IPhone_3G'
  },
  {
    id: '9',
    name: 'iPad (1st generation)',
    category: 'tablet',
    startYear: 2010,
    endYear: 2012,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/IPad_1st_generation.png/640px-IPad_1st_generation.png',
    description: 'Revolutionary tablet computer',
    notes: 'Perfect for reading and casual browsing',
    wikiUrl: 'https://en.wikipedia.org/wiki/IPad_(1st_generation)'
  },
  {
    id: '10',
    name: 'PlayStation 4',
    category: 'gaming',
    startYear: 2013,
    endYear: 2020,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/PS4-Console-wDS4.jpg/640px-PS4-Console-wDS4.jpg',
    description: 'Eighth-generation home video game console',
    notes: 'Amazing exclusives like God of War and Spider-Man',
    wikiUrl: 'https://en.wikipedia.org/wiki/PlayStation_4'
  },
  {
    id: '11',
    name: 'MacBook Pro (M1)',
    category: 'laptop',
    startYear: 2020,
    endYear: null,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/MacBook_Pro_16-inch_%282019%29.png/640px-MacBook_Pro_16-inch_%282019%29.png',
    description: 'Revolutionary ARM-based laptop',
    notes: 'Incredible performance and battery life',
    wikiUrl: 'https://en.wikipedia.org/wiki/MacBook_Pro'
  },
  {
    id: '12',
    name: 'Sony WH-1000XM4',
    category: 'audio',
    startYear: 2020,
    endYear: null,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Sony_WH-1000XM4.jpg/640px-Sony_WH-1000XM4.jpg',
    description: 'Premium noise-cancelling headphones',
    notes: 'Best headphones I\'ve ever owned',
    wikiUrl: 'https://en.wikipedia.org/wiki/Sony_WH-1000XM4'
  },
  {
    id: '13',
    name: 'iPhone 13 Pro',
    category: 'smartphone',
    startYear: 2021,
    endYear: null,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/IPhone_13_Pro_Blue.png/640px-IPhone_13_Pro_Blue.png',
    description: 'Flagship smartphone with Pro camera system',
    notes: 'Amazing camera and battery life',
    wikiUrl: 'https://en.wikipedia.org/wiki/IPhone_13_Pro'
  },
  {
    id: '14',
    name: 'Nintendo Switch OLED',
    category: 'gaming',
    startYear: 2021,
    endYear: null,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Nintendo-Switch-OLED-Model-wJoyCons-Bl.jpg/640px-Nintendo-Switch-OLED-Model-wJoyCons-Bl.jpg',
    description: 'Hybrid gaming console with OLED screen',
    notes: 'Perfect for both home and portable gaming',
    wikiUrl: 'https://en.wikipedia.org/wiki/Nintendo_Switch'
  },
  {
    id: '15',
    name: 'Sony Alpha A7 IV',
    category: 'camera',
    startYear: 2021,
    endYear: null,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Sony_Alpha_A7_IV.jpg/640px-Sony_Alpha_A7_IV.jpg',
    description: 'Full-frame mirrorless camera',
    notes: 'Incredible photo and video quality',
    wikiUrl: 'https://en.wikipedia.org/wiki/Sony_%CE%B17_IV'
  },
  {
    id: '16',
    name: 'Apple Watch Series 7',
    category: 'smartwatch',
    startYear: 2021,
    endYear: null,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Apple_Watch_Series_7.png/640px-Apple_Watch_Series_7.png',
    description: 'Advanced health and fitness smartwatch',
    notes: 'Great for tracking workouts and notifications',
    wikiUrl: 'https://en.wikipedia.org/wiki/Apple_Watch'
  },
  {
    id: '17',
    name: 'Samsung Galaxy S22 Ultra',
    category: 'smartphone',
    startYear: 2022,
    endYear: null,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Samsung_Galaxy_S22_Ultra.png/640px-Samsung_Galaxy_S22_Ultra.png',
    description: 'Premium Android smartphone with S Pen',
    notes: 'Excellent camera and display',
    wikiUrl: 'https://en.wikipedia.org/wiki/Samsung_Galaxy_S22'
  },
  {
    id: '18',
    name: 'PlayStation 5',
    category: 'gaming',
    startYear: 2020,
    endYear: null,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/PlayStation_5_and_DualSense_with_transparent_background.png/640px-PlayStation_5_and_DualSense_with_transparent_background.png',
    description: 'Next-generation gaming console',
    notes: 'Incredible graphics and fast loading times',
    wikiUrl: 'https://en.wikipedia.org/wiki/PlayStation_5'
  },
  {
    id: '19',
    name: 'iPad Pro (M2)',
    category: 'tablet',
    startYear: 2022,
    endYear: null,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/IPad_Pro_12.9-inch_5th_generation.png/640px-IPad_Pro_12.9-inch_5th_generation.png',
    description: 'Professional-grade tablet with M2 chip',
    notes: 'Perfect for digital art and productivity',
    wikiUrl: 'https://en.wikipedia.org/wiki/IPad_Pro'
  },
  {
    id: '20',
    name: 'Mac Studio',
    category: 'desktop',
    startYear: 2022,
    endYear: null,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Mac_Studio.png/640px-Mac_Studio.png',
    description: 'Professional desktop computer',
    notes: 'Incredible performance for creative work',
    wikiUrl: 'https://en.wikipedia.org/wiki/Mac_Studio'
  }
];

export const getSampleDevices = (): Device[] => {
  return sampleDevices.map(device => ({
    ...device,
    id: crypto.randomUUID() // Generate new IDs to avoid conflicts
  }));
}; 