import asyncio
import json
from agents import build_search_agent, build_reader_agent, writer_chain, critic_chain


async def run_pipeline_stream(topic: str):
    state = {}

    def sse(event: str, data: dict) -> str:
        return f"event: {event}\ndata: {json.dumps(data)}\n\n"

    # Search agent
    yield sse("agent_start", {"agent": "search"})
    search_agent = build_search_agent()
    search_result = await asyncio.to_thread(
        search_agent.invoke,
        {"messages": [("user", f"Find recent, reliable and detailed information about: {topic}")]}
    )
    state["search_results"] = search_result["messages"][-1].content
    yield sse("agent_done", {"agent": "search", "data": state["search_results"]})

    # Reader agent
    yield sse("agent_start", {"agent": "reader"})
    reader_agent = build_reader_agent()
    reader_result = await asyncio.to_thread(
        reader_agent.invoke,
        {"messages": [("user",
            f"Based on the following search results about '{topic}', "
            f"pick the most relevant URL and scrape it for deeper content.\n\n"
            f"Search Results:\n{state['search_results'][:800]}"
        )]}
    )
    state["reader_results"] = reader_result["messages"][-1].content
    yield sse("agent_done", {"agent": "reader", "data": state["reader_results"]})

    # Writer chain
    yield sse("agent_start", {"agent": "writer"})
    research_combined = (
        f"SEARCH RESULTS:\n{state['search_results']}\n\n"
        f"DETAILED SCRAPED CONTENT:\n{state['reader_results']}"
    )
    state["writer_results"] = await asyncio.to_thread(
        writer_chain.invoke,
        {"topic": topic, "research": research_combined}
    )
    yield sse("agent_done", {"agent": "writer", "data": state["writer_results"]})

    # Critic chain
    yield sse("agent_start", {"agent": "critic"})
    state["critic_report"] = await asyncio.to_thread(
        critic_chain.invoke,
        {"report": state["writer_results"]}
    )
    yield sse("agent_done", {"agent": "critic", "data": state["critic_report"]})

    yield sse("done", state)
