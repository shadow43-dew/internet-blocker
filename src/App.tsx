import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Apps from './pages/Apps';
import AppDetail from './pages/AppDetail';
import Whitelist from './pages/Whitelist';
import AddToWhitelist from './pages/AddToWhitelist';
import BlockApp from './pages/BlockApp';
import AdBlock from './pages/AdBlock';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="apps" element={<Apps />} />
          <Route path="apps/:appId" element={<AppDetail />} />
          <Route path="apps/block" element={<BlockApp />} />
          <Route path="whitelist" element={<Whitelist />} />
          <Route path="whitelist/add" element={<AddToWhitelist />} />
          <Route path="adblock" element={<AdBlock />} />
          <Route path="stats" element={<Statistics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;