'use client';

import { useState } from 'react';

interface BrochureFormProps {
  onSubmit: (companyName: string, url: string, useStreaming: boolean) => Promise<void>;
  loading: boolean;
  isStreaming: boolean;
}

export default function BrochureForm({ onSubmit, loading, isStreaming }: BrochureFormProps) {
  const [companyName, setCompanyName] = useState('');
  const [url, setUrl] = useState('');
  const [useStreaming, setUseStreaming] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !url.trim()) {
      alert('Please fill in all fields');
      return;
    }
    await onSubmit(companyName, url, useStreaming);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
          Company Name
        </label>
        <input
          id="company"
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="e.g., OpenAI"
          disabled={loading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
        />
      </div>

      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
          Website URL
        </label>
        <input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          disabled={loading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          id="streaming"
          type="checkbox"
          checked={useStreaming}
          onChange={(e) => setUseStreaming(e.target.checked)}
          disabled={loading}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="streaming" className="text-sm text-gray-700">
          Stream response (real-time)
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
        }`}
      >
        {isStreaming ? 'Generating...' : loading ? 'Processing...' : '✨ Generate Brochure'}
      </button>
    </form>
  );
}
