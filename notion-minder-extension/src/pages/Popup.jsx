import React, { useState } from 'react';

const Popup = () => {
  const [text, setText] = useState('');
  const [status, setStatus] = useState({ message: '', type: '' });

  const handleSaveToNotion = () => {
    setStatus({ message: 'Saving...', type: 'loading' });
    chrome.storage.local.get(['settings'], async (result) => {
      if (!result.settings || !result.settings.notionKey || !result.settings.journalDbId) {
        setStatus({ message: 'Missing Notion settings. Configure them in options.', type: 'error' });
        return;
      }
      const { notionKey, journalDbId } = result.settings;
      const notionPageData = {
        parent: { database_id: journalDbId },
        properties: { Name: { title: [{ text: { content: `Journal Entry - ${new Date().toLocaleDateString()}` } }] } },
        children: [{ object: 'block', type: 'paragraph', paragraph: { rich_text: [{ type: 'text', text: { content: text } }] } }],
      };
      try {
        const response = await fetch('https://api.notion.com/v1/pages', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${notionKey}`, 'Content-Type': 'application/json', 'Notion-Version': '2022-06-28' },
          body: JSON.stringify(notionPageData),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }
        setStatus({ message: 'Successfully saved to Notion!', type: 'success' });
        setText('');
      } catch (error) {
        setStatus({ message: error.message, type: 'error' });
      }
    });
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-2">Notion Minder</h1>
      <label className="block text-sm font-medium text-gray-700 mb-1">What did you accomplish?</label>
      <textarea rows="4" value={text} onChange={(e) => setText(e.target.value)} className="w-full p-2 border rounded-md" placeholder="Your thoughts..."></textarea>
      <button onClick={handleSaveToNotion} disabled={status.type === 'loading'} className="w-full mt-2 bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400">
        {status.type === 'loading' ? 'Saving...' : 'Save to Notion'}
      </button>
      {status.message && <p className={`text-sm mt-2 text-center ${status.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>{status.message}</p>}
    </div>
  );
};

export default Popup;