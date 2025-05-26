import { Device } from '../types/types';

const sampleDevices: Device[] = [
  {
    id: '1',
    name: 'Commodore 64',
    category: 'desktop',
    startYear: 1982,
    endYear: 1989,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Commodore-64-Computer-FL.jpg/500px-Commodore-64-Computer-FL.jpg',
    description: 'One of the most popular home computers of all time',
    notes: 'My first computer! Learned BASIC programming on this. 💻',
    wikiUrl: 'https://en.wikipedia.org/wiki/Commodore_64'
  },
  {
    id: '2',
    name: 'Nintendo Entertainment System',
    category: 'gaming',
    startYear: 1985,
    endYear: 1991,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/NES-Console-Set.png/500px-NES-Console-Set.png',
    description: 'Revolutionary 8-bit home video game console',
    notes: 'Countless hours playing Super Mario Bros and Zelda! ⭐',
    wikiUrl: 'https://en.wikipedia.org/wiki/Nintendo_Entertainment_System'
  },
  {
    id: '3',
    name: 'Macintosh Classic',
    category: 'desktop',
    startYear: 1990,
    endYear: 1994,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Macintosh_classic.jpg/500px-Macintosh_classic.jpg',
    description: 'First affordable Macintosh computer',
    notes: 'Used for school work and early desktop publishing 📚',
    wikiUrl: 'https://en.wikipedia.org/wiki/Macintosh_Classic'
  },
  {
    id: '4',
    name: 'Sony PlayStation',
    category: 'gaming',
    startYear: 1994,
    endYear: 2000,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/PlayStation-SCPH-1000-with-Controller.jpg/500px-PlayStation-SCPH-1000-with-Controller.jpg',
    description: 'Revolutionary 32-bit gaming console',
    notes: 'Final Fantasy VII and Metal Gear Solid were amazing! 🌟',
    wikiUrl: 'https://en.wikipedia.org/wiki/PlayStation_(console)'
  },
  {
    id: '5',
    name: 'Nokia 3310',
    category: 'smartphone',
    startYear: 2000,
    endYear: 2003,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Nokia_3310_Blue_R7309170_%28retouch%29.png/330px-Nokia_3310_Blue_R7309170_%28retouch%29.png',
    description: 'Legendary indestructible mobile phone',
    notes: 'Best phone ever made - survived countless drops! 💪',
    wikiUrl: 'https://en.wikipedia.org/wiki/Nokia_3310'
  },
  {
    id: '6',
    name: 'iPod Classic',
    category: 'audio',
    startYear: 2001,
    endYear: 2007,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Lightmatter_ipod_1G.jpg',
    description: 'Revolutionary portable music player',
    notes: 'Changed how we listen to music on the go 🎧',
    wikiUrl: 'https://en.wikipedia.org/wiki/IPod_Classic'
  },
  {
    id: '7',
    name: 'Nintendo DS',
    category: 'gaming',
    startYear: 2004,
    endYear: 2009,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/BlueSkinnedDS.png/500px-BlueSkinnedDS.png',
    description: 'Innovative dual-screen handheld console',
    notes: 'Great for travel and casual gaming ✈️',
    wikiUrl: 'https://en.wikipedia.org/wiki/Nintendo_DS'
  },
  {
    id: '8',
    name: 'iPhone 3G',
    category: 'smartphone',
    startYear: 2008,
    endYear: 2010,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/IPhone_%26_iPhone_3G.jpg',
    description: 'First iPhone with 3G and App Store',
    notes: 'My first smartphone - changed everything! 🌟',
    wikiUrl: 'https://en.wikipedia.org/wiki/IPhone_3G'
  },
  {
    id: '9',
    name: 'iPad (1st generation)',
    category: 'tablet',
    startYear: 2010,
    endYear: 2012,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/IPad-WiFi-1stGen.jpg/500px-IPad-WiFi-1stGen.jpg',
    description: 'Revolutionary tablet computer',
    notes: 'Perfect for reading and casual browsing 📚',
    wikiUrl: 'https://en.wikipedia.org/wiki/IPad_(1st_generation)'
  },
  {
    id: '10',
    name: 'PlayStation 4',
    category: 'gaming',
    startYear: 2013,
    endYear: 2020,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/PS4-Console-wDS4.jpg/500px-PS4-Console-wDS4.jpg',
    description: 'Eighth-generation home video game console',
    notes: 'Amazing exclusives like God of War and Spider-Man! 🦸‍♂️',
    wikiUrl: 'https://en.wikipedia.org/wiki/PlayStation_4'
  },
  {
    id: '11',
    name: 'MacBook Pro (M1)',
    category: 'laptop',
    startYear: 2020,
    endYear: null,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/M3_Macbook_Pro_14_inch_Space_Grey_model_%28cropped%29.jpg/500px-M3_Macbook_Pro_14_inch_Space_Grey_model_%28cropped%29.jpg',
    description: 'Revolutionary ARM-based laptop',
    notes: 'Incredible performance and battery life ⚡',
    wikiUrl: 'https://en.wikipedia.org/wiki/MacBook_Pro'
  },
  {
    id: '13',
    name: 'iPhone 13 Pro',
    category: 'smartphone',
    startYear: 2021,
    endYear: null,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/IPhone_13_Pro_vector.svg/500px-IPhone_13_Pro_vector.svg.png',
    description: 'Flagship smartphone with Pro camera system',
    notes: 'Amazing camera and battery life 📸',
    wikiUrl: 'https://en.wikipedia.org/wiki/IPhone_13_Pro'
  },
  {
    id: '14',
    name: 'Nintendo Switch OLED',
    category: 'gaming',
    startYear: 2021,
    endYear: null,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Nintendo_Switch_%E2%80%93_OLED-Modell%2C_Konsole_und_Dock_20230506.png/500px-Nintendo_Switch_%E2%80%93_OLED-Modell%2C_Konsole_und_Dock_20230506.png',
    description: 'Hybrid gaming console with OLED screen',
    notes: 'Perfect for both home and portable gaming 🎯',
    wikiUrl: 'https://en.wikipedia.org/wiki/Nintendo_Switch'
  },
  {
    id: '15',
    name: 'Sony Alpha A7 IV',
    category: 'camera',
    startYear: 2021,
    endYear: null,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Sony_A7_IV_%28ILCE-7M4%29_-_by_Henry_S%C3%B6derlund_%2851739988735%29.jpg/960px-Sony_A7_IV_%28ILCE-7M4%29_-_by_Henry_S%C3%B6derlund_%2851739988735%29.jpg',
    description: 'Full-frame mirrorless camera',
    notes: 'Incredible photo and video quality 🌅',
    wikiUrl: 'https://en.wikipedia.org/wiki/Sony_%CE%B17_IV'
  },
  {
    id: '16',
    name: 'Apple Watch Series 7',
    category: 'smartwatch',
    startYear: 2021,
    endYear: null,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Apple_Watch_Series_8_Midnight_Aluminium_Case.jpg/500px-Apple_Watch_Series_8_Midnight_Aluminium_Case.jpg',
    description: 'Advanced health and fitness smartwatch',
    notes: 'Great for tracking workouts and notifications 💪',
    wikiUrl: 'https://en.wikipedia.org/wiki/Apple_Watch'
  },
  {
    id: '17',
    name: 'Samsung Galaxy S22 Ultra',
    category: 'smartphone',
    startYear: 2022,
    endYear: null,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Back_of_the_Samsung_Galaxy_S22.jpg/1920px-Back_of_the_Samsung_Galaxy_S22.jpg',
    description: 'Premium Android smartphone with S Pen',
    notes: 'Excellent camera and display 📸',
    wikiUrl: 'https://en.wikipedia.org/wiki/Samsung_Galaxy_S22'
  },
  {
    id: '18',
    name: 'PlayStation 5',
    category: 'gaming',
    startYear: 2020,
    endYear: null,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Black_and_white_Playstation_5_base_edition_with_controller.png/500px-Black_and_white_Playstation_5_base_edition_with_controller.png',
    description: 'Next-generation gaming console',
    notes: 'Incredible graphics and fast loading times ⚡',
    wikiUrl: 'https://en.wikipedia.org/wiki/PlayStation_5'
  },
  {
    id: '19',
    name: 'iPad Pro (M2)',
    category: 'tablet',
    startYear: 2022,
    endYear: null,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Wikipedia_on_iPad_Pro.jpg/500px-Wikipedia_on_iPad_Pro.jpg',
    description: 'Professional-grade tablet with M2 chip',
    notes: 'Perfect for digital art and productivity 🎨',
    wikiUrl: 'https://en.wikipedia.org/wiki/IPad_Pro'
  },
  {
    id: '20',
    name: 'Mac Studio',
    category: 'desktop',
    startYear: 2022,
    endYear: null,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Mac_Studio_%282022%29_front.jpg/500px-Mac_Studio_%282022%29_front.jpg',
    description: 'Professional desktop computer',
    notes: 'Incredible performance for creative work ⚡',
    wikiUrl: 'https://en.wikipedia.org/wiki/Mac_Studio'
  }
];

export const getSampleDevices = (): Device[] => {
  return sampleDevices.map(device => ({
    ...device,
    id: crypto.randomUUID() // Generate new IDs to avoid conflicts
  }));
}; 