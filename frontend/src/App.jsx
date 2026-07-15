import { useState } from 'react'
import SearchBar from './components/SearchBar'
import AgentPipeline from './components/AgentPipeline'
import ResearchReport from './components/ResearchReport'

const AGENTS = [
  { key: 'search', label: 'Search Agent', icon: '🔍', desc: 'Scanning the web for relevant sources...' },
  { key: 'reader', label: 'Reader Agent', icon: '📖', desc: 'Scraping and extracting deep content...' },
  { key: 'writer', label: 'Writer Agent', icon: '✍️', desc: 'Composing structured research report...' },
  { key: 'critic', label: 'Critic Agent', icon: '🧠', desc: 'Reviewing and scoring the report...' },
]

export default function App() {
  const [topic, setTopic] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const [activeAgent, setActiveAgent] = useState(-1)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  async function handleSearch(t) {
    setTopic(t)
    setStatus('loading')
    setResult(null)
    setError('')

    // Simulate agent progress while waiting for API
    let step = 0
    setActiveAgent(0)
    const interval = setInterval(() => {
      step++
      if (step < AGENTS.length) setActiveAgent(step)
    }, 8000)

    try {
      const res = await fetch(`http://localhost:8000/topic/${encodeURIComponent(t)}`)
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      clearInterval(interval)
      setActiveAgent(AGENTS.length) // all done
      setResult(data)
      setStatus('done')
    } catch (e) {
      clearInterval(interval)
      setError(e.message)
      setStatus('error')
      setActiveAgent(-1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
      {/* Header */}
      <header className="pt-14 pb-6 text-center px-4">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-1.5 text-indigo-300 text-sm mb-5">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse inline-block" />
          Multi-Agent Research System
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent mb-3">
          Deep Research AI
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Enter any topic and watch 4 specialized AI agents collaborate to deliver a comprehensive research report.
        </p>
      </header>

      {/* Search */}
      <div className="max-w-2xl mx-auto px-4 mb-12">
        <SearchBar onSearch={handleSearch} loading={status === 'loading'} />
      </div>

      {/* Agent Pipeline */}
      {status !== 'idle' && (
        <div className="max-w-4xl mx-auto px-4 mb-12">
          <AgentPipeline agents={AGENTS} activeAgent={activeAgent} done={status === 'done'} />
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <div className="max-w-2xl mx-auto px-4 mb-10">
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 text-red-300 text-center">
            ⚠️ {error}
          </div>
        </div>
      )}

      {/* Results */}
      {status === 'done' && result && (
        <div className="max-w-4xl mx-auto px-4 pb-20">
          <ResearchReport result={result} topic={topic} />
        </div>
      )}
    </div>
  )
}
