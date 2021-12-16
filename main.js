const { app, BrowserWindow, Menu, globalShortcut } = require('electron');

// Set env
process.env.NODE_ENV = 'development';

const isDev = process.env.NODE_ENV !== 'production' ? true : false;
const isMac = process.platform === 'darwin' ? true : false;

let mainWindow;
let aboutWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: 'Ferocious Image Shrinker',
        width: isDev ? 1024 : 500,
        height: 700,
        icon: `${__dirname}/assets/icons/256x256.png`,
        resizable: isDev,
        backgroundColor: '#ececec',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.loadFile('./app/index.html');
}

function createAboutWindow() {
    aboutWindow = new BrowserWindow({
        title: 'About Ferocious ImageShrinker',
        width: 300,
        height: 350,
        icon: `${__dirname}/assets/icons/256x256.png`,
        resizable: false,
        backgroundColor: '#ffffff',
    });

    aboutWindow.loadFile('./app/about.html');
}

app.on('ready', () => {
    createMainWindow();

    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);

    globalShortcut.register('CmdOrCtrl+R', () => mainWindow.reload());
    globalShortcut.register(isMac ? 'Cmd+Alt+I' : 'Ctrl+Shift+I', () =>
        mainWindow.toggleDevTools()
    );

    mainWindow.on('closed', () => (mainWindow = null));
});

const menu = [
    ...(isMac
        ? [
              {
                  label: app.name,
                  submenu: [
                      {
                          label: 'Application Credits',
                          click: createAboutWindow,
                      },
                  ],
              },
          ]
        : []),

    {
        role: 'fileMenu',
    },

    ...(!isMac
        ? [
              {
                  label: 'Help',
                  submenu: [
                      {
                          submenu: [
                              {
                                  label: 'Application Credits',
                                  click: createAboutWindow,
                              },
                          ],
                      },
                  ],
              },
          ]
        : []),

    ...(isDev
        ? [
              {
                  label: 'Developer',
                  submenu: [
                      {
                          role: 'reload',
                      },
                      {
                          role: 'forcereload',
                      },
                      {
                          type: 'separator',
                      },
                      {
                          role: 'toggleDevTools',
                      },
                  ],
              },
          ]
        : []),
];

app.on('window-all-closed', function () {
    if (!isMac) app.quit();
});

app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});
