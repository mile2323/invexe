const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const { spawn } = require('child_process');

let djangoProcess;

function startDjangoServer() {
  const djangoBackend = spawn('python', [
    path.join(__dirname, '../Backend/manage.py'),
    'runserver',
    '127.0.0.1:8000',
    '--noreload',
  ], {
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, PYTHONPATH: path.join(__dirname, '../Backend') },
  });

  djangoBackend.stdout.on('data', (data) => {
    console.log(`Django stdout: ${data}`);
  });

  djangoBackend.stderr.on('data', (data) => {
    console.error(`Django stderr: ${data}`);
  });

  djangoBackend.on('close', (code) => {
    console.log(`Django process exited with code ${code}`);
  });

  return djangoBackend;
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:5173'); // Matches your Vite port
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../frontend/dist/index.html'));
  }
}

app.whenReady().then(() => {
  djangoProcess = startDjangoServer();
  setTimeout(createWindow, 5000); // Delay to ensure Django server starts
});

app.on('window-all-closed', () => {
  if (djangoProcess) djangoProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});