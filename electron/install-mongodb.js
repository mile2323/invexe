const { exec } = require('child_process');
const path = require('path');

function installMongoDB() {
  const platform = process.platform;
  if (platform === 'win32') {
    exec('msiexec.exe /i mongodb.msi', (err) => {
      if (err) console.error('MongoDB installation failed:', err);
      else console.log('MongoDB installed successfully');
    });
  } else if (platform === 'darwin') {
    exec('tar -zxvf mongodb.tgz', (err) => {
      if (err) console.error('MongoDB installation failed:', err);
      else console.log('MongoDB installed successfully');
    });
  }
}

module.exports = installMongoDB;