import { Device, DeviceCategory } from '../types/types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
    "💫 My Technology Journey 💻 Ever wondered how your tech stack evolved? Here's mine! Create your own at https://l2fprod.github.io/my-device-timeline",
    "💫 From floppy disks to cloud storage - here's my tech evolution! 💻 Want to map your own journey? Try https://l2fprod.github.io/my-device-timeline",
    "🚀 My Digital Timeline: A Journey Through Tech 💻 Every device tells a story. What's yours? Create your timeline at https://l2fprod.github.io/my-device-timeline",
    "🚀 The Evolution of My Tech Arsenal 💻 From first computer to latest gadget - here's my journey! Map yours at https://l2fprod.github.io/my-device-timeline",
    "💫 My Tech Timeline: A Story of Innovation 📱 Each device marks a milestone in my digital journey. Start yours at https://l2fprod.github.io/my-device-timeline"
  ];
  return intros[Math.floor(Math.random() * intros.length)];
};

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
  
  output += '#TechJourney #Technology #ProfessionalDevelopment';
  
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
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
};

export const exportAsLinkedInImage = async (devices: Device[], fileName: string = 'tech-timeline.png'): Promise<void> => {
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

    // Sort devices by year (oldest first)
    const sortedDevices = [...devices].sort((a, b) => a.startYear - b.startYear);
    const numCardsPerRow = Math.max(1, Math.floor((layout.imageWidth - layout.margin * 2 + layout.cardGapX) / (layout.cardWidth + layout.cardGapX)));
    const numRows = Math.ceil(sortedDevices.length / numCardsPerRow);
    // Add extra space at the bottom for attribution
    const attributionHeight = 60;
    const imageHeight = layout.margin * 2 + numRows * layout.cardHeight + (numRows - 1) * layout.cardGapY + layout.zigzagOffset + attributionHeight;

    // Calculate total width of all cards in a row and center position
    const totalRowWidth = numCardsPerRow * layout.cardWidth + (numCardsPerRow - 1) * layout.cardGapX;
    layout.startX = Math.max(0, (layout.imageWidth - totalRowWidth) / 2);

    // Arrange devices in rows with alternating directions
    const arrangedDevices: Device[] = [];
    for (let row = 0; row < numRows; row++) {
      const startIdx = row * numCardsPerRow;
      const endIdx = Math.min(startIdx + numCardsPerRow, sortedDevices.length);
      const rowDevices = sortedDevices.slice(startIdx, endIdx);
      
      // For odd rows (1-based), reverse the order
      if (row % 2 === 1) {
        rowDevices.reverse();
      }
      
      arrangedDevices.push(...rowDevices);
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
    svgContainer.style.zIndex = '1';
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

    // Add random lens flares
    const numFlares = Math.floor(Math.random() * 5) + 3; // 3-7 flares
    for (let i = 0; i < numFlares; i++) {
      const x = Math.random() * layout.imageWidth;
      const y = Math.random() * imageHeight;
      const size = Math.random() * 100 + 50; // Random size between 50 and 150
      const flare = createLensFlare(x, y, size);
      svgContainer.appendChild(flare);
    }

    // Add website attribution
    const attribution = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    attribution.setAttribute('x', '50%');
    attribution.setAttribute('y', `${imageHeight - 20}px`);
    attribution.setAttribute('text-anchor', 'middle');
    attribution.setAttribute('fill', 'rgba(255,255,255,0.7)');
    attribution.setAttribute('font-family', 'Arial, sans-serif');
    attribution.setAttribute('font-size', '16');
    attribution.setAttribute('font-weight', 'bold');
    attribution.textContent = 'Create your own at l2fprod.github.io/my-device-timeline';
    attribution.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))';
    svgContainer.appendChild(attribution);

    // Add a subtle glow effect behind the text
    const textGlow = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    textGlow.setAttribute('x', '50%');
    textGlow.setAttribute('y', `${imageHeight - 40}px`);
    textGlow.setAttribute('width', '400');
    textGlow.setAttribute('height', '30');
    textGlow.setAttribute('rx', '15');
    textGlow.setAttribute('fill', 'rgba(0,0,0,0.2)');
    textGlow.setAttribute('transform', 'translate(-200, -15)');
    textGlow.style.filter = 'blur(10px)';
    svgContainer.appendChild(textGlow);

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

    // Add cards in the arranged order
    arrangedDevices.forEach((device, i) => {
      const row = Math.floor(i / numCardsPerRow);
      const col = i % numCardsPerRow;
      const zigzag = (col % 2 === 0) ? 0 : layout.zigzagOffset;
      const left = layout.startX + col * (layout.cardWidth + layout.cardGapX);
      const top = layout.margin + row * (layout.cardHeight + layout.cardGapY) + zigzag;

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

      // Add connecting line if not the last card
      if (i < arrangedDevices.length - 1) {
        const nextRow = Math.floor((i + 1) / numCardsPerRow);
        const nextCol = (i + 1) % numCardsPerRow;
        const nextZigzag = (nextCol % 2 === 0) ? 0 : layout.zigzagOffset;
        const nextLeft = layout.startX + nextCol * (layout.cardWidth + layout.cardGapX);
        const nextTop = layout.margin + nextRow * (layout.cardHeight + layout.cardGapY) + nextZigzag;

        // Calculate start and end points based on position
        let startX, startY, endX, endY;
        
        // Check if this is the last card in a row
        const isLastInRow = col === numCardsPerRow - 1;
        const isFirstInRow = col === 0;
        const isLastRow = row === numRows - 1;
        const isFirstRow = row === 0;
        
        if (isLastInRow && !isLastRow && row % 2 === 0) {
          // Last card in an odd row (except last row) - connect to the last card of next row
          const nextLastCol = numCardsPerRow - 1;
          const nextLastLeft = layout.startX + nextLastCol * (layout.cardWidth + layout.cardGapX);
          const nextLastTop = layout.margin + (row + 1) * (layout.cardHeight + layout.cardGapY) + ((nextLastCol % 2 === 0) ? 0 : layout.zigzagOffset);
          
          startX = left + layout.cardWidth / 2;
          startY = top + layout.cardHeight;
          endX = nextLastLeft + layout.cardWidth / 2;
          endY = nextLastTop;
        } else if (isFirstInRow && !isFirstRow && row % 2 === 1) {
          // First card in an even row (except first row) - connect to the first card of next row
          const nextFirstCol = 0;
          const nextFirstLeft = layout.startX + nextFirstCol * (layout.cardWidth + layout.cardGapX);
          const nextFirstTop = layout.margin + (row + 1) * (layout.cardHeight + layout.cardGapY) + ((nextFirstCol % 2 === 0) ? 0 : layout.zigzagOffset);
          
          startX = left + layout.cardWidth / 2;
          startY = top + layout.cardHeight;
          endX = nextFirstLeft + layout.cardWidth / 2;
          endY = nextFirstTop;
        } else if (col < numCardsPerRow - 1) {
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
          const nextCardLeft = startX + (col + 1) * (layout.cardWidth + layout.cardGapX);
          const nextCardTop = top; // Same row, so same top position

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
    const link = document.createElement('a');
    link.download = fileName;
    link.href = canvas.toDataURL('image/png');
    link.click();
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

    function getCardColors(seed: string) {
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
        backgroundColor: null,
        width: cardWidth,
        height: cardHeight,
        allowTaint: true, // Allow cross-origin images
        imageTimeout: 0, // No timeout for images
        removeContainer: true, // Automatically remove the container
        onclone: (clonedDoc) => {
          const clonedContainer = clonedDoc.querySelector('div');
          if (clonedContainer) {
            clonedContainer.style.background = `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
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
    pdf.save('tech-timeline.pdf');
    
    // Set progress to 100% when complete
    onProgress?.(100);
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw error;
  }
};