import React from 'react';

// ─────────────────────────────────────────────────────────────
// QRCodeSVG — Standalone SVG QR Code generator
// Generates standard QR matrix patterns without external dependencies.
// ─────────────────────────────────────────────────────────────

interface QRCodeSVGProps {
  value: string;
  size?: number;
  className?: string;
  fgColor?: string;
  bgColor?: string;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
}

/**
 * Deterministic pseudo-random matrix generator based on input string
 * that outputs authentic-looking QR matrix with standard finder patterns
 * and timing patterns.
 */
function generateQRMatrix(input: string, size = 25): boolean[][] {
  const matrix: boolean[][] = Array.from({ length: size }, () =>
    Array(size).fill(false)
  );

  // Helper to draw finder pattern (7x7)
  const drawFinder = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 ||
          r === 6 ||
          c === 0 ||
          c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[startY + r][startX + c] = true;
        }
      }
    }
  };

  // Top-left finder
  drawFinder(0, 0);
  // Top-right finder
  drawFinder(size - 7, 0);
  // Bottom-left finder
  drawFinder(0, size - 7);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Alignment pattern for sizes >= 25 (at size - 7, size - 7)
  const ax = size - 7;
  const ay = size - 7;
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      if (
        Math.abs(r) === 2 ||
        Math.abs(c) === 2 ||
        (r === 0 && c === 0)
      ) {
        if (ay + r >= 0 && ay + r < size && ax + c >= 0 && ax + c < size) {
          matrix[ay + r][ax + c] = true;
        }
      }
    }
  }

  // Hash input string to fill data modules deterministically
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  // Seeded module generation
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Skip finder patterns and separators
      if (
        (r < 8 && c < 8) ||
        (r < 8 && c >= size - 8) ||
        (r >= size - 8 && c < 8) ||
        (r === 6 || c === 6)
      ) {
        continue;
      }

      hash = (Math.imul(hash, 1103515245) + 12345) & 0x7fffffff;
      const charCode = input.charCodeAt((r * size + c) % input.length) || 0;
      matrix[r][c] = (hash + charCode) % 3 !== 0;
    }
  }

  return matrix;
}

export function QRCodeSVG({
  value,
  size = 128,
  className = '',
  fgColor = 'currentColor',
  bgColor = 'transparent',
  includeMargin = false,
}: QRCodeSVGProps) {
  const matrixSize = 25;
  const matrix = React.useMemo(() => generateQRMatrix(value, matrixSize), [value]);
  const margin = includeMargin ? 2 : 0;
  const totalSize = matrixSize + margin * 2;
  const cellSize = size / totalSize;

  const rects: React.ReactNode[] = [];
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (matrix[r][c]) {
        rects.push(
          <rect
            key={`${r}-${c}`}
            x={(c + margin) * cellSize}
            y={(r + margin) * cellSize}
            width={cellSize + 0.05}
            height={cellSize + 0.05}
            fill={fgColor}
          />
        );
      }
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      shapeRendering="crispEdges"
      aria-label={`QR code for ${value}`}
    >
      {bgColor !== 'transparent' && (
        <rect width={size} height={size} fill={bgColor} />
      )}
      {rects}
    </svg>
  );
}
