from agents import build_reader_agent,build_search_agent,writer_chain,critic_chain



def run_pipeline(topic : str) -> dict:
    state = {}

    #search agent
   

    search_agent = build_search_agent()
    search_result = search_agent.invoke({
        "messages":[("user",f"Find recent, reliable and detailed information about : {topic}")]
    })
    state["search_results"] = search_result['messages'][-1].content

    #reader agent

    reader_agent = build_reader_agent()
    reader_result = reader_agent.invoke({
        "messages": [("user",
            f"Based on the following search results about '{topic}', "
            f"pick the most relevant URL and scrape it for deeper content.\n\n"
            f"Search Results:\n{state['search_results'][:800]}"
        )]
    })

    state["reader_results"] = reader_result['messages'][-1].content
    
    #writer chain

    research_combined = (
        f"SEARCH RESULTS : \n {state['search_results']} \n\n"
        f"DETAILED SCRAPED CONTENT : \n {state['reader_results']}"
    )
    state["writer_results"] = writer_chain.invoke({
        "topic":topic,
        "research":research_combined
    })
    #critic chain

    state["critic_report"] = critic_chain.invoke({
        "report" : state["writer_results"]
    })

    return state


