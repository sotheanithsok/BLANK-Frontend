// Enable live reload for Electron too
require('electron-reload')(__dirname, {
    // Note that the path to electron may vary according to the main file
    electron: require(`${__dirname}/node_modules/electron`)
});

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

//SingleInstanance
let userManager=require('./src/js/userManager');
userManager.loadUser('tester1','$2njD7Tt%d');
// console.log(userManager.currentUser);
// userManager.currentUser.jwtToken='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NDMyODAzMzEsImV4cCI6MTU0Mzg4NTEzMSwiYXVkIjoid3d3LmNnZW5jcnlwdGVkY2hhdC5tZSIsImlzcyI6IkNydXNoIG5leHQgZG9vcnMiLCJzdWIiOiJKb2huLTIzMTAifQ.wSCgzWvWBUGAhtz44zsbreBJG4_WfSo67pm_Y2PGyiE';
// userManager.saveUser('tester1','$2njD7Tt%d');

//IPC communication
//Getter
ipcMain.on('synchronous-main-getRSAPublicKey',(event,args)=>{
  event.returnValue  = userManager.getUser().RSAPublicKey;
})

ipcMain.on('synchronous-main-getRSAPrivateKey',(event,args)=>{
  event.returnValue  = userManager.getUser().RSAPrivateKey;
})

ipcMain.on('synchronous-main-getJWTToken',(event,args)=>{
  event.returnValue  = userManager.getUser().jwtToken;
})

ipcMain.on('synchronous-main-getOtherPublicKey',(event,args)=>{
  event.returnValue  = userManager.getUser().keysChain[args];
})

ipcMain.on('synchronous-main-getMessagesChain',(event,args)=>{
  event.returnValue  = userManager.getUser().messagesChain[args];
})

//Setter
ipcMain.on('synchronous-main-setJWTToken',(event,args)=>{
  event.returnValue  = userManager.getUser().jwtToken=args;
  event.returnValue=true;
})

ipcMain.on('synchronous-main-addOtherPublicKey',(event,args)=>{
  //userManager.getUser().keysChain[args];
  event.returnValue=true;
})

ipcMain.on('synchronous-main-addOtherPublicKey',(event,args)=>{
  //event.returnValue  = userManager.getUser().messagesChain[args];
  event.returnValue=true;
})

// //Data transfers
// ipcMain.on('asynchronous-main-searchUsersByName',(event,args)=>{
//   win.webContents.send('asynchronous-httpRequester-searchUsersByName')
// })

// ipcMain.on('asynchronous-main-updateSearchResult',(event,args)=>{
//   win.webContents.send('asynchronous-httpRequester-updateSearchResult',args);
// })

// ipcMain.on('asynchronous-main-clearSearchResult',(event,args)=>{
//   win.webContents.send('asynchronous-httpRequester-clearSearchResult',args);
// })