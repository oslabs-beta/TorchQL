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
    title: 'About'
  });

  aboutWindow.loadURL(url.format({
    pathname: path.join(__dirname, './client/Components/About.html'),
    protocol: 'file',
    slashes: true
  }));
};

// Create Menu Template
const mainMenuTemplate = [
  {
    label: '',
    submenu:[
      {
        label: 'About',
        click(){
          aboutNewWindow()
        }
      },
      {
        label: 'Quit',
        accelerator: isMac ? 'Command+Q' : 'Ctrl+Q',
        click(){
          app.quit(); // Closes the program/gooey
        }
      }
    ]
  },
  {
      label: 'File',
      submenu:[
          {
            label: 'Placeholder'
          },
          {
            label: 'Placeholder'
          },
          {
            label: 'Placeholder'
          },
      ]
  }
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
};
