const { createCanvas } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

async function createDJRoleIcon() {
    const size = 256;
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2;

    // Clear everything
    ctx.clearRect(0, 0, size, size);

    // Draw outer circle with glow
    ctx.beginPath();
    ctx.arc(cx, cy, radius - 5, 0, Math.PI * 2);
    ctx.closePath();

    // Dark background
    const bgGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    bgGradient.addColorStop(0, '#2a0a4a');
    bgGradient.addColorStop(1, '#0a001a');
    ctx.fillStyle = bgGradient;
    ctx.fill();

    // Glowing border
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#00ffcc';
    ctx.shadowColor = '#00ffcc';
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.stroke(); // Double stroke for more glow
    
    // Reset shadow for text
    ctx.shadowColor = '#00ffcc';
    ctx.shadowBlur = 25;
    ctx.fillStyle = '#ffffff';

    // Draw "DJ" Text
    ctx.font = 'bold 110px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Offset slightly up to make room for equalizer
    ctx.fillText('DJ', cx, cy - 15);
    ctx.fillText('DJ', cx, cy - 15); // Extra fill for more glow intensity
    
    // Equalizer bars
    ctx.shadowColor = '#ff00ff';
    ctx.shadowBlur = 15;
    
    // Create a linear gradient for the equalizer bars
    const eqGradient = ctx.createLinearGradient(0, cy, 0, size);
    eqGradient.addColorStop(0, '#ff00ff');
    eqGradient.addColorStop(1, '#8a008a');
    ctx.fillStyle = eqGradient;
    
    const barWidth = 24;
    const gap = 12;
    const bars = 5;
    const totalWidth = (barWidth * bars) + (gap * (bars - 1));
    const startX = cx - (totalWidth / 2) + (barWidth / 2);
    
    const heights = [30, 60, 45, 75, 40]; // Dynamic looking equalizer
    
    for (let i = 0; i < bars; i++) {
        const x = startX + i * (barWidth + gap) - (barWidth / 2);
        const y = size - 20; // Bottom margin
        const h = heights[i];
        
        ctx.beginPath();
        ctx.roundRect(x, y - h, barWidth, h, [10, 10, 10, 10]); // Rounded corners
        ctx.fill();
    }

    const buffer = await canvas.encode('png');
    
    const assetsDir = path.join(__dirname, 'assets');
    if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
    }
    
    const outputPath = path.join(assetsDir, 'dj_role_icon.png');
    fs.writeFileSync(outputPath, buffer);
    console.log(`Saved DJ Role Icon to ${outputPath}`);
}

createDJRoleIcon().catch(console.error);
