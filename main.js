const {
  app,
  BrowserWindow
} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    useContentSize:true
  })

  // and load the index.html of the app.
  win.loadFile('./src/html/app.html')

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const userManager=require('./src/js/userManager');
userManager.loadUser('jake',"123");
// userManager.getUser().jwtToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NDMyMDE1NDYsImV4cCI6MTU0MzgwNjM0NiwiYXVkIjoid3d3LmNnZW5jcnlwdGVkY2hhdC5tZSIsImlzcyI6IkNydXNoIG5leHQgZG9vcnMiLCJzdWIiOiJ6eGN6Y3p4Y3pjeC00NDkwIn0.qleroZWTPA9oVfIoPqOX4CnNgLDCbUFl9uL3_pKMhc4";
// userManager.saveUser('jake','123');

// console.log(userManager.getUser().jwtToken)