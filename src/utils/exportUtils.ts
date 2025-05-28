import { Device, DeviceCategory } from '../types/types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as clipboard from 'clipboard-polyfill';

const toBold = (text: string): string => {
  const boldMap: Record<string, string> = {
    // Letters
    'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣',
    'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭',
    'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳',
    'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉',
    'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓',
    'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
    // Numbers
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗',
    // Special characters
    '+': '➕', '-': '➖', '×': '✖️', '÷': '➗', '=': '🟰', '!': '❗', '?': '❓',
    '(': '❨', ')': '❩', '[': '❲', ']': '❳', '{': '❴', '}': '❵',
    '<': '❮', '>': '❯', '/': '⁄', '\\': '∖', '|': '❘', '&': '＆',
    '@': '＠', '#': '＃', '$': '＄', '%': '％', '^': '＾', '*': '＊',
    '.': '․', ',': '，', ';': '；', ':': '：', '"': '＂', "'": '＇',
    ' ': ' '
  };
  return text.split('').map(char => boldMap[char] || char).join('');
};

const getRandomIntro = (): string => {
  const intros = [
    "💫 My Technology Journey 💻 Ever wondered how your tech stack evolved? Here's mine! Create your own at https://mytimeline.fredericlavigne.com",
    "💫 From floppy disks to cloud storage - here's my tech evolution! 💻 Want to map your own journey? Try https://mytimeline.fredericlavigne.com",
    "🚀 My Digital Timeline: A Journey Through Tech 💻 Every device tells a story. What's yours? Create your timeline at https://mytimeline.fredericlavigne.com",
    "🚀 The Evolution of My Tech Arsenal 💻 From first computer to latest gadget - here's my journey! Map yours at https://mytimeline.fredericlavigne.com",
    "💫 My Tech Timeline: A Story of Innovation 📱 Each device marks a milestone in my digital journey. Start yours at https://mytimeline.fredericlavigne.com"
  ];
  return intros[Math.floor(Math.random() * intros.length)];
};

function getCardColors(seed: string) {
  // Simple hash to pick a color pair from a palette
  const palette = [
    ['#ffb347', '#ffcc33'], // orange-yellow
    ['#6dd5ed', '#2193b0'], // blue-cyan
    ['#f7971e', '#ffd200'], // orange-gold
    ['#f953c6', '#b91d73'], // pink-purple
    ['#43cea2', '#185a9d'], // green-blue
    ['#ff6e7f', '#bfe9ff'], // pink-lightblue
    ['#f7797d', '#FBD786'], // red-yellow
    ['#c471f5', '#fa71cd'], // purple-pink
    ['#30cfd0', '#330867'], // teal-indigo
    ['#f857a6', '#ff5858'], // magenta-red
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) % palette.length;
  return palette[Math.abs(hash) % palette.length];
}

export const formatForLinkedIn = (devices: Device[]): string => {
  // Sort devices by start year (oldest first) and then alphabetically
  const sortedDevices = [...devices].sort((a, b) => {
    if (a.startYear !== b.startYear) {
      return a.startYear - b.startYear;
    }
    return a.name.localeCompare(b.name);
  });
  
  let output = `${getRandomIntro()}\n\n`;
  
  // Group devices by year
  const devicesByYear = sortedDevices.reduce((acc, device) => {
    if (!acc[device.startYear]) {
      acc[device.startYear] = [];
    }
    acc[device.startYear].push(device);
    return acc;
  }, {} as Record<number, Device[]>);
  
  // Output devices grouped by year
  Object.entries(devicesByYear)
    .sort(([yearA], [yearB]) => Number(yearA) - Number(yearB))
    .forEach(([year, yearDevices]) => {
      output += `📅 ${year}\n`;
      yearDevices.forEach(device => {
        const categoryEmoji = getCategoryEmoji(device.category);
        output += `${categoryEmoji} ${toBold(device.name)}${device.notes ? ` - ${device.notes}` : ''}\n`;
      });
      output += '\n';
    });
  
  output += '#TechEvolution #DigitalJourney #TechTimeline #TechHistory #TechStory #VibeCoding';
  
  return output;
};

const getCategoryEmoji = (category: DeviceCategory): string => {
  const emojis: Record<DeviceCategory, string> = {
    smartphone: '📱',
    laptop: '💻',
    desktop: '🖥️',
    tablet: '📱',
    smartwatch: '⌚',
    gaming: '🎮',
    audio: '🎧',
    camera: '📸',
    other: '🔧'
  };
  return emojis[category];
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
};

export const exportAsLinkedInImage = async (devices: Device[], fileName: string = 'mytimeline.png'): Promise<void> => {
  try {
    // Initialize all layout variables
    const layout = {
      cardWidth: 220,
      cardHeight: 280,
      cardGapX: 32,
      cardGapY: 48,
      imageWidth: 1080,
      margin: 40,
      zigzagOffset: 40,
      startX: 0
    };

    // Add extra margin around the cards
    const extraMargin = 32;
    // Sort devices by year (oldest first)
    const sortedDevices = [...devices].sort((a, b) => a.startYear - b.startYear);
    // Calculate square layout
    const numColumns = Math.ceil(Math.sqrt(sortedDevices.length));
    const numRows = Math.ceil(sortedDevices.length / numColumns);
    // Dynamically set image width to fit all columns
    layout.imageWidth = layout.margin * 2 + extraMargin * 2 + numColumns * layout.cardWidth + (numColumns - 1) * layout.cardGapX;
    // Add extra space at the bottom for attribution
    const attributionHeight = 60;
    const imageHeight = layout.margin * 2 + extraMargin * 2 + numRows * layout.cardHeight + (numRows - 1) * layout.cardGapY + layout.zigzagOffset + attributionHeight;

    // Calculate total width of all cards in a row and center position
    const totalRowWidth = numColumns * layout.cardWidth + (numColumns - 1) * layout.cardGapX;
    layout.startX = layout.margin + extraMargin;

    // Arrange devices in rows with correct column placement for single-card rows
    // Build a 2D array of rows and columns
    type DeviceWithCol = { device: Device, col: number, row: number };
    const arrangedDevices: DeviceWithCol[] = [];
    let deviceIdx = 0;
    for (let row = 0; row < numRows; row++) {
      const rowDevices = sortedDevices.slice(deviceIdx, deviceIdx + numColumns);
      const rowArr: (Device | null)[] = Array(numColumns).fill(null);
      if (rowDevices.length === 1 && row > 0) {
        // Place the single device in the same column as the card it is connected to in the previous row
        const prevRow = arrangedDevices.filter(d => d.row === row - 1);
        let targetCol: number | undefined = undefined;
        if ((row - 1) % 2 === 1) {
          // Previous row is right-to-left: use the first non-empty column
          targetCol = prevRow.map(d => d.col).sort((a, b) => a - b)[0];
        } else {
          // Previous row is left-to-right: use the last non-empty column
          targetCol = prevRow.map(d => d.col).sort((a, b) => b - a)[0];
        }
        if (targetCol !== undefined) {
          rowArr[targetCol] = rowDevices[0];
        } else {
          rowArr[0] = rowDevices[0];
        }
      } else {
        // Normal row: fill left to right (or right to left for odd rows)
        if (row % 2 === 1) {
          for (let i = 0; i < rowDevices.length; i++) {
            rowArr[numColumns - 1 - i] = rowDevices[i];
          }
        } else {
          for (let i = 0; i < rowDevices.length; i++) {
            rowArr[i] = rowDevices[i];
          }
        }
      }
      for (let col = 0; col < numColumns; col++) {
        if (rowArr[col]) {
          arrangedDevices.push({ device: rowArr[col]!, col, row });
        }
      }
      deviceIdx += rowDevices.length;
    }

    // Create container
    const container = document.createElement('div');
    container.style.width = `${layout.imageWidth}px`;
    container.style.height = `${imageHeight}px`;
    container.style.background = 'linear-gradient(135deg, #2c3e50 0%, #3498db 25%, #2980b9 50%, #34495e 75%, #2c3e50 100%)';
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.padding = '0';
    document.body.appendChild(container);

    // Create a container for all SVG elements
    const svgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgContainer.style.position = 'absolute';
    svgContainer.style.left = '0';
    svgContainer.style.top = '0';
    svgContainer.style.width = `${layout.imageWidth}px`;
    svgContainer.style.height = `${imageHeight}px`;
    svgContainer.style.pointerEvents = 'none';
    svgContainer.style.zIndex = '3';
    container.appendChild(svgContainer);

    // Add gradient definition to the SVG container
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'electricGradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '0%');
    
    const colors = [
      { offset: '0%', color: '#4facfe' },
      { offset: '25%', color: '#00f2fe' },
      { offset: '50%', color: '#4facfe' },
      { offset: '75%', color: '#00f2fe' },
      { offset: '100%', color: '#4facfe' }
    ];
    
    colors.forEach(({ offset, color }) => {
      const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop.setAttribute('offset', offset);
      stop.setAttribute('stop-color', color);
      gradient.appendChild(stop);
    });
    
    defs.appendChild(gradient);

    // Add vintage frame gradient
    const frameGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    frameGradient.setAttribute('id', 'frameGradient');
    frameGradient.setAttribute('x1', '0%');
    frameGradient.setAttribute('y1', '0%');
    frameGradient.setAttribute('x2', '100%');
    frameGradient.setAttribute('y2', '100%');
    
    const frameColors = [
      { offset: '0%', color: '#8B4513' },
      { offset: '50%', color: '#A0522D' },
      { offset: '100%', color: '#8B4513' }
    ];
    
    frameColors.forEach(({ offset, color }) => {
      const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop.setAttribute('offset', offset);
      stop.setAttribute('stop-color', color);
      frameGradient.appendChild(stop);
    });
    
    defs.appendChild(frameGradient);

    // Add gold gradient for decorative elements
    const goldGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    goldGradient.setAttribute('id', 'goldGradient');
    goldGradient.setAttribute('x1', '0%');
    goldGradient.setAttribute('y1', '0%');
    goldGradient.setAttribute('x2', '100%');
    goldGradient.setAttribute('y2', '100%');
    
    const goldColors = [
      { offset: '0%', color: '#FFD700' },
      { offset: '50%', color: '#DAA520' },
      { offset: '100%', color: '#FFD700' }
    ];
    
    goldColors.forEach(({ offset, color }) => {
      const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop.setAttribute('offset', offset);
      stop.setAttribute('stop-color', color);
      goldGradient.appendChild(stop);
    });
    
    defs.appendChild(goldGradient);

    // Add lens flare gradient
    const flareGradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
    flareGradient.setAttribute('id', 'flareGradient');
    flareGradient.setAttribute('cx', '50%');
    flareGradient.setAttribute('cy', '50%');
    flareGradient.setAttribute('r', '50%');
    
    const flareColors = [
      { offset: '0%', color: '#ffffff' },
      { offset: '50%', color: 'rgba(255,255,255,0.5)' },
      { offset: '100%', color: 'rgba(255,255,255,0)' }
    ];
    
    flareColors.forEach(({ offset, color }) => {
      const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop.setAttribute('offset', offset);
      stop.setAttribute('stop-color', color);
      flareGradient.appendChild(stop);
    });
    
    defs.appendChild(flareGradient);
    svgContainer.appendChild(defs);

    // Function to create a lens flare
    function createLensFlare(x: number, y: number, size: number) {
      const flare = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      flare.setAttribute('cx', x.toString());
      flare.setAttribute('cy', y.toString());
      flare.setAttribute('r', size.toString());
      flare.setAttribute('fill', 'url(#flareGradient)');
      flare.style.filter = 'blur(2px)';
      return flare;
    }

    // Add vintage frame
    const frameStroke = 40; // Make the frame thick and on the edge
    const frame = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    frame.setAttribute('x', '0');
    frame.setAttribute('y', '0');
    frame.setAttribute('width', layout.imageWidth.toString());
    frame.setAttribute('height', imageHeight.toString());
    frame.setAttribute('fill', 'none');
    frame.setAttribute('stroke', 'url(#frameGradient)');
    frame.setAttribute('stroke-width', frameStroke.toString());
    frame.setAttribute('rx', '48');
    frame.setAttribute('ry', '48');
    frame.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))';
    svgContainer.appendChild(frame);

    // Add decorative corner elements at the true corners
    const cornerSize = 90;
    const corners = [
      { x: 0, y: 0, rotate: 0 },
      { x: layout.imageWidth, y: 0, rotate: 90 },
      { x: 0, y: imageHeight, rotate: 270 },
      { x: layout.imageWidth, y: imageHeight, rotate: 180 }
    ];
    corners.forEach(({ x, y, rotate }) => {
      const corner = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      // Draw a triangle that hugs the corner
      const points = [
        `${x},${y}`,
        `${x + (rotate === 90 || rotate === 180 ? -cornerSize : cornerSize)},${y}`,
        `${x},${y + (rotate >= 180 ? -cornerSize : cornerSize)}`
      ].join(' ');
      corner.setAttribute('points', points);
      corner.setAttribute('fill', 'url(#goldGradient)');
      corner.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))';
      svgContainer.appendChild(corner);
    });

    // Add random lens flares
    const numFlares = Math.floor(Math.random() * 5) + 3; // 3-7 flares
    for (let i = 0; i < numFlares; i++) {
      const x = Math.random() * layout.imageWidth;
      const y = Math.random() * imageHeight;
      const size = Math.random() * 100 + 50; // Random size between 50 and 150
      const flare = createLensFlare(x, y, size);
      svgContainer.appendChild(flare);
    }

    // Museum-style gold plate for attribution
    // Gold gradient for plate
    const museumGoldGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    museumGoldGradient.setAttribute('id', 'museumGoldGradient');
    museumGoldGradient.setAttribute('x1', '0%');
    museumGoldGradient.setAttribute('y1', '0%');
    museumGoldGradient.setAttribute('x2', '100%');
    museumGoldGradient.setAttribute('y2', '100%');
    const museumGoldStops = [
      { offset: '0%', color: '#f7e199' },
      { offset: '30%', color: '#bfa14a' },
      { offset: '50%', color: '#fffbe6' },
      { offset: '70%', color: '#bfa14a' },
      { offset: '100%', color: '#f7e199' }
    ];
    museumGoldStops.forEach(({ offset, color }) => {
      const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop.setAttribute('offset', offset);
      stop.setAttribute('stop-color', color);
      museumGoldGradient.appendChild(stop);
    });
    defs.appendChild(museumGoldGradient);

    // Plate proportions
    const museumPlateWidth = Math.round(layout.imageWidth * 0.38); // about 1/3 of the image width
    const museumPlateHeight = Math.round(museumPlateWidth * 0.13); // about 1/8 as tall as wide
    const museumPlateX = Math.round(layout.imageWidth / 2 - museumPlateWidth / 2);
    const museumPlateBottomMargin = 18;
    const museumPlateY = imageHeight - museumPlateHeight - museumPlateBottomMargin;

    // Plate base
    const museumPlate = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    museumPlate.setAttribute('x', museumPlateX.toString());
    museumPlate.setAttribute('y', museumPlateY.toString());
    museumPlate.setAttribute('width', museumPlateWidth.toString());
    museumPlate.setAttribute('height', museumPlateHeight.toString());
    museumPlate.setAttribute('rx', '7');
    museumPlate.setAttribute('ry', '7');
    museumPlate.setAttribute('fill', 'url(#museumGoldGradient)');
    museumPlate.setAttribute('stroke', '#a48a3b');
    museumPlate.setAttribute('stroke-width', '2.5');
    museumPlate.style.filter = 'drop-shadow(0 2px 8px #0005)';
    svgContainer.appendChild(museumPlate);

    // Beveled inner border
    const museumPlateInner = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    museumPlateInner.setAttribute('x', (museumPlateX + 3).toString());
    museumPlateInner.setAttribute('y', (museumPlateY + 3).toString());
    museumPlateInner.setAttribute('width', (museumPlateWidth - 6).toString());
    museumPlateInner.setAttribute('height', (museumPlateHeight - 6).toString());
    museumPlateInner.setAttribute('rx', '4');
    museumPlateInner.setAttribute('ry', '4');
    museumPlateInner.setAttribute('fill', 'none');
    museumPlateInner.setAttribute('stroke', '#fffbe6');
    museumPlateInner.setAttribute('stroke-width', '1');
    museumPlateInner.style.opacity = '0.7';
    svgContainer.appendChild(museumPlateInner);

    // Screws (left and right)
    const screwRadius = 4;
    const screwY = museumPlateY + museumPlateHeight / 2;
    const screwLeftX = museumPlateX + 14;
    const screwRightX = museumPlateX + museumPlateWidth - 14;
    [screwLeftX, screwRightX].forEach((cx) => {
      const screw = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      screw.setAttribute('cx', cx.toString());
      screw.setAttribute('cy', screwY.toString());
      screw.setAttribute('r', screwRadius.toString());
      screw.setAttribute('fill', '#bfa14a');
      screw.setAttribute('stroke', '#fffbe6');
      screw.setAttribute('stroke-width', '1');
      screw.style.filter = 'drop-shadow(0 1px 2px #0006)';
      svgContainer.appendChild(screw);
    });

    // Engraved museum text (two lines)
    const museumTextLine1 = 'CREATE YOUR OWN TIMELINE';
    const museumTextLine2 = 'MYTIMELINE.FREDERICLAVIGNE.COM';
    // Calculate plate width based on the longer line
    let maxTextWidth = museumPlateWidth;
    const textPadding = 80;
    let fontSize = Math.round(museumPlateHeight * 0.38);
    {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.font = `bold ${fontSize}px Arial Black, Arial, sans-serif`;
        const line1Width = ctx.measureText(museumTextLine1).width;
        const line2Width = ctx.measureText(museumTextLine2).width;
        maxTextWidth = Math.max(line1Width, line2Width);
      }
    }
    const newPlateWidth = Math.max(museumPlateWidth, Math.round(maxTextWidth + textPadding));
    const newPlateX = Math.round(layout.imageWidth / 2 - newPlateWidth / 2);
    // Adjust plate width
    museumPlate.setAttribute('x', newPlateX.toString());
    museumPlate.setAttribute('width', newPlateWidth.toString());
    museumPlateInner.setAttribute('x', (newPlateX + 3).toString());
    museumPlateInner.setAttribute('width', (newPlateWidth - 6).toString());
    // Adjust screws
    const newScrewLeftX = newPlateX + 14;
    const newScrewRightX = newPlateX + newPlateWidth - 14;
    // Remove old screws (if any)
    const oldScrews = Array.from(svgContainer.querySelectorAll('circle'));
    oldScrews.forEach(s => svgContainer.removeChild(s));
    [newScrewLeftX, newScrewRightX].forEach((cx) => {
      const screw = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      screw.setAttribute('cx', cx.toString());
      screw.setAttribute('cy', screwY.toString());
      screw.setAttribute('r', screwRadius.toString());
      screw.setAttribute('fill', '#bfa14a');
      screw.setAttribute('stroke', '#fffbe6');
      screw.setAttribute('stroke-width', '1');
      screw.style.filter = 'drop-shadow(0 1px 2px #0006)';
      svgContainer.appendChild(screw);
    });
    // Adjust plate height for two lines
    const newPlateHeight = Math.round(museumPlateHeight * 1.35); // More compact
    const plateTop = museumPlateY - (newPlateHeight - museumPlateHeight) / 2;
    museumPlate.setAttribute('height', newPlateHeight.toString());
    museumPlate.setAttribute('y', plateTop.toString());
    museumPlateInner.setAttribute('height', (newPlateHeight - 6).toString());
    museumPlateInner.setAttribute('y', (plateTop + 3).toString());
    // Center two lines of text vertically
    const lineSpacing = Math.round(fontSize * 0.25);
    const textBlockHeight = fontSize * 2 + lineSpacing;
    const textBlockTop = plateTop + (newPlateHeight - textBlockHeight) / 2;
    const textY1 = Math.round(textBlockTop + fontSize);
    const textY2 = Math.round(textY1 + lineSpacing + fontSize);
    // Add two lines of text
    const museumText1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    museumText1.setAttribute('x', (layout.imageWidth / 2).toString());
    museumText1.setAttribute('y', textY1.toString());
    museumText1.setAttribute('text-anchor', 'middle');
    museumText1.setAttribute('font-family', 'Arial Black, Arial, sans-serif');
    museumText1.setAttribute('font-size', fontSize.toString());
    museumText1.setAttribute('font-weight', 'bold');
    museumText1.setAttribute('letter-spacing', '1.2px');
    museumText1.textContent = museumTextLine1;
    museumText1.setAttribute('fill', '#3a2d13');
    museumText1.setAttribute('stroke', '#fffbe6');
    museumText1.setAttribute('stroke-width', '0.8');
    museumText1.style.filter = 'drop-shadow(0 1px 0 #fffbe6) drop-shadow(0 2px 2px #0007)';
    svgContainer.appendChild(museumText1);
    const museumText2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    museumText2.setAttribute('x', (layout.imageWidth / 2).toString());
    museumText2.setAttribute('y', textY2.toString());
    museumText2.setAttribute('text-anchor', 'middle');
    museumText2.setAttribute('font-family', 'Arial Black, Arial, sans-serif');
    museumText2.setAttribute('font-size', fontSize.toString());
    museumText2.setAttribute('font-weight', 'bold');
    museumText2.setAttribute('letter-spacing', '1.2px');
    museumText2.textContent = museumTextLine2;
    museumText2.setAttribute('fill', '#3a2d13');
    museumText2.setAttribute('stroke', '#fffbe6');
    museumText2.setAttribute('stroke-width', '0.8');
    museumText2.style.filter = 'drop-shadow(0 1px 0 #fffbe6) drop-shadow(0 2px 2px #0007)';
    svgContainer.appendChild(museumText2);

    // Add cards in the arranged order
    // First, create all connecting lines
    arrangedDevices.forEach(({ device, col, row }, i) => {
      if (i < arrangedDevices.length - 1) {
        const next = arrangedDevices[i + 1];
        const nextCol = next.col;
        const nextRow = next.row;
        const nextZigzag = (nextCol % 2 === 0) ? 0 : layout.zigzagOffset;
        const nextLeft = layout.startX + nextCol * (layout.cardWidth + layout.cardGapX);
        const nextTop = layout.margin + extraMargin + nextRow * (layout.cardHeight + layout.cardGapY) + nextZigzag;

        // Calculate current card position
        const zigzag = (col % 2 === 0) ? 0 : layout.zigzagOffset;
        const left = layout.startX + col * (layout.cardWidth + layout.cardGapX);
        const top = layout.margin + extraMargin + row * (layout.cardHeight + layout.cardGapY) + zigzag;

        // Calculate start and end points based on position
        let startX, startY, endX, endY;
        
        // Check if this is the last card in a row
        const isLastInRow = col === numColumns - 1;
        const isFirstInRow = col === 0;
        const isLastRow = row === numRows - 1;
        const isFirstRow = row === 0;
        
        if (isLastInRow && !isLastRow && row % 2 === 0) {
          // Last card in an odd row (except last row) - connect to the last card of next row
          const nextLastCol = numColumns - 1;
          const nextLastLeft = layout.startX + nextLastCol * (layout.cardWidth + layout.cardGapX);
          const nextLastTop = layout.margin + extraMargin + (row + 1) * (layout.cardHeight + layout.cardGapY) + ((nextLastCol % 2 === 0) ? 0 : layout.zigzagOffset);
          
          startX = left + layout.cardWidth / 2;
          startY = top + layout.cardHeight;
          endX = nextLastLeft + layout.cardWidth / 2;
          endY = nextLastTop; // top edge of the next card (not under it)
        } else if (isFirstInRow && !isFirstRow && row % 2 === 1) {
          // First card in an even row (except first row) - connect to the first card of next row
          const nextFirstCol = 0;
          const nextFirstLeft = layout.startX + nextFirstCol * (layout.cardWidth + layout.cardGapX);
          const nextFirstTop = layout.margin + extraMargin + (row + 1) * (layout.cardHeight + layout.cardGapY) + ((nextFirstCol % 2 === 0) ? 0 : layout.zigzagOffset);
          
          startX = left + layout.cardWidth / 2;
          startY = top + layout.cardHeight;
          endX = nextFirstLeft + layout.cardWidth / 2;
          endY = nextFirstTop; // top edge of the next card (not under it)
        } else if (col < numColumns - 1) {
          // Same row - connect right to left
          startX = left + layout.cardWidth;
          startY = top + layout.cardHeight / 2;
          endX = nextLeft;
          endY = nextTop + layout.cardHeight / 2;
        } else {
          // Skip connection for last card of odd rows and even rows
          return;
        }

        // Create path
        let pathData;
        
        if ((isLastInRow && !isLastRow) || (isFirstInRow && !isFirstRow)) {
          // Vertical connection for row transitions
          pathData = `M ${startX} ${startY} 
                     C ${startX} ${startY + layout.cardGapY/2},
                       ${endX} ${endY - layout.cardGapY/2},
                       ${endX} ${endY}`;
        } else {
          // Horizontal connection for same row
          pathData = `M ${startX} ${startY} 
                     C ${startX + layout.cardGapX/2} ${startY},
                       ${endX - layout.cardGapX/2} ${endY},
                       ${endX} ${endY}`;
        }

        // Create the main electric cable path
        const cablePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        cablePath.setAttribute('d', pathData);
        cablePath.setAttribute('stroke', 'url(#electricGradient)');
        cablePath.setAttribute('stroke-width', '6');
        cablePath.setAttribute('fill', 'none');
        cablePath.style.filter = 'drop-shadow(0 0 8px rgba(255,255,255,0.8))';
        
        // Create the inner glow path
        const glowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        glowPath.setAttribute('d', pathData);
        glowPath.setAttribute('stroke', '#ffffff');
        glowPath.setAttribute('stroke-width', '2');
        glowPath.setAttribute('fill', 'none');
        glowPath.style.filter = 'blur(2px)';

        svgContainer.appendChild(glowPath);
        svgContainer.appendChild(cablePath);

        // Add random sparkles along the path
        const numSparkles = Math.floor(Math.random() * 5) + 3; // 3-7 sparkles
        for (let i = 0; i < numSparkles; i++) {
          const sparkle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          const t = Math.random(); // Random position along the path
          
          // Calculate position along the path
          const x = startX + (endX - startX) * t;
          const y = startY + (endY - startY) * t;
          
          sparkle.setAttribute('cx', x.toString());
          sparkle.setAttribute('cy', y.toString());
          sparkle.setAttribute('r', (Math.random() * 2 + 1).toString()); // Random size 1-3
          sparkle.setAttribute('fill', '#ffffff');
          sparkle.style.filter = 'blur(1px) drop-shadow(0 0 4px rgba(255,255,255,0.8))';
          
          svgContainer.appendChild(sparkle);
        }

        // For first card of even rows, also create a connection to the next card in the same row
        if (isFirstInRow && row % 2 === 1 && !isLastRow) {
          // Calculate positions for current and next card in the same row
          const nextCardCol = col + 1;
          const nextCardZigzag = (nextCardCol % 2 === 0) ? 0 : layout.zigzagOffset;
          const nextCardLeft = layout.startX + nextCardCol * (layout.cardWidth + layout.cardGapX);
          const nextCardTop = layout.margin + extraMargin + row * (layout.cardHeight + layout.cardGapY) + nextCardZigzag;

          const horizontalPathData = `M ${left + layout.cardWidth} ${top + layout.cardHeight / 2} 
                                    C ${left + layout.cardWidth + layout.cardGapX/2} ${top + layout.cardHeight / 2},
                                      ${nextCardLeft - layout.cardGapX/2} ${nextCardTop + layout.cardHeight / 2},
                                      ${nextCardLeft} ${nextCardTop + layout.cardHeight / 2}`;

          // Create the main electric cable path
          const horizontalCablePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          horizontalCablePath.setAttribute('d', horizontalPathData);
          horizontalCablePath.setAttribute('stroke', 'url(#electricGradient)');
          horizontalCablePath.setAttribute('stroke-width', '6');
          horizontalCablePath.setAttribute('fill', 'none');
          horizontalCablePath.style.filter = 'drop-shadow(0 0 8px rgba(255,255,255,0.8))';
          
          // Create the inner glow path
          const horizontalGlowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          horizontalGlowPath.setAttribute('d', horizontalPathData);
          horizontalGlowPath.setAttribute('stroke', '#ffffff');
          horizontalGlowPath.setAttribute('stroke-width', '2');
          horizontalGlowPath.setAttribute('fill', 'none');
          horizontalGlowPath.style.filter = 'blur(2px)';

          svgContainer.appendChild(horizontalGlowPath);
          svgContainer.appendChild(horizontalCablePath);

          // Add random sparkles along the horizontal path
          const numHorizontalSparkles = Math.floor(Math.random() * 5) + 3;
          for (let i = 0; i < numHorizontalSparkles; i++) {
            const sparkle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            const t = Math.random(); // Random position along the path
            // Calculate position along the path
            const x = (left + layout.cardWidth) + (nextCardLeft - (left + layout.cardWidth)) * t;
            const y = top + layout.cardHeight / 2;
            sparkle.setAttribute('cx', x.toString());
            sparkle.setAttribute('cy', y.toString());
            sparkle.setAttribute('r', (Math.random() * 2 + 1).toString()); // Random size 1-3
            sparkle.setAttribute('fill', '#ffffff');
            sparkle.style.filter = 'blur(1px) drop-shadow(0 0 4px rgba(255,255,255,0.8))';
            svgContainer.appendChild(sparkle);
          }
        }
      }
    });

    // Now render all cards
    arrangedDevices.forEach(({ device, col, row }) => {
      const zigzag = (col % 2 === 0) ? 0 : layout.zigzagOffset;
      const left = layout.startX + col * (layout.cardWidth + layout.cardGapX);
      const top = layout.margin + extraMargin + row * (layout.cardHeight + layout.cardGapY) + zigzag;

      // Get unique colors for this card
      const [color1, color2] = getCardColors(`${device.startYear}${device.name}`);

      const card = document.createElement('div');
      card.style.position = 'absolute';
      card.style.left = `${left}px`;
      card.style.top = `${top}px`;
      card.style.width = `${layout.cardWidth}px`;
      card.style.height = `${layout.cardHeight}px`;
      card.style.background = `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
      card.style.borderRadius = '28px';
      card.style.borderBottomLeftRadius = '10px';
      card.style.borderBottomRightRadius = '10px';
      card.style.boxShadow = `0 8px 32px 0 ${color1}55, 0 2px 8px 0 #0002`;
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.alignItems = 'center';
      card.style.justifyContent = 'flex-start';
      card.style.padding = '0';
      card.style.overflow = 'hidden';
      card.style.gap = '0';
      card.style.border = `4px solid #fff8`;
      card.style.position = 'absolute';
      card.style.zIndex = '2';

      // Title area: year as background watermark, device name on top
      const titleArea = document.createElement('div');
      titleArea.style.position = 'relative';
      titleArea.style.width = '100%';
      titleArea.style.height = '60px';
      titleArea.style.display = 'flex';
      titleArea.style.flexDirection = 'column';
      titleArea.style.alignItems = 'center';
      titleArea.style.justifyContent = 'center';
      titleArea.style.overflow = 'hidden';

      // Year (background watermark)
      const year = document.createElement('div');
      year.textContent = device.startYear.toString();
      year.style.position = 'absolute';
      year.style.top = '-20px';
      year.style.left = '0';
      year.style.width = '100%';
      year.style.height = '100%';
      year.style.fontFamily = 'Arial Black, Arial, sans-serif';
      year.style.fontSize = '60px';
      year.style.fontWeight = 'bold';
      year.style.color = 'rgba(255,255,255,0.22)';
      year.style.textAlign = 'center';
      year.style.letterSpacing = '2px';
      year.style.lineHeight = '60px';
      year.style.userSelect = 'none';
      year.style.pointerEvents = 'none';
      year.style.textShadow = '0 2px 8px #0002';
      titleArea.appendChild(year);

      // Device name (on top)
      const name = document.createElement('div');
      name.textContent = device.name;
      name.style.marginTop = '10px';
      name.style.position = 'relative';
      name.style.fontFamily = 'Arial Black, Arial, sans-serif';
      name.style.fontSize = '18px';
      name.style.fontWeight = 'bold';
      name.style.color = '#fff';
      name.style.textAlign = 'center';
      name.style.overflow = 'hidden';
      name.style.textOverflow = 'ellipsis';
      name.style.display = '-webkit-box';
      name.style.webkitLineClamp = '2';
      name.style.webkitBoxOrient = 'vertical';
      name.style.width = '100%';
      name.style.zIndex = '2';
      name.style.textShadow = '0 2px 8px #0008, 0 1px 0 #fff8';
      name.style.lineHeight = '60px';
      titleArea.appendChild(name);

      card.appendChild(titleArea);

      // Image with glow
      const imgContainer = document.createElement('div');
      imgContainer.style.width = 'calc(100% - 20px)';
      if (device.notes) {
        imgContainer.style.height = '100px';
      } else {
        imgContainer.style.flex = '1 1 auto';
        imgContainer.style.marginBottom = '10px';
      }
      imgContainer.style.display = 'flex';
      imgContainer.style.alignItems = 'center';
      imgContainer.style.justifyContent = 'center';
      imgContainer.style.background = 'rgba(255,255,255,0.25)';
      imgContainer.style.borderRadius = '10px';
      imgContainer.style.position = 'relative';
      imgContainer.style.boxShadow = `0 0 24px 0 ${color2}55`;
      imgContainer.style.marginTop = '15px';

      const img = document.createElement('img');
      img.src = device.imageUrl;
      img.alt = device.name;
      img.style.maxWidth = '80%';
      img.style.width = 'auto';
      img.style.height = 'auto';
      if (device.notes) {
        img.style.minHeight = '90px';
        img.style.maxHeight = '90px';
      } else {
        img.style.maxHeight = '160px';
      }
      img.style.objectFit = 'contain';
      img.style.borderRadius = '12px';
      img.style.boxShadow = `0 0 16px 0 ${color1}55`;
      imgContainer.appendChild(img);
      card.appendChild(imgContainer);

      // Notes area (like a Pokémon card description box)
      if (device.notes) {
        const notes = document.createElement('div');
        notes.textContent = device.notes;
        notes.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        notes.style.fontSize = '13px';
        notes.style.fontWeight = '500';
        notes.style.letterSpacing = '0.01em';
        notes.style.color = '#ffffff';
        notes.style.textShadow = '0 1px 2px rgba(0,0,0,0.3)';
        notes.style.background = 'rgba(255,255,255,0.1)';
        notes.style.borderRadius = '10px';
        notes.style.marginTop = '10px';
        notes.style.flex = '1 1 auto';
        notes.style.overflow = 'hidden';
        notes.style.maxHeight = '80px';
        notes.style.textOverflow = 'ellipsis';
        notes.style.width = 'calc(100% - 16px)';
        notes.style.boxShadow = `0 1px 6px 0 #0001`;
        notes.style.textAlign = 'center';
        notes.style.display = '-webkit-box';
        notes.style.webkitLineClamp = '4';
        notes.style.webkitBoxOrient = 'vertical';
        notes.style.wordBreak = 'break-word';
        card.appendChild(notes);
      }

      // Optional: sparkle overlay
      const sparkle = document.createElement('div');
      sparkle.style.position = 'absolute';
      sparkle.style.left = '0';
      sparkle.style.top = '0';
      sparkle.style.width = '100%';
      sparkle.style.height = '100%';
      sparkle.style.pointerEvents = 'none';
      sparkle.style.background = 'repeating-linear-gradient(135deg,rgba(255,255,255,0.08) 0 2px,transparent 2px 8px)';
      sparkle.style.borderRadius = '28px';
      card.appendChild(sparkle);

      container.appendChild(card);
    });

    // Generate image
    const canvas = await html2canvas(container, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
      useCORS: true,
      width: layout.imageWidth,
      height: imageHeight
    });

    // Clean up
    document.body.removeChild(container);

    // Download image
    try {
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Failed to generate image blob');
        }
        
        // Create object URL from blob
        const url = URL.createObjectURL(blob);
        
        // Create and configure the download link
        const link = document.createElement('a');
        link.download = fileName;
        link.href = url;
        
        // Append to document, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the object URL
        URL.revokeObjectURL(url);
        
      }, 'image/png', 1.0);
    } catch (downloadError) {
      console.error('Error during download:', downloadError);
      throw new Error('Failed to download image. Please try again.');
    }
  } catch (error) {
    console.error('Failed to export LinkedIn image:', error);
  }
};

export const exportAsPDF = async (
  devices: Device[],
  onProgress?: (progress: number) => void
): Promise<void> => {
  try {
    // Create a new PDF document with square page size (1080x1080)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [1080, 1080],
      compress: true
    });

    // Sort devices by year (oldest first)
    const sortedDevices = [...devices].sort((a, b) => a.startYear - b.startYear);

    // Card and layout settings - larger for single card per page
    const cardWidth = 900;
    const cardHeight = 1000;
    const pageWidth = 1080;
    const pageHeight = 1080;
    
    // Calculate margins to center the card both horizontally and vertically
    const marginX = (pageWidth - cardWidth) / 2;
    const marginY = (pageHeight - cardHeight) / 2;

    // Process each device
    for (let i = 0; i < sortedDevices.length; i++) {
      const device = sortedDevices[i];
      
      // Update progress
      const progress = ((i + 1) / sortedDevices.length) * 100;
      onProgress?.(progress);

      // Set dark blue background for the page
      pdf.setFillColor(13, 25, 47); // Dark blue color (#0d192f)
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');

      // Calculate card position (centered on page)
      const left = marginX;
      const top = marginY;

      // Get unique colors for this card
      const [color1, color2] = getCardColors(`${device.startYear}${device.name}`);
      
      // Create a temporary container for the device card
      const container = document.createElement('div');
      container.style.width = `${cardWidth}px`;
      container.style.height = `${cardHeight}px`;
      container.style.background = `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
      container.style.borderRadius = '45px';
      container.style.borderBottomLeftRadius = '22px';
      container.style.borderBottomRightRadius = '22px';
      container.style.boxShadow = `0 8px 32px 0 ${color1}55, 0 2px 8px 0 #0002`;
      container.style.border = '8px solid #fff8';
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.alignItems = 'center';
      container.style.justifyContent = 'flex-start';
      container.style.padding = '0';
      container.style.overflow = 'hidden';
      container.style.gap = '0';
      document.body.appendChild(container);

      // Title area with year watermark
      const titleArea = document.createElement('div');
      titleArea.style.position = 'relative';
      titleArea.style.width = '100%';
      titleArea.style.height = '140px';
      titleArea.style.display = 'flex';
      titleArea.style.flexDirection = 'column';
      titleArea.style.alignItems = 'center';
      titleArea.style.justifyContent = 'center';
      titleArea.style.overflow = 'hidden';

      // Year watermark
      const year = document.createElement('div');
      year.textContent = device.startYear.toString();
      year.style.position = 'absolute';
      year.style.top = '-40px';
      year.style.left = '0';
      year.style.width = '100%';
      year.style.height = '100%';
      year.style.fontFamily = 'Arial Black, Arial, sans-serif';
      year.style.fontSize = '140px';
      year.style.fontWeight = 'bold';
      year.style.color = 'rgba(255,255,255,0.22)';
      year.style.textAlign = 'center';
      year.style.letterSpacing = '4px';
      year.style.lineHeight = '140px';
      year.style.userSelect = 'none';
      year.style.pointerEvents = 'none';
      year.style.textShadow = '0 2px 8px #0002';
      titleArea.appendChild(year);

      // Device name
      const name = document.createElement('div');
      name.textContent = device.name;
      name.style.marginTop = '20px';
      name.style.position = 'relative';
      name.style.fontFamily = 'Arial Black, Arial, sans-serif';
      name.style.fontSize = '42px';
      name.style.fontWeight = 'bold';
      name.style.color = '#fff';
      name.style.textAlign = 'center';
      name.style.overflow = 'hidden';
      name.style.textOverflow = 'ellipsis';
      name.style.display = '-webkit-box';
      name.style.webkitLineClamp = '2';
      name.style.webkitBoxOrient = 'vertical';
      name.style.width = '100%';
      name.style.zIndex = '2';
      name.style.textShadow = '0 2px 8px #0008, 0 1px 0 #fff8';
      name.style.lineHeight = '140px';
      titleArea.appendChild(name);

      container.appendChild(titleArea);

      // Image container with glow
      const imgContainer = document.createElement('div');
      imgContainer.style.width = 'calc(100% - 40px)';
      imgContainer.style.height = device.notes ? '450px' : '650px';
      imgContainer.style.display = 'flex';
      imgContainer.style.alignItems = 'center';
      imgContainer.style.justifyContent = 'center';
      imgContainer.style.background = 'rgba(255,255,255,0.25)';
      imgContainer.style.borderRadius = '22px';
      imgContainer.style.position = 'relative';
      imgContainer.style.boxShadow = `0 0 48px 0 ${color2}55`;
      imgContainer.style.marginTop = '30px';

      const img = document.createElement('img');
      img.src = device.imageUrl;
      img.alt = device.name;
      img.style.maxWidth = '90%';
      img.style.width = 'auto';
      img.style.height = 'auto';
      img.style.maxHeight = device.notes ? '430px' : '630px';
      img.style.objectFit = 'contain';
      img.style.borderRadius = '24px';
      img.style.boxShadow = `0 0 32px 0 ${color1}55`;
      imgContainer.appendChild(img);
      container.appendChild(imgContainer);

      // Notes area (like a Pokémon card description box)
      if (device.notes) {
        const notes = document.createElement('div');
        notes.textContent = device.notes;
        notes.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        notes.style.fontWeight = '500';
        notes.style.letterSpacing = '0.01em';
        notes.style.color = '#ffffff';
        notes.style.textShadow = '0 1px 2px rgba(0,0,0,0.3)';
        notes.style.background = 'rgba(255,255,255,0.1)';
        notes.style.borderRadius = '22px';
        notes.style.marginTop = '20px';
        notes.style.flex = '1 1 auto';
        notes.style.overflow = 'hidden';
        notes.style.maxHeight = '300px';
        notes.style.textOverflow = 'ellipsis';
        notes.style.width = 'calc(100% - 40px)';
        notes.style.boxShadow = `0 1px 6px 0 #0001`;
        notes.style.textAlign = 'center';
        notes.style.display = 'flex';
        notes.style.alignItems = 'center';
        notes.style.justifyContent = 'center';
        notes.style.wordBreak = 'break-word';
        notes.style.padding = '20px';
        notes.style.whiteSpace = 'pre-wrap';
        notes.style.lineHeight = '1.5';
        container.appendChild(notes);

        // Calculate optimal font size based on text length and available space
        const textLength = device.notes.length;
        const availableWidth = notes.clientWidth - 40; // Account for padding
        const availableHeight = notes.clientHeight - 40; // Account for padding
        
        // Calculate font size based on available space and text length
        // We want to fit the text within the available space while maximizing readability
        const maxFontSize = Math.min(
          availableWidth / (textLength * 0.3), // Width-based calculation (0.3 is an average character width factor)
          availableHeight / 2, // Height-based calculation (divide by 2 to account for line height)
          100 // Maximum font size
        );
        
        // Ensure minimum readable size
        const fontSize = Math.max(maxFontSize, 16);
        
        // Apply the calculated font size
        notes.style.fontSize = `${fontSize}px`;
      }

      // Sparkle overlay
      const sparkle = document.createElement('div');
      sparkle.style.position = 'absolute';
      sparkle.style.left = '0';
      sparkle.style.top = '0';
      sparkle.style.width = '100%';
      sparkle.style.height = '100%';
      sparkle.style.pointerEvents = 'none';
      sparkle.style.background = 'repeating-linear-gradient(135deg,rgba(255,255,255,0.08) 0 4px,transparent 4px 16px)';
      sparkle.style.borderRadius = '45px';
      container.appendChild(sparkle);

      // Convert the container to canvas with optimized settings
      const canvas = await html2canvas(container, {
        scale: 1.5, // Reduced from 2 for better performance
        useCORS: true,
        logging: false,
        backgroundColor: '#0d192f', // Match the PDF background color
        width: cardWidth,
        height: cardHeight,
        allowTaint: true, // Allow cross-origin images
        imageTimeout: 0, // No timeout for images
        removeContainer: true, // Automatically remove the container
        onclone: (clonedDoc) => {
          const clonedContainer = clonedDoc.querySelector('div');
          if (clonedContainer) {
            clonedContainer.style.background = `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
            // Add a mask to ensure corners are properly rounded
            clonedContainer.style.maskImage = 'radial-gradient(circle at 50% 50%, black 100%, transparent 100%)';
            clonedContainer.style.webkitMaskImage = 'radial-gradient(circle at 50% 50%, black 100%, transparent 100%)';
          }
        }
      });

      // Add the card to the PDF, centered on the page
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 0.92), // Using JPEG with 92% quality for better performance
        'JPEG',
        left,
        top,
        cardWidth,
        cardHeight
      );

      // Remove the temporary container
      document.body.removeChild(container);

      // Add a new page for each device except the last one
      if (i < sortedDevices.length - 1) {
        pdf.addPage();
        // Set dark blue background for the new page
        pdf.setFillColor(13, 25, 47); // Dark blue color (#0d192f)
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      }
    }

    // Save the PDF
    pdf.save('mytimeline.pdf');
    
    // Set progress to 100% when complete
    onProgress?.(100);
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw error;
  }
};