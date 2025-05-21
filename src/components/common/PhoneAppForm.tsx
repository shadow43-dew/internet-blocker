import React, { useState } from 'react';
import { Smartphone, Plus } from 'lucide-react';
import Button from '../ui/Button';

interface PhoneAppFormProps {
  onAddApp: (appName: string, packageName: string) => void;
}

export function PhoneAppForm({ onAddApp }: PhoneAppFormProps) {
  const [appName, setAppName] = useState('');
  const [packageName, setPackageName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (appName && packageName) {
      onAddApp(appName, packageName);
      setAppName('');
      setPackageName('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6 mb-6">
      <div className="flex items-center mb-4">
        <Smartphone className="h-5 w-5 text-primary-500" />
        <h3 className="ml-2 text-lg font-medium text-secondary-900">Add Phone App</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="appName" className="block text-sm font-medium text-secondary-700">
            App Name
          </label>
          <input
            type="text"
            id="appName"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-secondary-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="WhatsApp"
            required
          />
        </div>
        
        <div>
          <label htmlFor="packageName" className="block text-sm font-medium text-secondary-700">
            Package Name
          </label>
          <input
            type="text"
            id="packageName"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-secondary-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="com.whatsapp"
            required
          />
          <p className="mt-1 text-xs text-secondary-500">
            Enter the package name (e.g., com.whatsapp, com.facebook.katana)
          </p>
        </div>
        
        <Button
          type="submit"
          variant="primary"
          icon={<Plus size={16} />}
          fullWidth
        >
          Add to Whitelist
        </Button>
      </form>
    </div>
  );
}

export default PhoneAppForm;