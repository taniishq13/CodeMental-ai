'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader, Zap } from 'lucide-react';

interface AnalysisResult {
  analysis: string;
  success: boolean;
}

const languages = [
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'go',
  'rust',
  'sql',
];

export default function Home() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 400) + 'px';
    }
  }, [code]);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError('Please paste some code to analyze');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis('');

    try {
      const response = await fetch('/api/analyze-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });

      const data: AnalysisResult = await response.json();

      if (!response.ok) {
        throw new Error(data.analysis || 'Failed to analyze code');
      }

      setAnalysis(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePasteExample = () => {
    setCode(`function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total = total + items[i].price * items[i].quantity;
  }
  return total;
}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Background Grid Effect */}
      <div className="fixed inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">AI-Powered Code Review</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            CodeMentor AI
          </h1>
          <p className="text-lg text-slate-300">
            Get instant, intelligent feedback on your code powered by Claude AI
          </p>
        </div>

        {/* Main Container */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Input Section */}
          <div className="flex flex-col">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden backdrop-blur-sm flex flex-col h-full">
              {/* Language Selector */}
              <div className="p-4 border-b border-slate-700">
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Code Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Code Input */}
              <div className="flex-1 p-4 overflow-hidden flex flex-col">
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Paste Your Code
                </label>
                <textarea
                  ref={textareaRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste your code here... or click 'Try Example' to see how it works"
                  className="flex-1 w-full px-3 py-2 bg-slate-700/50 text-white border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm font-mono"
                  style={{ minHeight: '200px' }}
                />
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-slate-700 flex gap-2">
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !code.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Analyze Code
                    </>
                  )}
                </button>
                <button
                  onClick={handlePasteExample}
                  disabled={loading}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white font-medium rounded-md transition-colors text-sm"
                >
                  Try Example
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="flex flex-col">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden backdrop-blur-sm flex flex-col h-full">
              <div className="p-4 border-b border-slate-700">
                <h2 className="text-sm font-medium text-slate-200">AI Analysis</h2>
              </div>

              {/* Analysis Output */}
              <div className="flex-1 p-4 overflow-y-auto">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-md text-red-200 text-sm">
                    {error}
                  </div>
                )}

                {loading && (
                  <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                    <Loader className="w-8 h-8 animate-spin mb-2 text-blue-400" />
                    <p className="text-sm">Analyzing your code with Claude AI...</p>
                  </div>
                )}

                {analysis && !loading && (
                  <div className="prose prose-invert max-w-none text-sm">
                    <div className="text-slate-100 whitespace-pre-wrap leading-relaxed font-sans">
                      {analysis}
                    </div>
                  </div>
                )}

                {!analysis && !loading && !error && (
                  <div className="flex items-center justify-center h-40 text-slate-400">
                    <p className="text-center text-sm">
                      Paste your code and click "Analyze Code" to get AI-powered insights
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-slate-400 text-sm">
          <p>Built with Next.js, TypeScript, and Claude AI by a future Galaxy AI team member 🚀</p>
        </div>
      </div>
    </div>
  );
}