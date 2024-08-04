import { getTextLines } from "../text/paragraph";
import { renderText } from "./render";

let cursorPosition = { x: 10, y: 20 };
let cursorVisible = true;

export function drawCursor(
  ctx: CanvasRenderingContext2D,
  position: { x: number; y: number }
) {
  ctx.fillRect(position.x, position.y - 15, 2, 20);
}

export function updateCursorPosition(
  lineIndex: number,
  charIndex: number,
  ctx: CanvasRenderingContext2D
) {
  const lines = getTextLines();
  if (lineIndex < 0 || lineIndex >= lines.length) return; // Check bounds
  const line = lines[lineIndex];
  const textBeforeCursor = line.substring(0, charIndex);
  cursorPosition.x = 10 + ctx.measureText(textBeforeCursor).width;
  cursorPosition.y = 20 + lineIndex * 20;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear canvas before drawing
  renderText(ctx); // Re-render the text to avoid clearing it with the cursor
  drawCursor(ctx, cursorPosition);
}

export function initializeCursorBlinking(ctx: CanvasRenderingContext2D) {
  setInterval(() => {
    cursorVisible = !cursorVisible;
    if (cursorVisible) {
      drawCursor(ctx, cursorPosition);
    } else {
      ctx.clearRect(cursorPosition.x, cursorPosition.y - 15, 2, 20);
    }
  }, 500);
}

export function handleMouseClick(
  event: MouseEvent,
  ctx: CanvasRenderingContext2D
) {
  const rect = ctx.canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const lines = getTextLines();
  const lineIndex = Math.min(Math.floor((y - 20) / 20), lines.length - 1); // Check bounds
  const line = lines[lineIndex] || "";
  let charIndex = 0;
  let width = 10; // Starting x position

  for (let i = 0; i < line.length; i++) {
    const charWidth = ctx.measureText(line[i]).width;
    if (x < width + charWidth) {
      charIndex = i;
      break;
    }
    width += charWidth;
  }

  updateCursorPosition(lineIndex, charIndex, ctx);
}
