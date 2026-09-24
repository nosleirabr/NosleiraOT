const { createCanvas, loadImage } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

async function createProBanner() {
  const width = 1920;
  const height = 1080;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 1. Fundo Base Gradiente Escuro
  const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 100, width / 2, height / 2, 1100);
  bgGrad.addColorStop(0, '#1a102f');
  bgGrad.addColorStop(0.5, '#0d0b1a');
  bgGrad.addColorStop(1, '#05040a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Carregar Background de Arte se existir
  const welcomePath = path.join(__dirname, 'assets', 'welcome_banner.jpg');
  if (fs.existsSync(welcomePath)) {
    try {
      const bgImg = await loadImage(welcomePath);
      ctx.save();
      ctx.globalAlpha = 0.22;
      // Desenhar com corte panorâmico central
      ctx.drawImage(bgImg, 0, 0, width, height);
      ctx.restore();
    } catch (e) {
      console.log('Bg load error:', e.message);
    }
  }

  // 3. Grid / Scanlines cibernéticas sutis
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();

  // 4. Feixes de Luz e Glows Neon
  const glow1 = ctx.createRadialGradient(450, 450, 50, 450, 450, 500);
  glow1.addColorStop(0, 'rgba(0, 210, 255, 0.25)');
  glow1.addColorStop(1, 'rgba(0, 210, 255, 0)');
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, width, height);

  const glow2 = ctx.createRadialGradient(1450, 450, 50, 1450, 450, 500);
  glow2.addColorStop(0, 'rgba(230, 0, 126, 0.22)');
  glow2.addColorStop(1, 'rgba(230, 0, 126, 0)');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, width, height);

  // 5. Avatar do DJ em Destaque na Esquerda/Centro
  const avatarPath = path.join(__dirname, 'assets', 'nosleira_dj_avatar.png');
  const djAvatarPath = path.join(__dirname, 'assets', 'dj_nosleira_avatar.png');
  const chosenAvatar = fs.existsSync(djAvatarPath) ? djAvatarPath : avatarPath;

  const avX = 400;
  const avY = 540;
  const avRadius = 260;

  if (fs.existsSync(chosenAvatar)) {
    try {
      const avImg = await loadImage(chosenAvatar);

      // Círculo com Glow Neon
      ctx.save();
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 45;
      ctx.beginPath();
      ctx.arc(avX, avY, avRadius + 8, 0, Math.PI * 2);
      ctx.fillStyle = '#00f2fe';
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.shadowColor = '#ff007f';
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.arc(avX, avY, avRadius + 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ff007f';
      ctx.fill();
      ctx.restore();

      // Recorte Circular para a Imagem
      ctx.save();
      ctx.beginPath();
      ctx.arc(avX, avY, avRadius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avImg, avX - avRadius, avY - avRadius, avRadius * 2, avRadius * 2);
      ctx.restore();
    } catch (e) {
      console.log('Avatar load error:', e.message);
    }
  }

  // 6. Bloco de Texto à Direita
  const textX = 760;

  // Badge Superior
  ctx.save();
  ctx.fillStyle = 'rgba(0, 242, 254, 0.12)';
  ctx.strokeStyle = '#00f2fe';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(textX, 290, 480, 50, [25]);
  ctx.fill();
  ctx.stroke();

  // Ponto piscando na badge
  ctx.fillStyle = '#00ff88';
  ctx.beginPath();
  ctx.arc(textX + 30, 315, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('NOSLEIRA OT 7.4  •  RÁDIO & DJ 24/7', textX + 55, 323);
  ctx.restore();

  // Título Principal
  ctx.save();
  ctx.shadowColor = '#00f2fe';
  ctx.shadowBlur = 25;
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 78px sans-serif';
  ctx.fillText('RÁDIO NOSLEIRA', textX, 420);
  ctx.restore();

  ctx.save();
  ctx.shadowColor = '#ff007f';
  ctx.shadowBlur = 25;
  ctx.fillStyle = '#ff007f';
  ctx.font = '900 78px sans-serif';
  ctx.fillText('98.5 FM', textX + 720, 420);
  ctx.restore();

  // Subtítulo
  ctx.save();
  ctx.fillStyle = '#b3b3cc';
  ctx.font = '600 28px sans-serif';
  ctx.fillText('A Trilha Sonora Suprema dos Campeões do Tibia 7.4', textX, 475);
  ctx.restore();

  // Equalizador Gráfico Estilizado
  const eqX = textX;
  const eqY = 560;
  const barCount = 42;
  const barWidth = 14;
  const barGap = 8;

  for (let i = 0; i < barCount; i++) {
    // Alturas simulando batida de som
    const norm = Math.sin((i / barCount) * Math.PI);
    const wave = Math.abs(Math.sin(i * 0.7) * 0.5 + Math.cos(i * 1.3) * 0.5);
    const barHeight = 25 + norm * wave * 130;

    const barGrad = ctx.createLinearGradient(0, eqY + 60, 0, eqY + 60 - barHeight);
    barGrad.addColorStop(0, '#00f2fe');
    barGrad.addColorStop(0.5, '#7f00ff');
    barGrad.addColorStop(1, '#ff007f');

    ctx.save();
    ctx.fillStyle = barGrad;
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.roundRect(eqX + i * (barWidth + barGap), eqY + 60 - barHeight, barWidth, barHeight, [4]);
    ctx.fill();
    ctx.restore();
  }

  // Tags de Recursos no Rodapé do Banner
  const tags = [
    '⚡ Fila Fair Play (!play)',
    '📻 6 Estações 24h',
    '🔊 Áudio HD 320kbps',
    '🛡️ 100% Anti-Queda',
  ];

  let tagOffset = textX;
  ctx.font = 'bold 20px sans-serif';
  for (const tag of tags) {
    const tagWidth = ctx.measureText(tag).width + 36;

    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(tagOffset, 710, tagWidth, 42, [10]);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(tag, tagOffset + 18, 738);
    ctx.restore();

    tagOffset += tagWidth + 16;
  }

  // 7. Moldura Externa Elegante com Cantos Neon
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  // Cantoneiras douradas / neon
  const cornerLen = 60;
  ctx.strokeStyle = '#00f2fe';
  ctx.lineWidth = 5;

  // Canto Sup Esq
  ctx.beginPath();
  ctx.moveTo(40, 40 + cornerLen);
  ctx.lineTo(40, 40);
  ctx.lineTo(40 + cornerLen, 40);
  ctx.stroke();

  // Canto Sup Dir
  ctx.beginPath();
  ctx.moveTo(width - 40 - cornerLen, 40);
  ctx.lineTo(width - 40, 40);
  ctx.lineTo(width - 40, 40 + cornerLen);
  ctx.stroke();

  // Canto Inf Esq
  ctx.beginPath();
  ctx.moveTo(40, height - 40 - cornerLen);
  ctx.lineTo(40, height - 40);
  ctx.lineTo(40 + cornerLen, height - 40);
  ctx.stroke();

  // Canto Inf Dir
  ctx.beginPath();
  ctx.moveTo(width - 40 - cornerLen, height - 40);
  ctx.lineTo(width - 40, height - 40);
  ctx.lineTo(width - 40, height - 40 - cornerLen);
  ctx.stroke();
  ctx.restore();

  // Salvar Banner Final
  const outPath = path.join(__dirname, 'assets', 'dj_nosleira_banner_pro.png');
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outPath, buffer);

  // Também salvar como dj_nosleira_banner.png para atualizar padrão
  fs.writeFileSync(path.join(__dirname, 'assets', 'dj_nosleira_banner.png'), buffer);

  // Copiar para artifacts
  const artifactPath = 'C:/Users/ariel/.gemini/antigravity/brain/e54b3b35-e395-4e0b-b74e-6bc650c43f1f/dj_nosleira_banner_pro.png';
  try {
    fs.writeFileSync(artifactPath, buffer);
  } catch (e) {}

  console.log('✅ Banner Pro do DJ gerado com sucesso em:', outPath);
}

createProBanner().catch(console.error);
