import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { Paper } from "@/types";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  paper: Paper;
  onClose: () => void;
}

export const ChatInterface = ({ paper, onClose }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("OPENAI_API_KEY")}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are a helpful assistant discussing the following scientific paper:
              Title: ${paper.title}
              Authors: ${paper.authors.join(", ")}
              Abstract: ${paper.abstract}
              
              Provide clear and concise responses about this paper.`,
            },
            ...messages,
            { role: "user", content: userMessage },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.choices[0].message.content },
      ]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="container flex flex-col h-full max-w-3xl mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{paper.title}</h2>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${
                message.role === "assistant" ? "bg-muted" : "bg-accent"
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          ))}
          {isLoading && (
            <div className="chat-message bg-muted">
              <p className="text-sm">Thinking...</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the paper..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};