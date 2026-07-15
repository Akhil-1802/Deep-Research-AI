import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const TABS = [
  { key: 'writer_results', label: '📄 Report' },
  { key: 'critic_report', label: '🧠 Critique' },
]

function parseScore(text) {
  const match = text?.match(/Score:\s*(\d+)\/10/)
  return match ? parseInt(match[1]) : null
}

const mdComponents = {
  h1: ({ children }) => <h1 className="text-2xl font-bold text-white mt-6 mb-3 border-b border-slate-700 pb-2">{children}</h1>,
  h2: ({ children }) => <h2 className="text-xl font-bold text-indigo-300 mt-6 mb-2">{children}</h2>,
  h3: ({ children }) => <h3 className="text-base font-semibold text-purple-300 mt-4 mb-1">{children}</h3>,
  h4: ({ children }) => <h4 className="text-sm font-semibold text-indigo-200 mt-3 mb-1">{children}</h4>,
  p: ({ children }) => <p className="text-slate-300 text-sm leading-relaxed mb-2">{children}</p>,
  strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
  em: ({ children }) => <em className="text-slate-300 italic">{children}</em>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors">
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="space-y-1 my-2 ml-4">{children}</ul>,
  ol: ({ children }) => <ol className="space-y-1 my-2 ml-4 list-decimal list-inside">{children}</ol>,
  li: ({ children }) => (
    <li className="text-slate-300 text-sm flex gap-2">
      <span className="text-indigo-400 mt-0.5 shrink-0">▸</span>
      <span>{children}</span>
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-indigo-500 pl-4 my-3 text-slate-400 italic">{children}</blockquote>
  ),
  hr: () => <hr className="border-slate-700 my-4" />,
  code: ({ children }) => (
    <code className="bg-slate-800 text-emerald-300 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-4 rounded-xl border border-slate-700/60">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-indigo-500/20">{children}</thead>,
  tbody: ({ children }) => <tbody className="divide-y divide-slate-700/40">{children}</tbody>,
  tr: ({ children }) => <tr className="hover:bg-slate-800/40 transition-colors">{children}</tr>,
  th: ({ children }) => (
    <th className="px-4 py-2.5 text-left text-indigo-300 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-2.5 text-slate-300 text-xs leading-relaxed">{children}</td>
  ),
}

function MarkdownContent({ text }) {
  if (!text) return <p className="text-slate-500 text-sm">No content available.</p>
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
      {text}
    </ReactMarkdown>
  )
}

export default function ResearchReport({ result, topic }) {
  const [activeTab, setActiveTab] = useState('writer_results')
  const score = parseScore(result?.critic_report)

  return (
    <div className="space-y-6">
      {/* Summary banner */}
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 border border-indigo-500/20 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-1">
          <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Research Complete</p>
          <h2 className="text-2xl font-bold text-white capitalize">{topic}</h2>
          <p className="text-slate-400 text-sm mt-1">4 AI agents processed your topic successfully</p>
        </div>
        {score !== null && (
          <div className="flex flex-col items-center bg-slate-900/70 rounded-2xl px-8 py-4 border border-slate-700/40 shrink-0">
            <span className="text-slate-400 text-xs uppercase tracking-widest mb-1">Critic Score</span>
            <span className={`text-5xl font-bold tabular-nums ${score >= 7 ? 'text-emerald-400' : score >= 5 ? 'text-yellow-400' : 'text-red-400'}`}>
              {score}
            </span>
            <span className="text-slate-500 text-sm">/10</span>
          </div>
        )}
      </div>

      {/* Tabbed content */}
      <div className="bg-slate-900/50 border border-slate-700/40 rounded-3xl overflow-hidden backdrop-blur-sm">
        {/* Tab bar */}
        <div className="flex border-b border-slate-700/40 overflow-x-auto scrollbar-none">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 min-w-max px-5 py-3.5 text-sm font-medium transition-all duration-200 whitespace-nowrap
                ${activeTab === tab.key
                  ? 'bg-indigo-500/15 text-indigo-300 border-b-2 border-indigo-500'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/40'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <MarkdownContent text={result?.[activeTab]} />
        </div>
      </div>
    </div>
  )
}
