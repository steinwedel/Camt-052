#!/usr/bin/env node

/**
 * Icon Creator für CAMT.052 Viewer
 * Erstellt ein einfaches Bank-Icon mit Sharp
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createBankIcon() {
    console.log('Erstelle Bank-Icon...');
    
    // Create SVG with bank theme
    const svgIcon = `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
        <!-- Blue background circle -->
        <circle cx="256" cy="256" r="240" fill="#2563eb"/>
        
        <!-- Bank building -->
        <g>
            <!-- Roof triangle -->
            <path d="M 136 220 L 256 160 L 376 220 Z" fill="#ffffff"/>
            
            <!-- Columns -->
            <rect x="156" y="230" width="24" height="120" fill="#ffffff"/>
            <rect x="216" y="230" width="24" height="120" fill="#ffffff"/>
            <rect x="276" y="230" width="24" height="120" fill="#ffffff"/>
            <rect x="336" y="230" width="24" height="120" fill="#ffffff"/>
            
            <!-- Base -->
            <rect x="136" y="355" width="240" height="20" fill="#ffffff"/>
            
            <!-- Euro symbol - sehr groß und dominant -->
            <text x="256" y="310" font-family="Arial" font-size="240" font-weight="bold" fill="#fbbf24" text-anchor="middle">€</text>
        </g>
    </svg>
    `;
    
    const buildDir = path.join(__dirname, 'build');
    
    // Ensure build directory exists
    if (!fs.existsSync(buildDir)) {
        fs.mkdirSync(buildDir);
    }
    
    try {
        // Create PNG from SVG
        await sharp(Buffer.from(svgIcon))
            .resize(512, 512)
            .png()
            .toFile(path.join(buildDir, 'icon.png'));
        
        console.log('✓ icon.png erstellt (512x512)');
        
        // Create additional sizes for iconset
        const sizes = [16, 32, 64, 128, 256, 512, 1024];
        const iconsetDir = path.join(buildDir, 'icon.iconset');
        
        if (!fs.existsSync(iconsetDir)) {
            fs.mkdirSync(iconsetDir);
        }
        
        for (const size of sizes) {
            await sharp(Buffer.from(svgIcon))
                .resize(size, size)
                .png()
                .toFile(path.join(iconsetDir, `icon_${size}x${size}.png`));
            
            // Also create @2x versions for retina
            if (size <= 512) {
                await sharp(Buffer.from(svgIcon))
                    .resize(size * 2, size * 2)
                    .png()
                    .toFile(path.join(iconsetDir, `icon_${size}x${size}@2x.png`));
            }
        }
        
        console.log('✓ Iconset erstellt für macOS');
        console.log('');
        console.log('Nächste Schritte:');
        console.log('1. Für macOS ICNS: iconutil -c icns build/icon.iconset -o build/icon.icns');
        console.log('2. Für Windows ICO: Verwenden Sie ein Online-Tool oder ImageMagick');
        console.log('   convert build/icon.png -define icon:auto-resize=256,128,64,48,32,16 build/icon.ico');
        console.log('');
        console.log('Oder installieren Sie electron-icon-builder:');
        console.log('npm install -g electron-icon-builder');
        console.log('electron-icon-builder --input=build/icon.png --output=build');
        
    } catch (error) {
        console.error('Fehler beim Erstellen der Icons:', error.message);
        process.exit(1);
    }
}

createBankIcon();