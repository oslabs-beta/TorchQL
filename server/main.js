const electron = require('electron')
const {app, BrowserWindow, Menu} = electron
const path = require('path');
const url = require('url');



/* Electron logic */

let mainWindow

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

  // Quit App when closed
  mainWindow.on('closed', () => {
    app.quit()
  })

  // Build Menu
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)

  // Insert Menu
  Menu.setApplicationMenu(mainMenu)
})

// Create Menu Template
const mainMenuTemplate = [
  {
      label: 'File',
      submenu:[
          {
              label: 'Placeholder'
          },
          {
              label: 'Quit',
              accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
              click(){
                  app.quit() // closes the program/gooey
              }
          }
      ]
  }
] 



