import fs from 'fs';
import zlib from 'zlib';

function createPng(width, height, drawPixel) {
  // RGBA buffer with filter byte at start of each row
  const rowLength = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowLength);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLength;
    rawData[rowOffset] = 0; // Filter type: None
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawPixel(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  function createChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(12 + len);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    // CRC calculation
    let crc = 0xffffffff;
    for (let i = 4; i < 8 + len; i++) {
      const byte = buf[i];
      crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
    }
    crc = (crc ^ 0xffffffff) >>> 0;
    buf.writeUInt32BE(crc, 8 + len);
    return buf;
  }

  // Precompute CRC table
  const crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    crcTable[n] = c;
  }

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Brand color palette:
// Background: Deep Havana green #0a2e22 (10, 46, 34)
// Border: Gold #e0a93b (224, 169, 59)
// Character skin / clothes / sparks
function drawBrandIcon(x, y, w, h, isMaskable) {
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.hypot(x - cx, y - cy);
  const maxR = w / 2;

  // Background deep Cuban green
  let bgR = 10, bgG = 46, bgB = 34, bgA = 255;

  // Subtle radial vignette in center
  const centerDist = r / maxR;
  if (centerDist < 0.8) {
    bgR = Math.round(10 + (1 - centerDist) * 15);
    bgG = Math.round(46 + (1 - centerDist) * 35);
    bgB = Math.round(34 + (1 - centerDist) * 25);
  }

  // Gold border
  const borderThickness = w * 0.035;
  const borderInset = isMaskable ? w * 0.12 : w * 0.05;
  const inBorder = (x >= borderInset && x <= w - borderInset && y >= borderInset && y <= h - borderInset);
  const onBorderEdge = inBorder && (
    x < borderInset + borderThickness || x > w - borderInset - borderThickness ||
    y < borderInset + borderThickness || y > h - borderInset - borderThickness
  );

  if (onBorderEdge) {
    return [224, 169, 59, 255]; // Gold
  }

  // Inner character glyph / silhouette representation
  // Head
  const headCy = cy - h * 0.08;
  const headR = w * 0.15;
  const distHead = Math.hypot(x - cx, y - headCy);
  if (distHead < headR) {
    // Skin #c98f62 (201, 143, 98)
    return [201, 143, 98, 255];
  }

  // Hair / Welder Mask top
  if (distHead < headR * 1.15 && y < headCy - headR * 0.2) {
    return [25, 25, 25, 255]; // Black hair
  }

  // Welder Mask visor (Green emerald glow #10b981)
  if (y > headCy - headR * 0.5 && y < headCy - headR * 0.1 && Math.abs(x - cx) < headR * 0.6) {
    return [16, 185, 129, 255];
  }

  // Torso / Cuban Shirt (Yellow gold #eab308)
  const torsoTop = headCy + headR * 0.7;
  const torsoBottom = torsoTop + h * 0.22;
  const torsoWidth = w * 0.22;
  if (y >= torsoTop && y <= torsoBottom && Math.abs(x - cx) < torsoWidth) {
    return [234, 179, 8, 255];
  }

  // Spark / Flame on right hand #ffea79 / #ef4444
  const sparkX = cx + w * 0.22;
  const sparkY = cy + h * 0.05;
  const distSpark = Math.hypot(x - sparkX, y - sparkY);
  if (distSpark < w * 0.08) {
    return [255, 180, 50, 255];
  }

  return [bgR, bgG, bgB, bgA];
}

if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

// 1. 192x192
fs.writeFileSync('public/pwa-192x192.png', createPng(192, 192, (x, y, w, h) => drawBrandIcon(x, y, w, h, false)));
console.log('Created public/pwa-192x192.png');

// 2. 512x512
fs.writeFileSync('public/pwa-512x512.png', createPng(512, 512, (x, y, w, h) => drawBrandIcon(x, y, w, h, false)));
console.log('Created public/pwa-512x512.png');

// 3. Maskable 512x512 (with padding for Android round/squircle icon clipping)
fs.writeFileSync('public/pwa-maskable-512x512.png', createPng(512, 512, (x, y, w, h) => drawBrandIcon(x, y, w, h, true)));
console.log('Created public/pwa-maskable-512x512.png');

// 4. Apple Touch Icon 180x180
fs.writeFileSync('public/apple-touch-icon.png', createPng(180, 180, (x, y, w, h) => drawBrandIcon(x, y, w, h, false)));
console.log('Created public/apple-touch-icon.png');
