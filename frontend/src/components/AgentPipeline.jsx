export default function AgentPipeline({ agents, activeAgent, done }) {
  return (
    <div className="bg-slate-900/50 border border-slate-700/40 rounded-3xl p-6 backdrop-blur-sm">
      <h2 className="text-slate-300 text-sm font-semibold uppercase tracking-widest mb-6 text-center">
        Agent Pipeline
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {agents.map((agent, i) => {
          const isActive = activeAgent === i
          const isDone = done ? true : activeAgent > i
          const isPending = !isActive && !isDone

          return (
            <div
              key={agent.key}
              className={`relative rounded-2xl p-4 border transition-all duration-500 text-center
                ${isActive ? 'bg-indigo-500/15 border-indigo-500/50 shadow-lg shadow-indigo-500/10' : ''}
                ${isDone ? 'bg-emerald-500/10 border-emerald-500/30' : ''}
                ${isPending ? 'bg-slate-800/40 border-slate-700/30 opacity-50' : ''}
              `}
            >
              {/* Step number */}
              <div className={`absolute -top-2.5 -left-2.5 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center
                ${isDone ? 'bg-emerald-500 text-white' : isActive ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'}
              `}>
                {isDone ? '✓' : i + 1}
              </div>

              {/* Icon */}
              <div className={`text-3xl mb-2 ${isActive ? 'animate-bounce' : ''}`}>
                {agent.icon}
              </div>

              <div className={`font-semibold text-sm mb-1
                ${isActive ? 'text-indigo-300' : isDone ? 'text-emerald-300' : 'text-slate-500'}
              `}>
                {agent.label}
              </div>

              <div className="text-xs text-slate-500 leading-snug">
                {isDone ? 'Completed' : isActive ? agent.desc : 'Waiting...'}
              </div>

              {/* Active pulse bar */}
              {isActive && (
                <div className="mt-3 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-[progress_2s_ease-in-out_infinite]" style={{ width: '60%' }} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Overall status */}
      <div className="mt-5 text-center text-sm">
        {done ? (
          <span className="text-emerald-400 font-medium">✅ All agents completed — report ready!</span>
        ) : (
          <span className="text-indigo-300 animate-pulse">
            {activeAgent >= 0 ? `Running: ${agents[activeAgent]?.label}` : 'Initializing...'}
          </span>
        )}
      </div>
    </div>
  )
}
