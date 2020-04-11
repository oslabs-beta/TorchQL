const electron = require('electron')
const {app, BrowserWindow} = electron
const path = require('path');
const url = require('url');



/* Electron logic */

// Checks/Listen for the app to be ready to use
app.on('ready', () => {
  // Creates a new window
  mainWindow = new BrowserWindow({})

  // Loads the html into the Electron App
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../dist/index.html'),
    protocol:'file',
    slashes: true
  }))
})



