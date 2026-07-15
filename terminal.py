from agents import build_reader_agent,build_search_agent,writer_chain,critic_chain



def run_pipeline_terminal(topic : str) -> dict:
    state = {}

    #search agent
    print("=="*50)
    print("Step 1. Search Agent is working...")
    print("=="*50)

    search_agent = build_search_agent()
    search_result = search_agent.invoke({
        "messages":[("user",f"Find recent, reliable and detailed information about : {topic}")]
    })
    state["search_results"] = search_result['messages'][-1].content

    print("\n search Results",state["search_results"])

    #reader agent
    print("=="*50)
    print("Step 2. Reader Agent is working...")
    print("=="*50)

    reader_agent = build_reader_agent()
    reader_result = reader_agent.invoke({
        "messages": [("user",
            f"Based on the following search results about '{topic}', "
            f"pick the most relevant URL and scrape it for deeper content.\n\n"
            f"Search Results:\n{state['search_results'][:800]}"
        )]
    })

    state["reader_results"] = reader_result['messages'][-1].content
    print("\n Reader Results",state["reader_results"])

    #writer chain
    print("=="*50)
    print("Step 3. Writer Agent is working...")
    print("=="*50)

    research_combined = (
        f"SEARCH RESULTS : \n {state['search_results']} \n\n"
        f"DETAILED SCRAPED CONTENT : \n {state['reader_results']}"
    )
    state["writer_results"] = writer_chain.invoke({
        "topic":topic,
        "research":research_combined
    })

    print("\n Final Report\n",state['writer_results'])
    #critic chain
    print("\n"+" ="*50)
    print("step 4 - critic is reviewing the report ")
    print("="*50)

    state["critic_report"] = critic_chain.invoke({
        "report" : state["writer_results"]
    })

    print("\n critic report \n", state['critic_report'])

    return state

if __name__ == "__main__":
    import sys
    topic = sys.argv[1] if len(sys.argv) > 1 else input("Enter your topic: ")
    result = run_pipeline_terminal(topic)
    print("\n" + "="*60)
    print("FINAL REPORT")
    print("="*60)
    print(result["writer_results"])
    print("\n" + "="*60)
    print("CRITIC REVIEW")
    print("="*60)
    print(result["critic_report"])
