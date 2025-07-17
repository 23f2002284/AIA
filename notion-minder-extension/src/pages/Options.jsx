import React, { useState, useEffect } from 'react';

const Options = () => {
  const [settings, setSettings] = useState({ notionKey: '', journalDbId: '', taskDbId: '', shallowSites: '' });
  const [status, setStatus] = useState('');

  useEffect(() => {
    chrome.storage.local.get(['settings'], (result) => {
      if (result.settings) setSettings(result.settings);
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = () => {
    chrome.storage.local.set({ settings }, () => {
      setStatus('Settings saved successfully!');
      setTimeout(() => setStatus(''), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
        <p className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-md mb-6">
          <strong>Security Notice:</strong> Your Notion API key is stored locally on this computer.
        </p>
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Notion Integration</h2>
          <div className="space-y-4">
            <input type="password" name="notionKey" value={settings.notionKey} onChange={handleInputChange} placeholder="Notion API Key (Secret)" className="w-full p-2 border rounded-md" />
            <input type="text" name="journalDbId" value={settings.journalDbId} onChange={handleInputChange} placeholder="Journal Database ID" className="w-full p-2 border rounded-md" />
            <input type="text" name="taskDbId" value={settings.taskDbId} onChange={handleInputChange} placeholder="Tasks Database ID (Optional)" className="w-full p-2 border rounded-md" />
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Shallow Work Sites</h2>
          <textarea name="shallowSites" value={settings.shallowSites} onChange={handleInputChange} rows="4" placeholder="Enter one website per line (e.g., twitter.com)" className="w-full p-2 border rounded-md"></textarea>
        </div>
        <button onClick={handleSaveSettings} className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700">Save Settings</button>
        {status && <p className="text-sm text-green-600 mt-2 text-center">{status}</p>}
      </div>
    </div>
  );
};

export default Options;