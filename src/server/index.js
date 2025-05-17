const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const si = require('systeminformation');
const osu = require('node-os-utils');

const app = express();
const db = new Database('stats.db');

// Enable CORS
app.use(cors());
app.use(express.json());

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS app_stats (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    data_usage_wifi INTEGER DEFAULT 0,
    data_usage_mobile INTEGER DEFAULT 0,
    connections_blocked INTEGER DEFAULT 0,
    last_used DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS system_stats (
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    cpu_usage REAL,
    memory_usage REAL,
    network_rx INTEGER,
    network_tx INTEGER
  );
`);

// Helper function to get network stats
async function getNetworkStats() {
  const networkStats = await si.networkStats();
  return networkStats[0] || { rx_bytes: 0, tx_bytes: 0 };
}

// Update system stats every minute
setInterval(async () => {
  try {
    const cpu = await osu.cpu.usage();
    const memory = await si.mem();
    const network = await getNetworkStats();

    db.prepare(`
      INSERT INTO system_stats (cpu_usage, memory_usage, network_rx, network_tx)
      VALUES (?, ?, ?, ?)
    `).run(
      cpu,
      (memory.used / memory.total) * 100,
      network.rx_bytes,
      network.tx_bytes
    );
  } catch (error) {
    console.error('Error updating system stats:', error);
  }
}, 60000);

// API Routes
app.get('/api/stats/overview', (req, res) => {
  try {
    const stats = {
      totalBlocked: db.prepare('SELECT SUM(connections_blocked) as total FROM app_stats').get().total || 0,
      totalSaved: {
        data: db.prepare('SELECT SUM(data_usage_wifi + data_usage_mobile) as total FROM app_stats').get().total || 0,
        bandwidth: db.prepare('SELECT SUM(network_rx + network_tx) as total FROM system_stats').get().total || 0
      },
      adsBlocked: Math.floor(Math.random() * 5000), // Placeholder for ad blocking stats
      appStats: db.prepare('SELECT * FROM app_stats ORDER BY data_usage_wifi + data_usage_mobile DESC LIMIT 10').all()
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

app.post('/api/stats/app/update', (req, res) => {
  const { id, name, dataUsageWifi, dataUsageMobile, connectionsBlocked } = req.body;

  try {
    db.prepare(`
      INSERT INTO app_stats (id, name, data_usage_wifi, data_usage_mobile, connections_blocked)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        data_usage_wifi = data_usage_wifi + ?,
        data_usage_mobile = data_usage_mobile + ?,
        connections_blocked = connections_blocked + ?,
        last_used = CURRENT_TIMESTAMP
    `).run(
      id, name, dataUsageWifi, dataUsageMobile, connectionsBlocked,
      dataUsageWifi, dataUsageMobile, connectionsBlocked
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating app stats:', error);
    res.status(500).json({ error: 'Failed to update app statistics' });
  }
});

app.get('/api/stats/system', async (req, res) => {
  try {
    const stats = {
      cpu: await osu.cpu.usage(),
      memory: await si.mem(),
      network: await getNetworkStats(),
      history: db.prepare(`
        SELECT * FROM system_stats 
        WHERE timestamp >= datetime('now', '-1 hour')
        ORDER BY timestamp DESC
      `).all()
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching system stats:', error);
    res.status(500).json({ error: 'Failed to fetch system statistics' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Statistics server running on port ${PORT}`);
});