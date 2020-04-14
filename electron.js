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
    pathname: path.join(__dirname, './dist/index.html'),
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

// Once Electron has finished initialization:
app.whenReady().then(mainWindow);


// Create Menu Template
const mainMenuTemplate = [
  {
    label: ''
  },
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

if (process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
      label: 'Developer Tools',
      submenu: [
          {
              label: 'Toggle DevTools',
              accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
              click(item, focusedWindow){
                  focusedWindow.toggleDevTools()
              }
          },
          {
              role: 'reload'
          }
      ]
  })
}

