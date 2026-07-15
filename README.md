# 🔬 Multi-Agent Research System

An AI-powered research assistant that uses a **4-agent pipeline** to automatically search the web, scrape content, write a structured report, and critically review it — all from a single topic input.

Built with **LangChain**, **Mistral AI**, **FastAPI**, and a **React + Vite + Tailwind CSS** frontend.

---

## 🧠 How It Works

```
User Input (Topic)
       │
       ▼
┌─────────────────┐
│  Search Agent   │  → Searches the web via Tavily for relevant sources
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Reader Agent   │  → Picks the best URL and scrapes deep content
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Writer Chain   │  → Composes a structured research report (Intro, Findings, Conclusion, Sources)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Critic Chain   │  → Reviews and scores the report (Score, Strengths, Areas to Improve)
└─────────────────┘
```

---

## 🗂️ Project Structure

```
Multi-Agent-System/
├── main.py              # FastAPI server — exposes GET /topic/{topic}
├── pipeline.py          # Core pipeline logic used by the API (no prints)
├── terminal.py          # CLI entry point — runs pipeline with live step-by-step output
├── agents.py            # Agent and chain definitions (Search, Reader, Writer, Critic)
├── tools.py             # LangChain tools: web search (Tavily) + URL scraper (BeautifulSoup)
├── requirements.txt     # Python dependencies
├── .env.example         # Environment variable template
└── frontend/            # React + Vite + Tailwind CSS web UI
    └── src/
        ├── App.jsx
        └── components/
            ├── SearchBar.jsx
            ├── AgentPipeline.jsx   # Live agent status tracker
            └── ResearchReport.jsx  # Tabbed markdown report viewer
```

---

## ⚙️ Setup

### 1. Clone the repo

```bash
git clone https://github.com/your-username/Multi-Agent-System.git
cd Multi-Agent-System
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your keys:

```env
MISTRAL_API_KEY=your_mistral_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
```

- Get a Mistral API key → https://console.mistral.ai
- Get a Tavily API key → https://app.tavily.com

### 3. Install Python dependencies

```bash
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

---

## 🌐 Web UI (Recommended)

### Start the backend

```bash
uvicorn main:app --reload
```

API will be live at `http://localhost:8000`

### Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will be live at `http://localhost:5173`

### Using the UI

1. Open `http://localhost:5173` in your browser
2. Type any research topic (e.g. `Quantum Computing`, `Climate Change 2025`)
3. Watch the 4 agents work in real-time via the pipeline tracker
4. View the full report across 4 tabs:
   - 📄 **Report** — structured research report with tables, headings, and sources
   - 🧠 **Critique** — critic's score, strengths, and areas to improve
   - 🔍 **Search Data** — raw search results from Tavily
   - 📖 **Scraped Content** — deep content extracted from the best URL

---

## 💻 Terminal Usage

Use `terminal.py` to run the full pipeline directly from the terminal without the web UI. It prints live progress for each agent step and displays the final report and critic review at the end.

> `pipeline.py` is the shared core logic used internally by both `terminal.py` and the FastAPI server — you don't run it directly.

### Interactive mode (prompts for input)

```bash
python terminal.py
```

**Example output:**

```
====================================================================================================
Step 1. Search Agent is working...
====================================================================================================
 search Results ...

====================================================================================================
Step 2. Reader Agent is working...
====================================================================================================
 Reader Results ...

====================================================================================================
Step 3. Writer Agent is working...
====================================================================================================
 Final Report ...

 ================================================== 
step 4 - critic is reviewing the report
==================================================
 critic report ...

============================================================
FINAL REPORT
============================================================
# Research Report: Artificial Intelligence in Healthcare
...

============================================================
CRITIC REVIEW
============================================================
Score: 8/10
Strengths:
- ...
```

---

## 🔌 API Reference

The FastAPI backend exposes a single endpoint:

| Method | Endpoint | Description |
|--------|------------------|-------------------------------|
| GET | `/topic/{topic}` | Run the full pipeline and return all agent results |

**Example request:**

```bash
curl http://localhost:8000/topic/quantum%20computing
```

**Response shape:**

```json
{
  "search_results": "...",
  "reader_results": "...",
  "writer_results": "...",
  "critic_report": "..."
}
```

Interactive API docs available at `http://localhost:8000/docs`

---

## 🛠️ Tech Stack

| Layer | Technology |
|------------|----------------------------------------------|
| LLM | Mistral AI (`magistral-small-latest`) |
| Agents | LangChain `create_agent` |
| Web Search | Tavily API |
| Scraping | BeautifulSoup4 + Requests |
| Backend | FastAPI + Uvicorn |
| Frontend | React 18 + Vite + Tailwind CSS v4 |
| Markdown | react-markdown + remark-gfm |

---

## 📄 License

MIT
