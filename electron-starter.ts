// tslint:disable
const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

if (process.env.ELECTRON_START_URL) {
  require('electron-reload')('__dirname');
}

app.on('ready', () => {
  mainWindow = new BrowserWindow({ width: 800, height: 600 });

  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, './build/index.html'),
    protocol: 'file:',
    slashes: true,
  });
  mainWindow.loadURL(startUrl);


  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  
  if (!app.isPackaged) {
    const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension: ${name}`))
      .catch((err) => console.log(`An error occurred: ${err}`));
    installExtension(REDUX_DEVTOOLS)
      .then((name) => console.log(`Added Extension: ${name}`))
      .catch((err) => console.log(`An error occurred: ${err}`));
    mainWindow.webContents.openDevTools();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
