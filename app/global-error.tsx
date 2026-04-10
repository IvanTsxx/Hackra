"use client";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";

  console.error(error);

  return (
    <html lang="en">
      <head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

          * { box-sizing: border-box; }

          :root {
            --brand-green: oklch(0.72 0.19 145);
            --brand-purple: oklch(0.62 0.19 285);
            --brand-glow: oklch(0.72 0.19 145 / 0.15);
          }

          body {
            margin: 0;
            font-family: 'VT323', monospace;
            padding: 2rem;
            background: #0a0a0a;
            color: #fff;
            font-size: 18px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .error-container {
            width: 100%;
            max-width: 560px;
            min-width: 0;
          }

          .error-header {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 1rem;
          }

          .error-icon {
            width: 48px;
            height: 48px;
            border: 3px solid var(--brand-purple);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            font-weight: normal;
            color: var(--brand-purple);
            box-shadow: 
              0 0 10px var(--brand-purple),
              inset 0 0 10px var(--brand-purple / 0.2);
            flex-shrink: 0;
          }

          .error-message {
            margin: 0;
            font-size: 1.5rem;
            line-height: 1.3;
            color: #fff;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .error-message code {
            background: var(--brand-green / 0.2);
            color: var(--brand-green);
            padding: 0.1em 0.4em;
            border: 1px solid var(--brand-green);
          }

          .error-summary {
            margin: 0.5rem 0 1.5rem 0;
            padding: 1rem;
            background: rgba(239, 68, 68, 0.1);
            border: 2px solid #ef4444;
            color: #ef4444;
            font-size: 1rem;
            line-height: 1.5;
          }

          .error-details-wrapper {
            margin: 1rem 0 0 0;
          }

          .error-details summary {
            list-style: none;
            cursor: pointer;
            padding: 12px 16px;
            background: var(--brand-green / 0.1);
            border: 2px solid var(--brand-green);
            color: var(--brand-green);
            font-size: 1rem;
            user-select: none;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s ease;
          }

          .error-details summary:hover {
            background: var(--brand-green / 0.2);
          }

          .error-details summary::-webkit-details-marker {
            display: none;
          }

          .error-details summary .chevron {
            display: inline-flex;
            align-items: center;
            font-size: 0.8rem;
            transition: transform 0.2s ease;
            transform: rotate(-90deg);
          }

          .error-details[open] summary .chevron {
            transform: rotate(0deg);
          }

          .error-details[open] summary {
            border-bottom: none;
          }

          .error-stack-slot {
            max-height: 320px;
            margin-top: 0;
          }

          .error-details-wrapper:not(:has(details[open])) .error-stack {
            visibility: hidden;
          }

          .error-stack {
            margin: 0;
            padding: 1rem;
            background: rgba(0, 0, 0, 0.5);
            border: 2px solid var(--brand-green);
            border-top: none;
            overflow: auto;
            max-width: 100%;
            min-width: 0;
            height: 300px;
            box-sizing: border-box;
            font-size: 14px;
            line-height: 1.5;
            color: var(--brand-green);
            font-family: 'VT323', monospace;
          }

          .terminal-prompt {
            display: inline-block;
            color: var(--brand-green);
            margin-right: 8px;
          }

          @media (max-width: 640px) {
            body {
              padding: 1rem;
            }

            .error-icon {
              width: 40px;
              height: 40px;
              font-size: 24px;
            }

            .error-message {
              font-size: 1.25rem;
            }

            .error-stack {
              font-size: 12px;
              height: 250px;
            }
          }
        `}</style>
      </head>
      <body>
        <div className="error-container">
          <div className="error-header">
            <div className="error-icon">!</div>
            <div>
              <p className="error-message">Critical Error</p>
            </div>
          </div>
          <div className="error-summary">
            <span className="terminal-prompt">&gt;</span>
            {error.message || "Unknown error occurred"}
          </div>
          <p style={{ fontSize: "0.9rem", margin: "0 0 1rem 0", opacity: 0.7 }}>
            Path: <code>{pathname || "/"}</code>
          </p>
          {error.stack && (
            <div className="error-details-wrapper">
              <details className="error-details">
                <summary>
                  <span className="chevron">▼</span>
                  View error trace
                </summary>
                <div className="error-stack-slot">
                  <pre className="error-stack">{error.stack}</pre>
                </div>
              </details>
            </div>
          )}
        </div>
      </body>
    </html>
  );
}
