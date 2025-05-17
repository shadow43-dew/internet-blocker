const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const si = require('systeminformation');
const osu = require('node-os-utils');
const netstat = require('netstat-node');
const psList = require('ps-list');

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
    path TEXT,
    pid INTEGER,
    data_usage_wifi INTEGER DEFAULT 0,
    data_usage_mobile INTEGER DEFAULT 0,
    connections_blocked INTEGER DEFAULT 0,
    active_connections INTEGER DEFAULT 0,
    last_used DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS network_connections (
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    pid INTEGER,
    process_name TEXT,
    local_address TEXT,
    local_port INTEGER,
    remote_address TEXT,
    remote_port INTEGER,
    state TEXT,
    protocol TEXT
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

// Monitor active processes and their network connections
async function monitorProcesses() {
  try {
    const processes = await psList();
    const connections = await netstat.raw();
    
    // Group connections by PID
    const connectionsByPid = connections.reduce((acc, conn) => {
      if (!acc[conn.pid]) acc[conn.pid] = [];
      acc[conn.pid].push(conn);
      return acc;
    }, {});

    // Update database with process information
    const stmt = db.prepare(`
      INSERT INTO app_stats (id, name, path, pid, active_connections)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        active_connections = ?,
        last_used = CURRENT_TIMESTAMP
    `);

    processes.forEach(proc => {
      const procConnections = connectionsByPid[proc.pid] || [];
      stmt.run(
        `proc-${proc.pid}`,
        proc.name,
        proc.cmd,
        proc.pid,
        procConnections.length,
        procConnections.length
      );

      // Log network connections
      procConnections.forEach(conn => {
        db.prepare(`
          INSERT INTO network_connections (
            pid, process_name, local_address, local_port,
            remote_address, remote_port, state, protocol
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          proc.pid,
          proc.name,
          conn.local.address,
          conn.local.port,
          conn.remote.address,
          conn.remote.port,
          conn.state,
          conn.protocol
        );
      });
    });
  } catch (error) {
    console.error('Error monitoring processes:', error);
  }
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

    // Monitor processes and connections
    await monitorProcesses();
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
      adsBlocked: db.prepare('SELECT COUNT(*) as count FROM network_connections WHERE remote_port IN (80, 443)').get().count || 0,
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Statistics server running on port ${PORT}`);
});