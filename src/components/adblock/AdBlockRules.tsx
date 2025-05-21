import React, { useState } from 'react';
import { Shield, Plus, Trash2 } from 'lucide-react';
import { useAdBlockStore } from '../../services/adBlockService';
import Button from '../ui/Button';
import Switch from '../ui/Switch';

export function AdBlockRules() {
  const { rules, addRule, removeRule, toggleRule } = useAdBlockStore();
  const [newPattern, setNewPattern] = useState('');
  const [newCategory, setNewCategory] = useState<'ads' | 'trackers' | 'malware' | 'custom'>('custom');
  const [newDescription, setNewDescription] = useState('');

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPattern) {
      addRule({
        pattern: newPattern,
        isEnabled: true,
        isCustom: true,
        category: newCategory,
        description: newDescription
      });
      setNewPattern('');
      setNewDescription('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
        <h3 className="text-lg font-medium text-secondary-900 mb-4">Add Custom Rule</h3>
        <form onSubmit={handleAddRule} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700">Pattern</label>
            <input
              type="text"
              value={newPattern}
              onChange={(e) => setNewPattern(e.target.value)}
              className="mt-1 block w-full rounded-md border border-secondary-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="*://*.example.com/*"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700">Category</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as any)}
              className="mt-1 block w-full rounded-md border border-secondary-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="ads">Ads</option>
              <option value="trackers">Trackers</option>
              <option value="malware">Malware</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700">Description</label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border border-secondary-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Rule description"
            />
          </div>
          
          <Button
            type="submit"
            variant="primary"
            icon={<Plus size={16} />}
            fullWidth
          >
            Add Rule
          </Button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
        <div className="p-6 border-b border-secondary-200">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-primary-500" />
            <h3 className="ml-2 text-lg font-medium text-secondary-900">Blocking Rules</h3>
          </div>
        </div>
        
        <div className="divide-y divide-secondary-200">
          {rules.map((rule) => (
            <div key={rule.id} className="p-4 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  <p className="text-sm font-medium text-secondary-900 truncate">
                    {rule.pattern}
                  </p>
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    rule.category === 'ads' ? 'bg-danger-100 text-danger-800' :
                    rule.category === 'trackers' ? 'bg-warning-100 text-warning-800' :
                    rule.category === 'malware' ? 'bg-primary-100 text-primary-800' :
                    'bg-secondary-100 text-secondary-800'
                  }`}>
                    {rule.category}
                  </span>
                </div>
                {rule.description && (
                  <p className="mt-1 text-xs text-secondary-500">{rule.description}</p>
                )}
                <p className="mt-1 text-xs text-secondary-500">
                  Blocked {rule.hitCount} times
                  {rule.lastHit && ` • Last hit: ${new Date(rule.lastHit).toLocaleString()}`}
                </p>
              </div>
              
              <div className="ml-4 flex items-center space-x-4">
                <Switch
                  checked={rule.isEnabled}
                  onChange={() => toggleRule(rule.id)}
                  size="sm"
                />
                
                {rule.isCustom && (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Trash2 size={16} />}
                    onClick={() => removeRule(rule.id)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}