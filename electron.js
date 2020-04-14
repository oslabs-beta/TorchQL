const electron = require('electron');
const { app, BrowserWindow, Menu } = electron;
const path = require('path');
const url = require('url');

/* Electron logic */

const createWindow = () => {
  // Checks/Listen for the app to be ready to use

  // Creates a new window
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { nodeIntegration: true },
  });

  // Loads the html into the Electron App
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, './dist/index.html'),
      protocol: 'file',
      slashes: true,
    })
  );

  // Build Menu
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

  // Insert Menu
  Menu.setApplicationMenu(mainMenu);
};

// Once Electron has finished initialization:
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // don't apply this to Macs
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// On Mac, recreate app window when dock icon is clicked and no other windows are open
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
  }
});

// Create Menu Template
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Placeholder',
      },
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit(); // closes the program/gui
        },
      },
    ],
  },
];

if (process.env.NODE_ENV !== 'production' && process.NODE_ENV !== 'test') {
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
      {
        role: 'reload',
      },
    ],
  });
}
