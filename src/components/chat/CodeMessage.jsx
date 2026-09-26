import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Copy, Check, ListChecks } from 'lucide-react';

export default function CodeMessage({ message, code, language, instructions, isSpecialMode }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // ignore
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-3"
    >
      {message && (
        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-4 shadow-sm">
          <p className="text-gray-700 text-[15px] leading-relaxed">{message}</p>
        </div>
      )}

      {code && (
        <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg">
          <div className="flex items-center justify-between px-4 py-2.5 bg-gray-800/80 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <Code2 className={`w-4 h-4 ${isSpecialMode ? 'text-pink-400' : 'text-violet-400'}`} />
              <span className="text-xs font-medium text-gray-300 uppercase tracking-wide">
                {language || 'code'}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white bg-gray-700/60 hover:bg-gray-700 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>
          <pre className="p-4 overflow-x-auto text-sm leading-relaxed max-h-[420px]">
            <code className="text-gray-100 font-mono whitespace-pre">{code}</code>
          </pre>
        </div>
      )}

      {instructions && instructions.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isSpecialMode
                ? 'bg-gradient-to-br from-amber-100 to-pink-100'
                : 'bg-gradient-to-br from-violet-100 to-indigo-100'
            }`}>
              <ListChecks className={`w-4 h-4 ${isSpecialMode ? 'text-pink-600' : 'text-violet-600'}`} />
            </div>
            <h4 className="font-semibold text-gray-800 text-sm">How to use it (super easy!)</h4>
          </div>
          <ol className="space-y-2.5">
            {instructions.map((step, idx) => (
              <li key={idx} className="flex gap-3 text-gray-600 text-[14px] leading-relaxed">
                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isSpecialMode
                    ? 'bg-gradient-to-br from-amber-400 to-pink-500 text-white'
                    : 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white'
                }`}>
                  {idx + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </motion.div>
  );
}