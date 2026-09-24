const { createCanvas, loadImage } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

async function createDiscordFaixa() {
  // Proporção oficial Discord Faixa: 17:6 -> 1360 x 480 (2x HD)
  const width = 1360;
  const height = 480;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 1. Fundo Gradiente Cyber Dark
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#0a0614');
  bgGrad.addColorStop(0.5, '#120b24');
  bgGrad.addColorStop(1, '#05030a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Fundo 3D Game Art Suave
  const welcomePath = path.join(__dirname, 'assets', 'welcome_banner.jpg');
  if (fs.existsSync(welcomePath)) {
    try {
      const bgImg = await loadImage(welcomePath);
      ctx.save();
      ctx.globalAlpha = 0.28;
      ctx.drawImage(bgImg, 0, -100, width, height + 200);
      ctx.restore();
    } catch (e) {}
  }

  // 3. Efeitos de Luz / Glows Laterais
  const glowL = ctx.createRadialGradient(200, 240, 20, 200, 240, 350);
  glowL.addColorStop(0, 'rgba(0, 242, 254, 0.35)');
  glowL.addColorStop(1, 'rgba(0, 242, 254, 0)');
  ctx.fillStyle = glowL;
  ctx.fillRect(0, 0, width, height);

  const glowR = ctx.createRadialGradient(1160, 240, 20, 1160, 240, 350);
  glowR.addColorStop(0, 'rgba(255, 0, 127, 0.35)');
  glowR.addColorStop(1, 'rgba(255, 0, 127, 0)');
  ctx.fillStyle = glowR;
  ctx.fillRect(0, 0, width, height);

  // 4. Avatar Redondo com Borda Neon à Esquerda
  const djAvatarPath = path.join(__dirname, 'assets', 'dj_nosleira_avatar.png');
  const avatarPath = path.join(__dirname, 'assets', 'nosleira_dj_avatar.png');
  const chosenAvatar = fs.existsSync(djAvatarPath) ? djAvatarPath : avatarPath;

  const avX = 220;
  const avY = 240;
  const avRadius = 160;

  if (fs.existsSync(chosenAvatar)) {
    try {
      const avImg = await loadImage(chosenAvatar);

      // Glow Ciano
      ctx.save();
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 35;
      ctx.beginPath();
      ctx.arc(avX, avY, avRadius + 6, 0, Math.PI * 2);
      ctx.fillStyle = '#00f2fe';
      ctx.fill();
      ctx.restore();

      // Glow Rosa
      ctx.save();
      ctx.shadowColor = '#ff007f';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(avX, avY, avRadius + 3, 0, Math.PI * 2);
      ctx.fillStyle = '#ff007f';
      ctx.fill();
      ctx.restore();

      // Recorte Circular do Avatar
      ctx.save();
      ctx.beginPath();
      ctx.arc(avX, avY, avRadius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avImg, avX - avRadius, avY - avRadius, avRadius * 2, avRadius * 2);
      ctx.restore();
    } catch (e) {}
  }

  // 5. Informações e Textos à Direita
  const textX = 440;

  // Badge Topo
  ctx.save();
  ctx.fillStyle = 'rgba(0, 242, 254, 0.15)';
  ctx.strokeStyle = '#00f2fe';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(textX, 85, 380, 42, [21]);
  ctx.fill();
  ctx.stroke();

  // Ponto Verde Online
  ctx.fillStyle = '#00ff88';
  ctx.beginPath();
  ctx.arc(textX + 24, 106, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('NOSLEIRA OT 7.4  •  RÁDIO & DJ 24/7', textX + 44, 112);
  ctx.restore();

  // Título
  ctx.save();
  ctx.shadowColor = '#00f2fe';
  ctx.shadowBlur = 20;
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 62px sans-serif';
  ctx.fillText('RÁDIO NOSLEIRA', textX, 195);
  ctx.restore();

  ctx.save();
  ctx.shadowColor = '#ff007f';
  ctx.shadowBlur = 20;
  ctx.fillStyle = '#ff007f';
  ctx.font = '900 62px sans-serif';
  ctx.fillText('98.5 FM', textX + 570, 195);
  ctx.restore();

  // Subtítulo
  ctx.save();
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '600 24px sans-serif';
  ctx.fillText('A Trilha Sonora Suprema dos Campeões do Tibia 7.4', textX, 240);
  ctx.restore();

  // Equalizador Gráfico Neon
  const eqX = textX;
  const eqY = 295;
  const barCount = 36;
  const barWidth = 14;
  const barGap = 8;

  for (let i = 0; i < barCount; i++) {
    const norm = Math.sin((i / barCount) * Math.PI);
    const wave = Math.abs(Math.sin(i * 0.7) * 0.5 + Math.cos(i * 1.3) * 0.5);
    const barHeight = 15 + norm * wave * 75;

    const barGrad = ctx.createLinearGradient(0, eqY + 40, 0, eqY + 40 - barHeight);
    barGrad.addColorStop(0, '#00f2fe');
    barGrad.addColorStop(0.5, '#9d4edd');
    barGrad.addColorStop(1, '#ff007f');

    ctx.save();
    ctx.fillStyle = barGrad;
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.roundRect(eqX + i * (barWidth + barGap), eqY + 40 - barHeight, barWidth, barHeight, [3]);
    ctx.fill();
    ctx.restore();
  }

  // Tags Inferiores
  const tags = ['⚡ Fila Fair Play (!play)', '📻 6 Estações 24/7', '🔊 Áudio HD 320kbps'];
  let tagOff = textX;
  ctx.font = 'bold 16px sans-serif';
  for (const tag of tags) {
    const tw = ctx.measureText(tag).width + 30;
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(tagOff, 395, tw, 36, [8]);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f1f5f9';
    ctx.fillText(tag, tagOff + 15, 419);
    ctx.restore();

    tagOff += tw + 14;
  }

  // 6. Moldura com Cantos Neon
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  const cLen = 40;
  ctx.strokeStyle = '#00f2fe';
  ctx.lineWidth = 4;

  ctx.beginPath();
  ctx.moveTo(20, 20 + cLen);
  ctx.lineTo(20, 20);
  ctx.lineTo(20 + cLen, 20);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(width - 20 - cLen, 20);
  ctx.lineTo(width - 20, 20);
  ctx.lineTo(width - 20, 20 + cLen);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(20, height - 20 - cLen);
  ctx.lineTo(20, height - 20);
  ctx.lineTo(20 + cLen, height - 20);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(width - 20 - cLen, height - 20);
  ctx.lineTo(width - 20, height - 20);
  ctx.lineTo(width - 20, height - 20 - cLen);
  ctx.stroke();
  ctx.restore();

  const outPath = path.join(__dirname, 'assets', 'faixa_discord_nosleira_dj.png');
  const buf = canvas.toBuffer('image/png');
  fs.writeFileSync(outPath, buf);

  const artPath = 'C:/Users/ariel/.gemini/antigravity/brain/e54b3b35-e395-4e0b-b74e-6bc650c43f1f/faixa_discord_nosleira_dj.png';
  try {
    fs.writeFileSync(artPath, buf);
  } catch (e) {}

  console.log('✅ Faixa 17:6 gerada com sucesso em:', outPath);
}

createDiscordFaixa().catch(console.error);
