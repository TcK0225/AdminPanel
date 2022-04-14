const { app, BrowserWindow } = require('electron')
var path = require('path')
function createWindow () {
  
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false
    },
    icon: path.join(__dirname, 'dist/AdminPanel/assets/jobs-logo.png')
  })

  win.loadURL(`file://${__dirname}/dist/AdminPanel/index.html`)
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

