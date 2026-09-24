const { createCanvas } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, 'assets');
if (!fs.existsSync(ASSETS_DIR)) fs.mkdirSync(ASSETS_DIR, { recursive: true });

// ─────────────────────────────────────────────
// 1. GERAR AVATAR DO DJ (1024 x 1024 - HD 1:1)
// ─────────────────────────────────────────────
function gerarAvatarDJ() {
  const width = 1024;
  const height = 1024;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Fundo Gradiente Radial Escuro / Neon Cyberpunk Medieval
  const bgGrad = ctx.createRadialGradient(512, 512, 100, 512, 512, 600);
  bgGrad.addColorStop(0, '#1a103c');
  bgGrad.addColorStop(0.5, '#0c071e');
  bgGrad.addColorStop(1, '#05020a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Efeito de Grade / Soundwaves de fundo
  ctx.strokeStyle = 'rgba(145, 70, 255, 0.15)';
  ctx.lineWidth = 2;
  for (let i = 0; i < width; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, height);
    ctx.stroke();
  }
  for (let j = 0; j < height; j += 40) {
    ctx.beginPath();
    ctx.moveTo(0, j);
    ctx.lineTo(width, j);
    ctx.stroke();
  }

  // Círculos de Vinil Místico / Rúnico
  ctx.save();
  ctx.translate(512, 512);

  // Brilho Neon Externo (Cyan / Purple)
  const glow = ctx.createRadialGradient(0, 0, 280, 0, 0, 420);
  glow.addColorStop(0, 'rgba(0, 210, 255, 0.4)');
  glow.addColorStop(0.6, 'rgba(145, 70, 255, 0.3)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, 420, 0, Math.PI * 2);
  ctx.fill();

  // Disco de Vinil Dourado / Tibiano
  const vinilGrad = ctx.createRadialGradient(0, 0, 50, 0, 0, 360);
  vinilGrad.addColorStop(0, '#2d1808');
  vinilGrad.addColorStop(0.3, '#110b18');
  vinilGrad.addColorStop(0.7, '#1f132e');
  vinilGrad.addColorStop(0.9, '#3a1e5c');
  vinilGrad.addColorStop(1, '#00d2ff');

  ctx.fillStyle = vinilGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 360, 0, Math.PI * 2);
  ctx.fill();

  // Sulcos de Vinil
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.25)';
  ctx.lineWidth = 3;
  for (let r = 120; r < 340; r += 24) {
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Ondas de Equalizador em Círculo
  const numBars = 48;
  ctx.lineWidth = 6;
  for (let b = 0; b < numBars; b++) {
    const angle = (b / numBars) * Math.PI * 2;
    const hBar = 25 + Math.sin(b * 1.5) * 20 + Math.cos(b * 0.8) * 15;
    const r1 = 370;
    const r2 = r1 + hBar;

    const x1 = Math.cos(angle) * r1;
    const y1 = Math.sin(angle) * r1;
    const x2 = Math.cos(angle) * r2;
    const y2 = Math.sin(angle) * r2;

    const barGrad = ctx.createLinearGradient(x1, y1, x2, y2);
    barGrad.addColorStop(0, '#00d2ff');
    barGrad.addColorStop(0.5, '#9b59b6');
    barGrad.addColorStop(1, '#ff007f');

    ctx.strokeStyle = barGrad;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // Fones de Ouvido Neon (Headphones do DJ)
  // Arco do fone
  ctx.strokeStyle = '#00d2ff';
  ctx.lineWidth = 26;
  ctx.beginPath();
  ctx.arc(0, -20, 280, Math.PI * 1.05, Math.PI * 1.95);
  ctx.stroke();

  // Almofada esquerda
  ctx.fillStyle = '#ff007f';
  ctx.beginPath();
  ctx.roundRect(-300, -80, 50, 140, 20);
  ctx.fill();

  // Almofada direita
  ctx.fillStyle = '#ff007f';
  ctx.beginPath();
  ctx.roundRect(250, -80, 50, 140, 20);
  ctx.fill();

  // Núcleo Central do Selo com Ícone Medieval
  ctx.fillStyle = '#0a0515';
  ctx.beginPath();
  ctx.arc(0, 0, 130, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Frequência Central 98 FM
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 64px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('98', 0, -18);

  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 30px Arial, sans-serif';
  ctx.fillText('FM', 0, 38);

  ctx.restore();

  // Tipografia Inferior: DJ NOSLEIRA
  ctx.textAlign = 'center';
  ctx.shadowColor = '#00d2ff';
  ctx.shadowBlur = 25;
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 68px Arial, sans-serif';
  ctx.fillText('DJ NOSLEIRA', 512, 910);

  ctx.shadowColor = '#ff007f';
  ctx.shadowBlur = 15;
  ctx.fillStyle = '#00d2ff';
  ctx.font = 'bold 36px Arial, sans-serif';
  ctx.fillText('• 24/7 LIVE STREAM •', 512, 965);

  const outPath = path.join(ASSETS_DIR, 'dj_nosleira_avatar.png');
  fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log(`✅ Avatar do DJ gerado em alta definição: ${outPath}`);
}

// ─────────────────────────────────────────────
// 2. GERAR CAPA / BANNER DO DJ (1920 x 1080 - 16:9)
// ─────────────────────────────────────────────
function gerarBannerDJ() {
  const width = 1920;
  const height = 1080;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Gradiente de Fundo
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#0a0418');
  bgGrad.addColorStop(0.3, '#13082a');
  bgGrad.addColorStop(0.7, '#1b0a38');
  bgGrad.addColorStop(1, '#05020c');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Luzes Volumétricas Neon no Topo
  for (let s = 0; s < 5; s++) {
    const xSpot = 300 + s * 340;
    const spot = ctx.createRadialGradient(xSpot, 0, 50, xSpot, 600, 600);
    const cores = ['rgba(0, 210, 255, 0.18)', 'rgba(155, 89, 182, 0.18)', 'rgba(255, 0, 127, 0.18)', 'rgba(241, 196, 15, 0.18)', 'rgba(46, 204, 113, 0.18)'];
    spot.addColorStop(0, cores[s % cores.length]);
    spot.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = spot;
    ctx.fillRect(0, 0, width, height);
  }

  // Ondas de Som Gráficas Centrais (Waveform)
  const numWaveBars = 72;
  const startX = 260;
  const endX = 1660;
  const stepX = (endX - startX) / numWaveBars;
  const midY = 560;

  for (let i = 0; i < numWaveBars; i++) {
    const x = startX + i * stepX;
    const progress = i / numWaveBars;
    const h = 40 + Math.sin(progress * Math.PI * 4) * 160 * Math.sin(progress * Math.PI) + (i % 3) * 35;

    const waveGrad = ctx.createLinearGradient(x, midY - h, x, midY + h);
    waveGrad.addColorStop(0, '#00d2ff');
    waveGrad.addColorStop(0.5, '#9b59b6');
    waveGrad.addColorStop(1, '#ff007f');

    ctx.fillStyle = waveGrad;
    ctx.beginPath();
    ctx.roundRect(x, midY - h / 2, stepX * 0.7, h, 6);
    ctx.fill();
  }

  // Moldura Central Elegante
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
  ctx.lineWidth = 3;
  ctx.strokeRect(100, 80, width - 200, height - 160);

  // Cantoneiras Medievais
  const cornerSize = 40;
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 6;

  // TL
  ctx.beginPath(); ctx.moveTo(90, 130); ctx.lineTo(90, 70); ctx.lineTo(150, 70); ctx.stroke();
  // TR
  ctx.beginPath(); ctx.moveTo(width - 150, 70); ctx.lineTo(width - 90, 70); ctx.lineTo(width - 90, 130); ctx.stroke();
  // BL
  ctx.beginPath(); ctx.moveTo(90, height - 130); ctx.lineTo(90, height - 70); ctx.lineTo(150, height - 70); ctx.stroke();
  // BR
  ctx.beginPath(); ctx.moveTo(width - 150, height - 70); ctx.lineTo(width - 90, height - 70); ctx.lineTo(width - 90, height - 130); ctx.stroke();

  // Título Principal
  ctx.textAlign = 'center';
  ctx.shadowColor = '#00d2ff';
  ctx.shadowBlur = 30;
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 110px Arial, sans-serif';
  ctx.fillText('RÁDIO NOSLEIRA 98 FM', width / 2, 230);

  // Subtítulo
  ctx.shadowColor = '#ffd700';
  ctx.shadowBlur = 20;
  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 44px Arial, sans-serif';
  ctx.fillText('A TRILHA SONORA OFICIAL DO NOSLEIRA OT 7.4', width / 2, 310);

  // Tags de Estações Musicais
  ctx.shadowBlur = 10;
  ctx.font = 'bold 32px Arial, sans-serif';

  const tags = [
    { text: '🤠 Sertanejo & Modão', color: '#e67e22', x: 380, y: 820 },
    { text: '🎸 Rock Clássico 80s', color: '#e74c3c', x: 740, y: 820 },
    { text: '📻 Flashback & Synth', color: '#9b59b6', x: 1120, y: 820 },
    { text: '🎧 Pop Hits', color: '#3498db', x: 1460, y: 820 },
    { text: '🛡️ Tibia RPG Lo-Fi', color: '#2ecc71', x: 1720, y: 820 },
  ];

  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = 'bold 30px Arial, sans-serif';
  ctx.fillText('🤠 SERTANEJO  •  🎸 ROCK 80s/90s  •  📻 FLASHBACK  •  🎧 POP HITS  •  🛡️ TIBIA LO-FI', width / 2, 830);

  // Rodapé Live
  ctx.shadowColor = '#ff007f';
  ctx.shadowBlur = 20;
  ctx.fillStyle = '#ff007f';
  ctx.font = '900 34px Arial, sans-serif';
  ctx.fillText('🔴 TRANSMISSÃO 24 HORAS AO VIVO • QUALIDADE HQ OPUS • COMANDOS: !radio', width / 2, 940);

  const outPath = path.join(ASSETS_DIR, 'dj_nosleira_banner.png');
  fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log(`✅ Capa/Banner do DJ gerado em alta definição: ${outPath}`);
}

gerarAvatarDJ();
gerarBannerDJ();
