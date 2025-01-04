import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface Paper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  url: string;
}

interface PaperCardProps {
  paper: Paper;
  onChat: (paper: Paper) => void;
}

export const PaperCard = ({ paper, onChat }: PaperCardProps) => {
  return (
    <Card className="paper-card">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold leading-tight">
            <a
              href={paper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {paper.title}
            </a>
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {paper.authors.join(", ")}
          </p>
        </div>
        <p className="text-sm leading-relaxed">{paper.abstract}</p>
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => onChat(paper)}
          >
            <MessageSquare className="h-4 w-4" />
            Chat about this paper
          </Button>
        </div>
      </div>
    </Card>
  );
};