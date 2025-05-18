import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import si from 'systeminformation';
import osu from 'node-os-utils';
import psList from 'ps-list';
import { networkInterfaces } from 'os';

const app = express();
const db = new Database('stats.db');

// Enable CORS
app.use(cors());
app.use(express.json());

// Initialize database with all required tables
db.exec(`
  CREATE TABLE IF NOT EXISTS app_stats (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    path TEXT,
    pid INTEGER,
    data_usage_wifi INTEGER DEFAULT 0,
    data_usage_mobile INTEGER DEFAULT 0,
    connections_blocked INTEGER DEFAULT 0,
    active_connections INTEGER DEFAULT 0,
    last_used DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT CHECK(status IN ('blocked', 'allowed', 'whitelist')) DEFAULT 'allowed'
  );

  CREATE TABLE IF NOT EXISTS network_connections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    pid INTEGER,
    process_name TEXT,
    local_address TEXT,
    local_port INTEGER,
    remote_address TEXT,
    remote_port INTEGER,
    state TEXT,
    protocol TEXT,
    blocked BOOLEAN DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS system_stats (
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    cpu_usage REAL,
    memory_usage REAL,
    network_rx INTEGER,
    network_tx INTEGER
  );

  CREATE TABLE IF NOT EXISTS ad_block_stats (
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    domain TEXT,
    blocked_count INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS whitelist (
    app_id TEXT PRIMARY KEY,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(app_id) REFERENCES app_stats(id)
  );
`);

// Helper function to get network stats
async function getNetworkStats() {
  try {
    const networkStats = await si.networkStats();
    return networkStats[0] || { rx_bytes: 0, tx_bytes: 0 };
  } catch (error) {
    console.error('Error getting network stats:', error);
    return { rx_bytes: 0, tx_bytes: 0 };
  }
}

// Monitor active processes and their network connections
async function monitorProcesses() {
  try {
    const processes = await psList();
    const networkConnections = await si.networkConnections();
    
    // Get current timestamp
    const timestamp = new Date().toISOString();
    
    // Update database with process information
    const insertApp = db.prepare(`
      INSERT INTO app_stats (id, name, path, pid, active_connections, last_used)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        active_connections = ?,
        last_used = CURRENT_TIMESTAMP
    `);

    const insertConnection = db.prepare(`
      INSERT INTO network_connections (
        pid, process_name, local_address, local_port,
        remote_address, remote_port, state, protocol
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Begin transaction
    const transaction = db.transaction(() => {
      processes.forEach(proc => {
        const connections = networkConnections.filter(conn => conn.pid === proc.pid);
        insertApp.run(
          `proc-${proc.pid}`,
          proc.name,
          proc.cmd,
          proc.pid,
          connections.length,
          timestamp,
          connections.length
        );

        // Record each connection for this process
        connections.forEach(conn => {
          insertConnection.run(
            proc.pid,
            proc.name,
            conn.localAddress,
            conn.localPort,
            conn.remoteAddress,
            conn.remotePort,
            conn.state,
            conn.protocol
          );
        });
      });
    });

    // Execute transaction
    transaction();
  } catch (error) {
    console.error('Error monitoring processes:', error);
  }
}

// Update system stats every 30 seconds
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

    // Monitor processes and connections
    await monitorProcesses();
  } catch (error) {
    console.error('Error updating system stats:', error);
  }
}, 30000);

// API Routes

// Get overall statistics
app.get('/api/stats/overview', (req, res) => {
  try {
    const stats = {
      totalBlocked: db.prepare('SELECT COUNT(*) as count FROM network_connections WHERE blocked = 1').get().count,
      totalSaved: {
        data: db.prepare('SELECT SUM(data_usage_wifi + data_usage_mobile) as total FROM app_stats').get().total || 0,
        bandwidth: db.prepare('SELECT SUM(network_rx + network_tx) as total FROM system_stats').get().total || 0
      },
      adsBlocked: db.prepare('SELECT SUM(blocked_count) as total FROM ad_block_stats').get().total || 0,
      appStats: db.prepare(`
        SELECT 
          a.*,
          (SELECT COUNT(*) FROM network_connections WHERE pid = a.pid) as connection_count
        FROM app_stats a
        ORDER BY active_connections DESC, data_usage_wifi + data_usage_mobile DESC 
        LIMIT 10
      `).all()
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get process statistics
app.get('/api/stats/processes', async (req, res) => {
  try {
    const processes = db.prepare(`
      SELECT 
        a.*,
        (SELECT COUNT(*) FROM network_connections WHERE pid = a.pid) as connection_count,
        (SELECT GROUP_CONCAT(remote_address || ':' || remote_port) 
         FROM network_connections 
         WHERE pid = a.pid 
         GROUP BY pid) as connections
      FROM app_stats a
      WHERE active_connections > 0
      ORDER BY active_connections DESC
    `).all();

    res.json(processes);
  } catch (error) {
    console.error('Error fetching processes:', error);
    res.status(500).json({ error: 'Failed to fetch process statistics' });
  }
});

// Get system statistics
app.get('/api/stats/system', async (req, res) => {
  try {
    const stats = {
      cpu: await osu.cpu.usage(),
      memory: await si.mem(),
      network: await getNetworkStats(),
      processes: await psList(),
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

// Whitelist management
app.post('/api/whitelist/add', (req, res) => {
  const { appId } = req.body;
  try {
    db.prepare('INSERT INTO whitelist (app_id) VALUES (?)').run(appId);
    db.prepare('UPDATE app_stats SET status = ? WHERE id = ?').run('whitelist', appId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error adding to whitelist:', error);
    res.status(500).json({ error: 'Failed to add to whitelist' });
  }
});

app.post('/api/whitelist/remove', (req, res) => {
  const { appId } = req.body;
  try {
    db.prepare('DELETE FROM whitelist WHERE app_id = ?').run(appId);
    db.prepare('UPDATE app_stats SET status = ? WHERE id = ?').run('allowed', appId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error removing from whitelist:', error);
    res.status(500).json({ error: 'Failed to remove from whitelist' });
  }
});

// Ad blocking management
app.post('/api/adblock/toggle', (req, res) => {
  const { enabled } = req.body;
  try {
    // Update ad blocking status in the database
    db.prepare('UPDATE app_stats SET status = ? WHERE status = ?')
      .run(enabled ? 'blocked' : 'allowed', enabled ? 'allowed' : 'blocked');
    res.json({ success: true });
  } catch (error) {
    console.error('Error toggling ad block:', error);
    res.status(500).json({ error: 'Failed to toggle ad blocking' });
  }
});

// Block/unblock specific apps
app.post('/api/apps/block', (req, res) => {
  const { appId } = req.body;
  try {
    db.prepare('UPDATE app_stats SET status = ? WHERE id = ?').run('blocked', appId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error blocking app:', error);
    res.status(500).json({ error: 'Failed to block app' });
  }
});

app.post('/api/apps/unblock', (req, res) => {
  const { appId } = req.body;
  try {
    db.prepare('UPDATE app_stats SET status = ? WHERE id = ?').run('allowed', appId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error unblocking app:', error);
    res.status(500).json({ error: 'Failed to unblock app' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});