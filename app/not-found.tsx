"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/shared/components/ui/button";

export default function NotFound() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="not-found-container">
      <div className="pixel-grid-background" />
      <div className="content">
        <div className="glitch-wrapper">
          <h1 className="error-code">404</h1>
          <div className="glitch-line" />
        </div>

        <div className="message">
          <h2 className="title">PAGE NOT FOUND</h2>
          <p className="subtitle">Lost in the code...</p>
        </div>

        <div className="terminal-box">
          <div className="terminal-header">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
            <span className="terminal-title">ERROR_404.EXE</span>
          </div>
          <div className="terminal-body">
            <p>{`> The requested page could not be located.`}</p>
            <p>{`> Return to the main hub to continue.`}</p>
            <p className="cursor">_</p>
          </div>
        </div>

        <Button
          onClick={() => router.push("/")}
          className="go-home-button"
          variant="outline"
          size="lg"
        >
          <span className="button-icon">‹</span>
          Go Home
        </Button>

        {mounted && (
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

            .not-found-container {
              min-height: 100vh;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              position: relative;
              overflow: hidden;
              background: #0a0a0a;
              font-family: 'VT323', monospace;
            }

            .pixel-grid-background {
              position: absolute;
              inset: 0;
              background-image: 
                linear-gradient(rgba(46, 204, 113, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(46, 204, 113, 0.03) 1px, transparent 1px);
              background-size: 20px 20px;
              pointer-events: none;
            }

            .content {
              position: relative;
              z-index: 1;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 2rem;
              padding: 2rem;
            }

            .glitch-wrapper {
              position: relative;
            }

            .error-code {
              font-size: 12rem;
              font-weight: 400;
              line-height: 1;
              color: oklch(0.72 0.19 145);
              text-shadow: 
                0 0 20px oklch(0.72 0.19 145 / 0.5),
                0 0 40px oklch(0.72 0.19 145 / 0.3),
                0 0 60px oklch(0.72 0.19 145 / 0.2),
                4px 4px 0 oklch(0.62 0.19 285),
                -2px -2px 0 oklch(0.72 0.19 145 / 0.3);
              animation: glitch 3s infinite;
              letter-spacing: -0.05em;
            }

            @keyframes glitch {
              0%, 90%, 100% { transform: translate(0); }
              92% { transform: translate(-2px, 1px); }
              94% { transform: translate(2px, -1px); }
              96% { transform: translate(-1px, 2px); }
              98% { transform: translate(1px, -2px); }
            }

            .glitch-line {
              position: absolute;
              bottom: -10px;
              left: 50%;
              transform: translateX(-50%);
              width: 60%;
              height: 4px;
              background: oklch(0.62 0.19 285);
              box-shadow: 0 0 10px oklch(0.62 0.19 285 / 0.5);
            }

            .message {
              text-align: center;
            }

            .title {
              font-size: 2.5rem;
              font-weight: 400;
              color: #fff;
              margin: 0;
              letter-spacing: 0.1em;
              text-transform: uppercase;
            }

            .subtitle {
              font-size: 1.25rem;
              color: oklch(0.72 0.19 145);
              margin: 0.5rem 0 0;
              opacity: 0.8;
            }

            .terminal-box {
              background: rgba(0, 0, 0, 0.6);
              border: 2px solid oklch(0.72 0.19 145);
              border-radius: 0;
              width: 100%;
              max-width: 400px;
              overflow: hidden;
              box-shadow: 
                0 0 20px oklch(0.72 0.19 145 / 0.2),
                inset 0 0 20px rgba(0, 0, 0, 0.5);
            }

            .terminal-header {
              display: flex;
              align-items: center;
              gap: 6px;
              padding: 8px 12px;
              background: oklch(0.72 0.19 145 / 0.1);
              border-bottom: 1px solid oklch(0.72 0.19 145 / 0.3);
            }

            .dot {
              width: 10px;
              height: 10px;
              border-radius: 0;
            }

            .dot.red { background: #ef4444; }
            .dot.yellow { background: #eab308; }
            .dot.green { background: oklch(0.72 0.19 145); }

            .terminal-title {
              margin-left: auto;
              font-size: 0.875rem;
              color: oklch(0.72 0.19 145);
              opacity: 0.8;
            }

            .terminal-body {
              padding: 16px;
              font-size: 1rem;
              color: #fff;
              line-height: 1.6;
            }

            .terminal-body p {
              margin: 0;
              opacity: 0.9;
            }

            .cursor {
              animation: blink 1s step-end infinite;
            }

            @keyframes blink {
              0%, 50% { opacity: 1; }
              51%, 100% { opacity: 0; }
            }

            .go-home-button {
              font-family: 'VT323', monospace;
              font-size: 1.25rem;
              letter-spacing: 0.05em;
              padding: 0.75rem 2rem;
              border: 2px solid oklch(0.72 0.19 145);
              background: transparent;
              color: oklch(0.72 0.19 145);
              border-radius: 0;
              cursor: pointer;
              transition: all 0.2s ease;
              text-transform: uppercase;
            }

            .go-home-button:hover {
              background: oklch(0.72 0.19 145);
              color: #0a0a0a;
              box-shadow: 0 0 20px oklch(0.72 0.19 145 / 0.5);
            }

            .button-icon {
              margin-right: 8px;
              font-size: 1.5rem;
              line-height: 1;
            }

            @media (max-width: 640px) {
              .error-code {
                font-size: 6rem;
              }

              .title {
                font-size: 1.5rem;
              }

              .terminal-box {
                max-width: 100%;
              }
            }
          `}</style>
        )}
      </div>
    </div>
  );
}
