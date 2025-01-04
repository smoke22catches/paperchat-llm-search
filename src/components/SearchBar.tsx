import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <Input
          type="text"
          placeholder="Search for papers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-20 h-12 text-lg"
        />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="absolute right-2"
          disabled={isLoading}
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};