const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    launchGame: (version) => ipcRenderer.send('launch-game', version),
    closeApp: () => ipcRenderer.send('close-app')
});
