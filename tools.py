from langchain.tools import tool
from dotenv import load_dotenv
from tavily import TavilyClient
load_dotenv()
import os
import requests
from bs4 import BeautifulSoup
tavily = TavilyClient(api_key= os.getenv("TAVILY_API_KEY"))

@tool
def get_web_search(title : str) -> str:
    """Search the web for result. You will search the web and return the data with string.You will recieve title as input"""
    results = tavily.search(query = title, max_results = 5)
    out = []
    for r in results["results"]:
        
        out.append(f"Title : {r["title"]}\n Url : {r["url"]}\nSnippet : {r["content"][:300]}\n")
    return "\n--\n".join(out)


@tool
def scrape_url(url:str) -> str:
    """Scrape and return clean text content from given url for deeper reading"""
    try:
        res = requests.get(url,timeout=8,headers={"User-Agent":"Mozilla/5.0"})
        soup = BeautifulSoup(res.text,"html.parser")
        for tag in soup(["script","style","nav","footer"]):
            tag.decompose()
        return soup.get_text(separator=" ",strip= True)[:3000]

    except Exception as e:
        return f"Could not scrape URL:{str(e)}"

