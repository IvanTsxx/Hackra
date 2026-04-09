import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  return (
    <div
      className={cn(
        "prose prose-neutral prose-sm max-w-none dark:prose-invert",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-brand-green underline underline-offset-2 hover:opacity-80"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-brand-green/40 pl-4 my-4 text-sm text-muted-foreground italic">
              {children}
            </blockquote>
          ),
          // oxlint-disable-next-line no-shadow
          code: ({ children, className }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <code className="block   text-xs text-brand-green bg-secondary/60 border border-border/40 px-3 py-2 overflow-x-auto">
                  {children}
                </code>
              );
            }
            return (
              <code className="  text-xs text-brand-green bg-secondary/60 px-1 py-0.5">
                {children}
              </code>
            );
          },
          h1: ({ children }) => (
            <h1 className="font-pixel text-xl text-foreground mt-6 mb-3">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-pixel text-base text-foreground mt-5 mb-2 pb-1 border-b border-border/40">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-pixel text-sm text-foreground mt-4 mb-2">
              {children}
            </h3>
          ),
          hr: () => <hr className="border-border/40 my-6" />,
          li: ({ children }) => (
            <li className="text-sm text-muted-foreground flex gap-2 items-start before:content-['—'] before:text-border/60 before:  before:shrink-0">
              <span>{children}</span>
            </li>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 my-3 text-sm text-muted-foreground">
              {children}
            </ol>
          ),
          p: ({ children }) => (
            <p className="  text-sm text-muted-foreground leading-relaxed mb-3">
              {children}
            </p>
          ),
          pre: ({ children }) => (
            <pre className="my-4 overflow-x-auto">{children}</pre>
          ),
          strong: ({ children }) => (
            <strong className="text-foreground font-semibold">
              {children}
            </strong>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="w-full text-sm border-collapse">
                {children}
              </table>
            </div>
          ),
          td: ({ children }) => (
            <td className="  text-xs border border-border/40 px-3 py-2 text-muted-foreground">
              {children}
            </td>
          ),
          th: ({ children }) => (
            <th className="  text-xs text-left border border-border/40 px-3 py-2 text-muted-foreground bg-secondary/50">
              {children}
            </th>
          ),
          ul: ({ children }) => (
            <ul className="list-none space-y-1 my-3 pl-0">{children}</ul>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
