import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { addFirewallRule, removeFirewallRule } from 'node-windows-firewall';

const app = express();
const db = new Database('blocklist.db');

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS blocked_apps (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    path TEXT NOT NULL,
    blocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS whitelist (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    path TEXT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS firewall_rules (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    direction TEXT CHECK(direction IN ('inbound', 'outbound')) NOT NULL,
    action TEXT CHECK(action IN ('block', 'allow')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS ad_block_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    domain TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

app.use(cors());
app.use(express.json());

// Get all blocked apps
app.get('/api/blocked-apps', (req, res) => {
  const blockedApps = db.prepare('SELECT * FROM blocked_apps').all();
  res.json(blockedApps);
});

// Block an app
app.post('/api/block-app', (req, res) => {
  const { id, name, path } = req.body;
  
  try {
    // Add to database
    db.prepare('INSERT INTO blocked_apps (id, name, path) VALUES (?, ?, ?)')
      .run(id, name, path);

    // Add firewall rule
    addFirewallRule({
      name: `Block ${name}`,
      program: path,
      direction: 'outbound',
      action: 'block'
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unblock an app
app.post('/api/unblock-app', (req, res) => {
  const { id, name, path } = req.body;
  
  try {
    // Remove from database
    db.prepare('DELETE FROM blocked_apps WHERE id = ?').run(id);

    // Remove firewall rule
    removeFirewallRule(`Block ${name}`);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add to whitelist
app.post('/api/whitelist', (req, res) => {
  const { id, name, path } = req.body;
  
  try {
    // Add to whitelist table
    db.prepare('INSERT INTO whitelist (id, name, path) VALUES (?, ?, ?)')
      .run(id, name, path);

    // Add allow rule to firewall
    addFirewallRule({
      name: `Allow ${name}`,
      program: path,
      direction: 'outbound',
      action: 'allow'
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove from whitelist
app.post('/api/whitelist/remove', (req, res) => {
  const { id, name } = req.body;
  
  try {
    // Remove from whitelist table
    db.prepare('DELETE FROM whitelist WHERE id = ?').run(id);

    // Remove allow rule from firewall
    removeFirewallRule(`Allow ${name}`);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ad blocking endpoints
app.get('/api/ad-block/status', (req, res) => {
  try {
    const status = db.prepare('SELECT value FROM system_settings WHERE key = ?')
      .get('ad_block_enabled');
    res.json({ enabled: status?.value === 'true' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ad-block/toggle', (req, res) => {
  const { enabled } = req.body;
  
  try {
    db.prepare(`
      INSERT INTO system_settings (key, value) 
      VALUES ('ad_block_enabled', ?) 
      ON CONFLICT(key) DO UPDATE SET value = ?
    `).run(enabled.toString(), enabled.toString());

    // Update hosts file or proxy settings here
    // This is a placeholder for actual ad blocking implementation

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/ad-block/rules', (req, res) => {
  try {
    const rules = db.prepare('SELECT * FROM ad_block_rules').all();
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ad-block/rules', (req, res) => {
  const { domain } = req.body;
  
  try {
    db.prepare('INSERT INTO ad_block_rules (domain) VALUES (?)').run(domain);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// System-wide blocking endpoints
app.get('/api/system/status', (req, res) => {
  try {
    const status = db.prepare('SELECT value FROM system_settings WHERE key = ?')
      .get('system_block_enabled');
    res.json({ enabled: status?.value === 'true' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/system/toggle', (req, res) => {
  const { enabled } = req.body;
  
  try {
    db.prepare(`
      INSERT INTO system_settings (key, value) 
      VALUES ('system_block_enabled', ?) 
      ON CONFLICT(key) DO UPDATE SET value = ?
    `).run(enabled.toString(), enabled.toString());

    if (enabled) {
      // Enable system-wide blocking
      addFirewallRule({
        name: 'System-Wide Block',
        direction: 'outbound',
        action: 'block'
      });
    } else {
      // Disable system-wide blocking
      removeFirewallRule('System-Wide Block');
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});