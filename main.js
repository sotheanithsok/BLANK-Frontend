// Enable live reload for Electron too
// require('electron-reload')(__dirname, {
//   // Note that the path to electron may vary according to the main file
//   electron: require(`${__dirname}/node_modules/electron`)
// });

const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron')


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    useContentSize: true
  })

  // and load the index.html of the app.
  win.loadFile('./src/html/login.html')

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

//SingleInstanance
let username;
let password;
let userManager = require('./src/js/userManager');

//IPC communication
ipcMain.on('synchronous-main-getRSAPrivateKey', (event, args) => {
  event.returnValue = userManager.getUser().RSAPrivateKey;
})

ipcMain.on('synchronous-main-getJWTToken', (event, args) => {
  event.returnValue = userManager.getUser().jwtToken;
})

ipcMain.on('synchronous-main-getOtherPublicKey', (event, args) => {
  event.returnValue = userManager.getUser().keysChain[args];
})


ipcMain.on('asynchronous-main-addMessage', (event, args) => {
  if (userManager.currentUser.messagesChain[args.sender] === undefined) {
    userManager.currentUser.messagesChain[args] = [];
    userManager.saveUser(username, password)
  }
  userManager.currentUser.messagesChain[args.sender].push({
    type: args.type,
    message: args.message
  })

})

ipcMain.on('asynchronous-request-updateMessages', (event, args) => {
  if (userManager.currentUser.messagesChain[args] === undefined) {
    userManager.currentUser.messagesChain[args] = [];
    userManager.saveUser(username, password)
  }
  event.sender.send('asynchronous-reply-updateMessages', {
    name: args,
    messages: userManager.currentUser.messagesChain[args]
  })
})


ipcMain.on('asynchronous-updateJWT', (event, args) => {
  userManager.loadUser(args.username, args.passphrase);
  userManager.getUser().jwtToken = args.token;
  userManager.saveUser(args.username, args.passphrase);
  username = args.username;
  password = args.passphrase;
  win.loadFile('./src/html/app.html')
})

