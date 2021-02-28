const electron = require('electron');
const { app, BrowserWindow, Menu } = electron;
const path = require('path');
const url = require('url');

/* Electron logic */

//Checks if it is a mac user or not
const isMac = process.platform === 'darwin';

const createWindow = () => {
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

  mainWindow.webContents.openDevTools();

  // These are currently interfering with keyboard commands (e.g. paste)
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
  if (!isMac) {
    app.quit();
  }
});

// On Mac, recreate app window when dock icon is clicked and no other windows are open
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
  }
});

// Create a new window
const aboutNewWindow = () => {
  aboutWindow = new BrowserWindow({
    width: 300,
    height: 300,
    title: 'About',
  });

  aboutWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, './client/Components/About.html'),
      protocol: 'file',
      slashes: true,
    })
  );

  // Garbage Collection Handler
  aboutWindow.on('close', () => {
    aboutWindow = null;
  });
};

// Create Menu Template
const mainMenuTemplate = [
  {
    label: '',
    submenu: [
      {
        label: 'About',
        click() {
          aboutNewWindow();
        },
      },
      {
        label: 'Quit',
        accelerator: isMac ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit(); // Closes the program/gooey
        },
      },
    ],
  },
  {
    label: 'File',
    submenu: [
      {
        label: 'Placeholder',
      },
      {
        label: 'Placeholder',
      },
      {
        label: 'Placeholder',
      },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Copy',
        accelerator: isMac ? 'Command+C' : 'Ctrl+C',
        selector: 'copy:'
      },
      {
        label: 'Paste',
        accelerator: isMac ? 'Command+V' : 'Ctrl+V',
        selector: 'paste:'
      },
      {
        label: 'Cut',
        accelerator: isMac ? 'Command+X' : 'Ctrl+X',
        selector: 'cut:'
      },
      {
        label: 'Select All',
        accelerator: isMac ? 'Command+A' : 'Ctrl+A',
        selector: 'selectAll:'
      },
      {
        label: 'Undo',
        accelerator: isMac ? 'Command+Z' : 'Ctrl+Z',
        selector: 'undo:'
      },
      {
        label: 'Redo',
        accelerator: isMac ? 'Command+Shift+Z' : 'Ctrl+Shift+Z',
        selector: 'redo:'
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
        accelerator: isMac ? 'Command+I' : 'Ctrl+I',
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
