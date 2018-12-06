// Enable live reload for Electron too
// require('electron-reload')(__dirname, {
//   // Note that the path to electron may vary according to the main file
//   electron: require(`${__dirname}/node_modules/electron`)
// });
const p = require('path')
const {
  app,
  BrowserWindow,
  ipcMain,
  Menu
} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let mainMenu

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "Blank",
    center: false
  })

  // and load the index.html of the app.
  win.loadFile('./src/html/login.html')

  // Open the DevTools.
  //win.webContents.openDevTools()

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
app.on('ready', () => {
  createWindow();
  Menu.setApplicationMenu(null);

}
)

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

/**
 * Create a new menu bar.
 */
function buildMainMenu() {
  let mainMenuTemplate = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Show/Edit your RSA keys',
          click() {
            win.webContents.send('asynchronous-main-showKeys', {
              RSAPublicKey: userManager.currentUser.RSAPublicKey,
              RSAPrivateKey: userManager.currentUser.RSAPrivateKey
            })
          }
        },
        {
          id: 'PK',
          label: 'Show known public keys'
        },
        {
          accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
          role: 'quit'
        }
      ]
    }
  ]

  let pk = mainMenuTemplate[0].submenu[1].submenu = [];
  let knownPK = Object.getOwnPropertyNames(userManager.currentUser.keysChain)
  while (knownPK.length > 0) {
    let name = knownPK.pop();
    pk.push({
      label: name,
      click() {
        win.webContents.send('asynchronous-main-showOthersPublicKey', {
          RSAPublicKey: userManager.currentUser.RSAPublicKey,
          name: name
        })
      }
    });
  }

  mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
}

// In this file you can include the rest of your app's specific main process

//SingleInstanance
let username;
let password;
let jwtToken;
let userManager = require(p.join(__dirname, '/src/js/userManager'));

//IPC communication
/**
 * A request for user's RSA private key.
 */
ipcMain.on('synchronous-main-getRSAPrivateKey', (event, args) => {
  event.returnValue = userManager.getUser().RSAPrivateKey;
})

/**
 * A request for user's JWT token.
 */
ipcMain.on('synchronous-main-getJWTToken', (event, args) => {
  event.returnValue = jwtToken;
})

/**
 * A request for other people's public key.
 */
ipcMain.on('synchronous-main-getOtherPublicKey', (event, args) => {
  event.returnValue = userManager.getUser().keysChain[args];
})

/**
 * A request to update other people's public key.
 */
ipcMain.on('asynchronous-main-setOtherPublicKey', (event, args) => {
  userManager.getUser().keysChain[args.name] = args.key;
  buildMainMenu();
  userManager.saveUser(username, password);
})

/**
 * A request to get the converstaion length.
 */
ipcMain.on('synchronous-main-getConversationLength', (event, args) => {
  event.returnValue = userManager.getUser().messagesChain[args].length;
})

/**
 * A request to get the conversation.
 */
ipcMain.on('synchronous-main-getConversationsName', (event, args) => {
  event.returnValue = Object.getOwnPropertyNames(userManager.getUser().messagesChain);
})

/**
 * A request to set the user's RSA key pair.
 */
ipcMain.on('asynchronous-main-setRSAKeyPair', (event, args) => {
  userManager.getUser().RSAPrivateKey = args.RSAPrivateKey;
  userManager.getUser().RSAPublicKey = args.RSAPublicKey;
  userManager.saveUser(username, password);
})

/**
 * A request to add a new message.
 */
ipcMain.on('asynchronous-main-addMessage', (event, args) => {
  if (userManager.currentUser.messagesChain[args.sender] === undefined) {
    userManager.currentUser.messagesChain[args.sender] = [];
    userManager.currentUser.messagesChain[args.sender].push({
      type: args.type,
      message: args.message
    })
    win.webContents.send('asynchronous-addNewConversation', args.sender);
  } else {
    userManager.currentUser.messagesChain[args.sender].push({
      type: args.type,
      message: args.message
    })
  }
  userManager.saveUser(username, password);
})

/**
 * A request to update UI message.
 */
ipcMain.on('asynchronous-request-updateMessages', (event, args) => {
  if (userManager.currentUser.messagesChain[args] === undefined) {
    userManager.currentUser.messagesChain[args] = [];
    userManager.saveUser(username, password)
  }
  event.sender.send('asynchronous-reply-updateMessages', {
    name: args,
    messages: userManager.currentUser.messagesChain[args]
  })
  userManager.saveUser(username, password);
})

/**
 * A request to set JWT token.
 */
ipcMain.on('asynchronous-updateJWT', (event, args) => {
  win.loadFile('./src/html/app.html')
  userManager.loadUser(args.username, args.passphrase);

  username = args.username;
  password = args.passphrase;
  jwtToken = args.token;
  win.webContents.on('dom-ready', () => {
    buildMainMenu();
  })
})

ipcMain.on('asynchonous-main-switchToLogin',(event,args)=>{
  Menu.setApplicationMenu(null);
  win.loadFile('./src/html/login.html')
})

ipcMain.on('asynchonous-main-switchToSignup',(event,args)=>{
  Menu.setApplicationMenu(null);
  win.loadFile('./src/html/signup.html')
})