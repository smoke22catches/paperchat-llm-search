import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { PaperCard } from "@/components/PaperCard";
import { ChatInterface } from "@/components/ChatInterface";
import { Paper } from "@/types";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const { toast } = useToast();

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      // For demo purposes, we'll use a mock API call
      const response = await fetch(
        `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(
          query
        )}&start=0&max_results=10`
      );
      const data = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");
      const entries = xmlDoc.getElementsByTagName("entry");

      const parsedPapers: Paper[] = Array.from(entries).map((entry) => ({
        id: entry.getElementsByTagName("id")[0]?.textContent || "",
        title:
          entry
            .getElementsByTagName("title")[0]
            ?.textContent?.replace(/\s+/g, " ")
            .trim() || "",
        authors: Array.from(entry.getElementsByTagName("author")).map(
          (author) => author.getElementsByTagName("name")[0]?.textContent || ""
        ),
        abstract:
          entry
            .getElementsByTagName("summary")[0]
            ?.textContent?.replace(/\s+/g, " ")
            .trim() || "",
        url: entry.getElementsByTagName("id")[0]?.textContent || "",
      }));

      setPapers(parsedPapers);
    } catch (error) {
      console.error("Error fetching papers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch papers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChat = (paper: Paper) => {
    if (!localStorage.getItem("PERPLEXITY_API_KEY")) {
      const apiKey = prompt("Please enter your Perplexity API key:");
      if (apiKey) {
        localStorage.setItem("PERPLEXITY_API_KEY", apiKey);
      } else {
        toast({
          title: "API Key Required",
          description: "Please provide a Perplexity API key to use the chat feature.",
          variant: "destructive",
        });
        return;
      }
    }
    setSelectedPaper(paper);
  };

  return (
    <div className="min-h-screen py-8 px-4 space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Scientific Paper Search</h1>
        <p className="text-muted-foreground">
          Search and chat about scientific papers from arXiv
        </p>
      </div>

      <SearchBar onSearch={handleSearch} isLoading={isLoading} />

      <div className="max-w-4xl mx-auto space-y-6">
        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : (
          papers.map((paper) => (
            <PaperCard key={paper.id} paper={paper} onChat={handleChat} />
          ))
        )}
      </div>

      {selectedPaper && (
        <ChatInterface
          paper={selectedPaper}
          onClose={() => setSelectedPaper(null)}
        />
      )}
    </div>
  );
};

export default Index;