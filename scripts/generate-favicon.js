// This script requires the 'sharp' package to be installed
// Run: pnpm add -D sharp

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdir, writeFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '../public');

// Create a simple favicon with the letter 'U' in a purple circle
async function generateFavicon() {
  try {
    // Create a simple SVG as a base for the favicon
    const svg = `
      <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <circle cx="256" cy="256" r="240" fill="#7c3aed"/>
        <text x="50%" y="50%" font-family="Arial" font-size="280" 
              font-weight="bold" fill="white" text-anchor="middle" dy=".3em">U</text>
      </svg>
    `;

    // Ensure public directory exists
    try {
      await mkdir(publicDir, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }

    // Generate favicon.ico (16x16, 32x32, 48x48)
    const sizes = [16, 32, 48];
    const buffers = await Promise.all(
      sizes.map(size =>
        sharp(Buffer.from(svg))
          .resize(size, size)
          .toFormat('png')
          .toBuffer()
      )
    );

    // Create a simple favicon.ico with the first size (16x16) for compatibility
    await sharp(buffers[0])
      .toFile(join(publicDir, 'favicon.ico'));

    // Also create favicon-32x32.png and favicon-16x16.png
    await sharp(buffers[0])
      .toFile(join(publicDir, 'favicon-16x16.png'));
    
    await sharp(buffers[1])
      .toFile(join(publicDir, 'favicon-32x32.png'));

    // Create apple-touch-icon.png (180x180)
    await sharp(Buffer.from(svg))
      .resize(180, 180)
      .toFile(join(publicDir, 'apple-touch-icon.png'));

    console.log('Successfully generated favicon files');
  } catch (error) {
    console.error('Error generating favicon:', error);
    process.exit(1);
  }
}

// Run the generation
generateFavicon().catch(console.error);
