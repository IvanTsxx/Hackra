// oxlint-disable promise/avoid-new
"use client";

/* eslint-disable no-new */
/* eslint-disable prefer-await-to-then */

import { useEffect, useState } from "react";

interface HackathonBackgroundProps {
  imageUrl?: string | null;
}

/* eslint-disable no-new */
/* eslint-disable prefer-await-to-then */
/* eslint-disable unicorn/consistent-function-scoping */
async function extractDominantColor(imageUrl: string): Promise<string | null> {
  const toHex = (n: number) => n.toString(16).padStart(2, "0");

  try {
    const img = new globalThis.Image();
    img.crossOrigin = "anonymous";

    await new Promise((resolve, reject) => {
      img.addEventListener("load", resolve, { once: true });
      img.addEventListener("error", reject, { once: true });
      img.src = imageUrl;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return null;
    }

    const size = 50;
    canvas.width = size;
    canvas.height = size;

    ctx.drawImage(img, 0, 0, size, size);

    const imageData = ctx.getImageData(0, 0, size, size);
    const { data } = imageData;

    let b = 0,
      count = 0,
      g = 0,
      r = 0;

    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3];
      if (alpha > 128) {
        b += data[i + 2];
        g += data[i + 1];
        r += data[i];
        count += 1;
      }
    }

    if (count === 0) {
      return null;
    }

    b = Math.round(b / count);
    g = Math.round(g / count);
    r = Math.round(r / count);

    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    const desaturated = 0.4;
    b = Math.round(b * (1 - desaturated) + gray * desaturated);
    g = Math.round(g * (1 - desaturated) + gray * desaturated);
    r = Math.round(r * (1 - desaturated) + gray * desaturated);

    const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

    return hex;
  } catch {
    return null;
  }
}

function isDarkMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

/* eslint-disable prefer-await-to-then */
export function HackathonBackground({ imageUrl }: HackathonBackgroundProps) {
  const [color, setColor] = useState<string | null>(null);

  useEffect(() => {
    if (!imageUrl) {
      setColor(null);
      return;
    }

    const abortController = new AbortController();

    extractDominantColor(imageUrl)
      .then((extractedColor) => {
        if (!abortController.signal.aborted) {
          setColor(extractedColor);
        }
      })
      .catch(() => {
        if (!abortController.signal.aborted) {
          setColor(null);
        }
      });

    return () => {
      abortController.abort();
    };
  }, [imageUrl]);

  if (!imageUrl || !color) return null;

  const isDark = isDarkMode();
  const startColor = isDark ? "#000000" : "#ffffff";
  const endColor = `${color}b3`;

  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        background: `linear-gradient(90deg, ${startColor}, ${endColor})`,
      }}
    />
  );
}
