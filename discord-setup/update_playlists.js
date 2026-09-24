const fs = require('fs');

let bot = fs.readFileSync('d:/Server/discord-setup/radio_bot.js', 'utf8');

// Replace PLAYLISTS_RADIO
const startIdx = bot.indexOf('const PLAYLISTS_RADIO = {');
const endIdx = bot.indexOf('};', startIdx) + 2;

const newPlaylists = `const PLAYLISTS_RADIO = {
  sertanejo: {
    id: 'sertanejo',
    nome: '🤠 Sertanejo & Modão Raiz',
    frequencia: '98.1 FM',
    genero: 'Sertanejo Raiz • Modão de Viola • Universitário',
    cor: '#E67E22',
    emoji: '🤠',
    artistas: 'Chitãozinho & Xororó, Tião Carreiro, Gusttavo Lima, Jorge & Mateus',
    streamUrl: 'https://live.hunter.fm/sertanejo_high',
  },
  rock: {
    id: 'rock',
    nome: '🎸 Rock Clássico 80s/90s',
    frequencia: '98.3 FM',
    genero: 'Classic Rock • Hard Rock • Heavy Metal',
    cor: '#E74C3C',
    emoji: '🎸',
    artistas: 'Queen, AC/DC, Guns N\\' Roses, Scorpions, Iron Maiden',
    streamUrl: 'https://live.hunter.fm/rock_high',
  },
  pop: {
    id: 'pop',
    nome: '🎧 Pop & Hits Mundiais',
    frequencia: '98.5 FM',
    genero: 'Top Brasil • Pop Global • Billboard Hits',
    cor: '#3498DB',
    emoji: '🎧',
    artistas: 'Coldplay, Bruno Mars, Dua Lipa, The Weeknd',
    streamUrl: 'https://live.hunter.fm/pop_high',
  },
  pagode: {
    id: 'pagode',
    nome: '🪘 Pagode & Samba de Raiz',
    frequencia: '98.7 FM',
    genero: 'Pagode 90 • Samba de Roda',
    cor: '#1ABC9C',
    emoji: '🪘',
    artistas: 'Exaltasamba, Revelação, Raça Negra, Zeca Pagodinho',
    streamUrl: 'https://live.hunter.fm/pagode_high',
  },
  forro: {
    id: 'forro',
    nome: '🪗 Forró & Piseiro',
    frequencia: '98.8 FM',
    genero: 'Forró Pé de Serra • Piseiro',
    cor: '#2ECC71',
    emoji: '🪗',
    artistas: 'Luiz Gonzaga, Barões da Pisadinha, João Gomes',
    streamUrl: 'https://live.hunter.fm/pisadinha_high',
  },
  eletronica: {
    id: 'eletronica',
    nome: '⚡ Eletrônica & EDM',
    frequencia: '98.9 FM',
    genero: 'Dance • EDM • Trance • House',
    cor: '#00D2FF',
    emoji: '⚡',
    artistas: 'David Guetta, Avicii, Tiësto, Alok, Vintage Culture',
    streamUrl: 'http://ice1.somafm.com/thetrip-128-mp3',
  }
};`;

bot = bot.substring(0, startIdx) + newPlaylists + bot.substring(endIdx);

// Replace addOptions
const optStart = bot.indexOf('.addOptions(');
const optEnd = bot.indexOf(');', optStart) + 2;

const newOptions = `.addOptions(
      { label: 'Sertanejo & Modão (98.1 FM)', description: 'Chitãozinho & Xororó, Tião Carreiro, Gusttavo Lima', value: 'sertanejo', emoji: '🤠' },
      { label: 'Rock Clássico 80s/90s (98.3 FM)', description: 'Queen, AC/DC, Guns N\\' Roses, Iron Maiden', value: 'rock', emoji: '🎸' },
      { label: 'Pop & Hits Mundiais (98.5 FM)', description: 'Coldplay, Bruno Mars, Dua Lipa, Top Brasil', value: 'pop', emoji: '🎧' },
      { label: 'Pagode & Samba (98.7 FM)', description: 'Raça Negra, Exaltasamba, Zeca Pagodinho', value: 'pagode', emoji: '🪘' },
      { label: 'Forró & Piseiro (98.8 FM)', description: 'Luiz Gonzaga, Barões da Pisadinha, João Gomes', value: 'forro', emoji: '🪗' },
      { label: 'Eletrônica & EDM (98.9 FM)', description: 'Daft Punk, David Guetta, Avicii, Tiësto, Alok', value: 'eletronica', emoji: '⚡' }
    );`;

bot = bot.substring(0, optStart) + newOptions + bot.substring(optEnd);

fs.writeFileSync('d:/Server/discord-setup/radio_bot.js', bot);
console.log('Playlists updated successfully');
