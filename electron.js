const { app, BrowserWindow } = require('electron');
const path = require('path');

const createWindow = () => {
  // Create browser window
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // load index.html of our app
  win.loadFile(path.resolve(__dirname, './dist/index.html'));

  // open devtools
  win.webContents.openDevTools();
};

// Once Electron has finished initialization:
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // However, Mac programs are usually quit explicitly with Cmd-Q, so don't enable this for Macs
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // Recreate window in app when dock icon is clicked and no windows are open (for Macs)
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
