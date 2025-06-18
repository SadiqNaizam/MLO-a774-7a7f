import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Copy, Check } from 'lucide-react';

interface SyntaxHighlightedCodeBlockProps {
  codeString: string;
  language?: string; // Language for potential future syntax highlighting libraries
}

const SyntaxHighlightedCodeBlock: React.FC<SyntaxHighlightedCodeBlockProps> = ({
  codeString,
  language = 'typescript',
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  console.log('SyntaxHighlightedCodeBlock loaded');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      toast({
        title: "Copied to clipboard!",
        description: "The code has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000); // Reset icon after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast({
        title: "Failed to copy",
        description: "Could not copy the code to your clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative group bg-gray-900 dark:bg-gray-800 rounded-md shadow-md my-4">
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="text-gray-400 hover:text-gray-200 hover:bg-gray-700 dark:hover:bg-gray-600"
          aria-label="Copy code to clipboard"
        >
          {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      <pre className="p-4 text-sm text-gray-100 dark:text-gray-50 overflow-x-auto font-mono">
        <code className={`language-${language}`}>
          {codeString}
        </code>
      </pre>
      <div className="absolute bottom-2 right-2 px-2 py-1 text-xs text-gray-500 bg-gray-800 dark:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {language}
      </div>
    </div>
  );
};

export default SyntaxHighlightedCodeBlock;