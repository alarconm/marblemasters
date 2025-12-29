/**
 * Icon Generation Script for Marble Masters
 *
 * This script generates all required icon sizes from the source SVG.
 *
 * Prerequisites:
 * npm install sharp
 *
 * Usage:
 * node scripts/generate-icons.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Icon sizes needed for PWA and iOS
const sizes = [
  72, 96, 128, 144, 152, 167, 180, 192, 384, 512, 1024
];

// iOS-specific sizes
const iosSizes = [
  { size: 20, scale: [1, 2, 3] },    // Notification
  { size: 29, scale: [1, 2, 3] },    // Settings
  { size: 40, scale: [1, 2, 3] },    // Spotlight
  { size: 60, scale: [2, 3] },       // iPhone App
  { size: 76, scale: [1, 2] },       // iPad App
  { size: 83.5, scale: [2] },        // iPad Pro App
  { size: 1024, scale: [1] },        // App Store
];

const inputSvg = path.join(__dirname, '../public/favicon.svg');
const outputDir = path.join(__dirname, '../public/icons');
const iosOutputDir = path.join(__dirname, '../ios-icons');

async function generateIcons() {
  // Create output directories
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  if (!fs.existsSync(iosOutputDir)) {
    fs.mkdirSync(iosOutputDir, { recursive: true });
  }

  console.log('Generating PWA icons...');

  // Generate PWA icons
  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
    await sharp(inputSvg)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`  Created: icon-${size}x${size}.png`);
  }

  // Generate apple-touch-icon (180x180)
  await sharp(inputSvg)
    .resize(180, 180)
    .png()
    .toFile(path.join(__dirname, '../public/apple-touch-icon.png'));
  console.log('  Created: apple-touch-icon.png');

  console.log('\nGenerating iOS icons...');

  // Generate iOS icons
  for (const { size, scale } of iosSizes) {
    for (const s of scale) {
      const pixelSize = Math.round(size * s);
      const filename = `icon-${size}@${s}x.png`;
      const outputPath = path.join(iosOutputDir, filename);

      await sharp(inputSvg)
        .resize(pixelSize, pixelSize)
        .png()
        .toFile(outputPath);
      console.log(`  Created: ${filename} (${pixelSize}x${pixelSize})`);
    }
  }

  console.log('\nAll icons generated successfully!');
  console.log(`\nPWA icons: ${outputDir}`);
  console.log(`iOS icons: ${iosOutputDir}`);
}

generateIcons().catch(console.error);
