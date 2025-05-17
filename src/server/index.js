const express = require('express');
const { exec } = require('child_process');
const { promisify } = require('util');

const app = express();
const execAsync = promisify(exec);

app.get('/api/system/installed-apps', async (req, res) => {
  try {
    const { stdout } = await execAsync(
      'powershell -Command "Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Select-Object DisplayName, InstallLocation"'
    );

    const apps = stdout
      .split('\n')
      .filter(line => line.trim())
      .map((line, index) => {
        const [name, path] = line.split('  ').filter(Boolean);
        return {
          id: `sys-${index}`,
          name: name || 'Unknown App',
          icon: 'Globe',
          status: 'allowed',
          category: 'System',
          lastUsed: new Date().toISOString(),
          path: path || '',
          dataUsage: {
            wifi: 0,
            mobile: 0,
          },
        };
      });

    res.json(apps);
  } catch (error) {
    console.error('Error getting installed apps:', error);
    res.status(500).json({ error: 'Failed to get installed apps' });
  }
});

app.get('/api/system/running-processes', async (req, res) => {
  try {
    const { stdout } = await execAsync(
      'powershell -Command "Get-Process | Select-Object ProcessName, Path | Where-Object { $_.Path -ne $null }"'
    );

    const processes = stdout
      .split('\n')
      .filter(line => line.trim())
      .map((line, index) => {
        const [name, path] = line.split('  ').filter(Boolean);
        return {
          id: `proc-${index}`,
          name: name || 'Unknown Process',
          icon: 'Activity',
          status: 'allowed',
          category: 'Running',
          lastUsed: new Date().toISOString(),
          path: path || '',
          dataUsage: {
            wifi: 0,
            mobile: 0,
          },
        };
      });

    res.json(processes);
  } catch (error) {
    console.error('Error getting running processes:', error);
    res.status(500).json({ error: 'Failed to get running processes' });
  }
});

app.get('/api/system/info', async (req, res) => {
  res.json({
    os: 'Windows',
    version: '11',
    arch: 'x64',
    memory: 16000000000, // 16 GB
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});