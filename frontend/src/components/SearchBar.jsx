import { useState } from 'react'

export default function SearchBar({ onSearch, loading }) {
  const [value, setValue] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (value.trim() && !loading) onSearch(value.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
      <div className="relative flex items-center bg-slate-900/80 border border-slate-700/60 rounded-2xl overflow-hidden backdrop-blur-sm">
        <span className="pl-5 text-slate-400 text-xl">🔬</span>
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Enter a research topic... e.g. Quantum Computing"
          disabled={loading}
          className="flex-1 bg-transparent px-4 py-4 text-white placeholder-slate-500 text-base outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="m-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-semibold text-sm transition-all duration-200 whitespace-nowrap"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Researching...
            </span>
          ) : 'Research →'}
        </button>
      </div>
    </form>
  )
}
