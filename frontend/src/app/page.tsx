'use client';

import { useState } from 'react';
import axios from 'axios';
import BrochureForm from '@/components/BrochureForm';
import BrochureDisplay from '@/components/BrochureDisplay';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export default function Home() {
  const [brochure, setBrochure] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);

  const handleGenerateBrochure = async (
    companyName: string,
    url: string,
    useStreaming: boolean
  ) => {
    setLoading(true);
    setError('');
    setBrochure('');

    try {
      if (useStreaming) {
        await generateBrochureStream(companyName, url);
      } else {
        await generateBrochureNonStream(companyName, url);
      }
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.detail || err.message
        : String(err);
      setError(`Error: ${message}`);
    } finally {
      setLoading(false);
      setIsStreaming(false);
    }
  };

  const generateBrochureNonStream = async (
    companyName: string,
    url: string
  ) => {
    const response = await axios.post(`${API_BASE_URL}/api/generate-brochure`, {
      company_name: companyName,
      url: url,
    });

    setBrochure(response.data.brochure);
  };

  const generateBrochureStream = async (
    companyName: string,
    url: string
  ) => {
    setIsStreaming(true);
    let accumulatedContent = '';

    const response = await fetch(`${API_BASE_URL}/api/generate-brochure-stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify({ company_name: companyName, url }),
    });

    if (!response.body) {
      throw new Error('No response body for stream');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    return new Promise<void>((resolve, reject) => {
      const read = async () => {
        try {
          const { done, value } = await reader.read();
          if (done) {
            setIsStreaming(false);
            resolve();
            return;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6);
            if (data === '[DONE]') {
              setIsStreaming(false);
              resolve();
              return;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                accumulatedContent += parsed.content;
                setBrochure(accumulatedContent);
              }
              if (parsed.error) {
                setError(parsed.error);
              }
            } catch (e) {
              // ignore malformed lines
            }
          }

          read();
        } catch (err) {
          setIsStreaming(false);
          reject(err);
        }
      };

      read();
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900">📑 Brochure Generator</h1>
          <p className="mt-2 text-gray-600">
            Automatically generate professional company brochures powered by AI
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Generate Brochure</h2>
              <BrochureForm
                onSubmit={handleGenerateBrochure}
                loading={loading}
                isStreaming={isStreaming}
              />
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 min-h-96">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-semibold">{error}</p>
                </div>
              )}

              {loading && !brochure && (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Generating brochure...</p>
                  </div>
                </div>
              )}

              {brochure && <BrochureDisplay content={brochure} />}

              {!loading && !brochure && !error && (
                <div className="text-center text-gray-500 py-12">
                  <p className="text-lg">Enter company details and click "Generate" to create a brochure</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
