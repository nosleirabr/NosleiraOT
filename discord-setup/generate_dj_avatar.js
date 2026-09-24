const { createCanvas } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

const W = 1024;
const H = 1024;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

// 1. Fundo escuro com gradiente radial profundo
const bgGrad = ctx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, 600);
bgGrad.addColorStop(0, '#101426');
bgGrad.addColorStop(0.5, '#080a14');
bgGrad.addColorStop(1, '#020307');
ctx.fillStyle = bgGrad;
ctx.fillRect(0, 0, W, H);

// Grade tecnológica suave de fundo
ctx.strokeStyle = 'rgba(0, 210, 255, 0.04)';
ctx.lineWidth = 2;
for (let x = 0; x < W; x += 64) {
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, H);
  ctx.stroke();
}
for (let y = 0; y < H; y += 64) {
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(W, y);
  ctx.stroke();
}

// 2. Anéis de Equalizador Radial (Círculo de Barras de Som 360°)
const cx = W / 2;
const cy = H / 2 - 40;
const numBars = 72;
const radiusInner = 280;

for (let i = 0; i < numBars; i++) {
  const angle = (i / numBars) * Math.PI * 2;
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);
  
  // Altura variada simulando batida de música
  const barHeight = 40 + Math.sin(i * 0.6) * 35 + Math.cos(i * 1.4) * 25 + Math.random() * 20;
  
  const x1 = cx + cos * radiusInner;
  const y1 = cy + sin * radiusInner;
  const x2 = cx + cos * (radiusInner + barHeight);
  const y2 = cy + sin * (radiusInner + barHeight);

  const grad = ctx.createLinearGradient(x1, y1, x2, y2);
  grad.addColorStop(0, '#FF007F'); // Neon Pink
  grad.addColorStop(0.5, '#9B59B6'); // Purple
  grad.addColorStop(1, '#00F0FF'); // Neon Cyan

  ctx.strokeStyle = grad;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.shadowColor = '#00F0FF';
  ctx.shadowBlur = 15;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

// Reseta sombra
ctx.shadowBlur = 0;

// 3. Disco Central / Base Tecnológica
ctx.beginPath();
ctx.arc(cx, cy, radiusInner - 15, 0, Math.PI * 2);
const discGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, radiusInner - 15);
discGrad.addColorStop(0, '#151930');
discGrad.addColorStop(0.7, '#0B0D1A');
discGrad.addColorStop(1, '#05070E');
ctx.fillStyle = discGrad;
ctx.fill();

// Borda brilhante do disco
ctx.strokeStyle = '#00F0FF';
ctx.lineWidth = 5;
ctx.shadowColor = '#00F0FF';
ctx.shadowBlur = 25;
ctx.stroke();

// Anel Interno Dourado
ctx.beginPath();
ctx.arc(cx, cy, radiusInner - 45, 0, Math.PI * 2);
ctx.strokeStyle = '#F1C40F';
ctx.lineWidth = 3;
ctx.shadowColor = '#F1C40F';
ctx.shadowBlur = 15;
ctx.stroke();
ctx.shadowBlur = 0;

// 4. Desenho de Headphone Gamer / DJ Profissional
// Arco do Headphone (Headband)
ctx.beginPath();
ctx.arc(cx, cy - 30, 160, Math.PI * 0.95, Math.PI * 2.05, false);
ctx.lineWidth = 24;
const arcGrad = ctx.createLinearGradient(cx - 160, cy - 190, cx + 160, cy - 190);
arcGrad.addColorStop(0, '#00F0FF');
arcGrad.addColorStop(0.5, '#FFFFFF');
arcGrad.addColorStop(1, '#FF007F');
ctx.strokeStyle = arcGrad;
ctx.shadowColor = '#00F0FF';
ctx.shadowBlur = 30;
ctx.stroke();
ctx.shadowBlur = 0;

// Almofada do Headband (arco interno)
ctx.beginPath();
ctx.arc(cx, cy - 30, 152, Math.PI * 1.05, Math.PI * 1.95, false);
ctx.lineWidth = 8;
ctx.strokeStyle = '#1E2338';
ctx.stroke();

// Conchas laterais do Headphone (Earcups)
function desenharEarcup(x, y, isRight) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(isRight ? 0.2 : -0.2);

  // Glow
  ctx.shadowColor = isRight ? '#FF007F' : '#00F0FF';
  ctx.shadowBlur = 25;

  // Corpo principal da concha
  ctx.fillStyle = '#101424';
  ctx.strokeStyle = isRight ? '#FF007F' : '#00F0FF';
  ctx.lineWidth = 8;

  ctx.beginPath();
  ctx.roundRect(-35, -75, 70, 150, 35);
  ctx.fill();
  ctx.stroke();

  // LED Ring interior da concha
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 3;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.roundRect(-22, -55, 44, 110, 22);
  ctx.stroke();

  // Grade interna do speaker
  ctx.fillStyle = isRight ? 'rgba(255, 0, 127, 0.4)' : 'rgba(0, 240, 255, 0.4)';
  ctx.beginPath();
  ctx.arc(0, 0, 20, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

desenharEarcup(cx - 165, cy - 10, false);
desenharEarcup(cx + 165, cy - 10, true);

// 5. Ícone Central de DJ / Equalizador / Logo no Miolo
// Desenha ondas sonoras centrais estilizadas
ctx.shadowColor = '#00F0FF';
ctx.shadowBlur = 20;
ctx.fillStyle = '#00F0FF';

const barWidth = 10;
const barSpacing = 8;
const bars = [25, 45, 70, 95, 120, 95, 70, 45, 25];
const totalBarsWidth = bars.length * (barWidth + barSpacing) - barSpacing;
const startX = cx - totalBarsWidth / 2;

bars.forEach((bh, idx) => {
  const bx = startX + idx * (barWidth + barSpacing);
  const by = cy - bh / 2 - 20;

  const bGrad = ctx.createLinearGradient(bx, by, bx, by + bh);
  bGrad.addColorStop(0, '#00F0FF');
  bGrad.addColorStop(0.5, '#FFFFFF');
  bGrad.addColorStop(1, '#FF007F');

  ctx.fillStyle = bGrad;
  ctx.beginPath();
  ctx.roundRect(bx, by, barWidth, bh, 5);
  ctx.fill();
});
ctx.shadowBlur = 0;

// 6. Placa / Faixa de Tipografia Premium "NosleiraOT-DJ"
// Base da placa inferior
const bannerY = H - 230;
const bannerW = 780;
const bannerH = 150;
const bannerX = (W - bannerW) / 2;

ctx.save();
ctx.shadowColor = '#00F0FF';
ctx.shadowBlur = 35;

// Fundo da placa
const plateGrad = ctx.createLinearGradient(bannerX, bannerY, bannerX + bannerW, bannerY + bannerH);
plateGrad.addColorStop(0, 'rgba(10, 14, 28, 0.95)');
plateGrad.addColorStop(0.5, 'rgba(16, 22, 45, 0.95)');
plateGrad.addColorStop(1, 'rgba(10, 14, 28, 0.95)');

ctx.fillStyle = plateGrad;
ctx.strokeStyle = '#00F0FF';
ctx.lineWidth = 4;

ctx.beginPath();
ctx.roundRect(bannerX, bannerY, bannerW, bannerH, 24);
ctx.fill();
ctx.stroke();

// Borda interna de destaque neon
ctx.strokeStyle = '#FF007F';
ctx.lineWidth = 2;
ctx.shadowColor = '#FF007F';
ctx.shadowBlur = 15;
ctx.beginPath();
ctx.roundRect(bannerX + 6, bannerY + 6, bannerW - 12, bannerH - 12, 18);
ctx.stroke();

ctx.restore();

// 7. Texto Principal: "NosleiraOT • DJ"
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

// Texto Superior: NOSLEIRAOT
ctx.font = 'bold 54px "Arial Black", "Segoe UI", sans-serif';
ctx.shadowColor = '#00F0FF';
ctx.shadowBlur = 20;

const textGrad = ctx.createLinearGradient(cx - 200, bannerY + 45, cx + 200, bannerY + 45);
textGrad.addColorStop(0, '#FFFFFF');
textGrad.addColorStop(0.5, '#00F0FF');
textGrad.addColorStop(1, '#FFFFFF');

ctx.fillStyle = textGrad;
ctx.fillText('NOSLEIRAOT-DJ', cx, bannerY + 48);

// Subtítulo: • 24/7 MUSIC • 7.4 TIBIA BOT •
ctx.font = 'bold 24px Arial, sans-serif';
ctx.shadowColor = '#FFD700';
ctx.shadowBlur = 15;
ctx.fillStyle = '#FFD700';
ctx.fillText('• 24/7 HIGH FIDELITY MUSIC BOT •', cx, bannerY + 105);

// 8. Partículas e Brilhos de Destaque
ctx.shadowColor = '#00F0FF';
ctx.shadowBlur = 15;
ctx.fillStyle = '#FFFFFF';

const sparkles = [
  { x: cx - 220, y: cy - 140, r: 4 },
  { x: cx + 240, y: cy - 120, r: 5 },
  { x: cx - 280, y: cy + 80, r: 3 },
  { x: cx + 290, y: cy + 60, r: 4 },
  { x: cx, y: cy - 220, r: 6 },
];

sparkles.forEach((s) => {
  ctx.beginPath();
  ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
  ctx.fill();
});

// Salva em PNG de alta resolução 1024x1024
const outputDir = path.join(__dirname, 'assets');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const outputPath = path.join(outputDir, 'nosleira_dj_avatar.png');
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(outputPath, buffer);

console.log(`✅ Avatar de alta qualidade gerado com sucesso em: ${outputPath}`);
