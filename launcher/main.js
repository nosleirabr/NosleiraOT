const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    frame: false, // Sem a barra padrão do Windows para ser mais imersivo
    resizable: false
  });

  win.loadFile('src/index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC communication example for launching the game
ipcMain.on('launch-game', (event, version) => {
  console.log(`Lançando o jogo na versão: ${version}`);
  // Aqui implementaremos a chamada para executar o otclient_dx.exe
});

ipcMain.on('close-app', () => {
  app.quit();
});
