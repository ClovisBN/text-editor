import { getTextLines } from "../text/paragraph";
import { renderText } from "./render";

let cursorPosition = { x: 10, y: 20 };
let cursorVisible = true;

const cursorState = {
  lineIndex: 0,
  charIndex: 0,
};

export function drawCursor(
  ctx: CanvasRenderingContext2D,
  position: { x: number; y: number }
) {
  ctx.fillStyle = "black"; // Ensure the cursor is drawn in black
  ctx.fillRect(position.x, position.y - 15, 2, 20); // Drawing cursor
}

export function updateCursorPosition(
  lineIndex: number,
  charIndex: number,
  ctx: CanvasRenderingContext2D
) {
  cursorState.lineIndex = lineIndex;
  cursorState.charIndex = charIndex;

  const lines = getTextLines();
  if (lineIndex < 0 || lineIndex >= lines.length) return; // Check bounds
  const line = lines[lineIndex];
  const textBeforeCursor = line.substring(0, charIndex);
  cursorPosition.x = 10 + ctx.measureText(textBeforeCursor).width;
  cursorPosition.y = 20 + lineIndex * 20; // Calculate y position based on line index
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
      ctx.fillStyle = "white"; // Set fill style to white before clearing the cursor
      ctx.clearRect(cursorPosition.x, cursorPosition.y - 15, 2, 20); // Clear cursor
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
  const lineHeight = 20; // Line height used for cursor positioning
  const lineIndex = Math.min(
    Math.floor((y - 5) / lineHeight),
    lines.length - 1
  ); // Adjusted y offset calculation
  const line = lines[lineIndex] || "";
  let charIndex = line.length;
  let width = 10; // Starting x position

  // Check if the click is beyond the last line of text
  if (y > (lines.length - 1) * lineHeight + lineHeight) {
    updateCursorPosition(lines.length - 1, lines[lines.length - 1].length, ctx);
    return;
  }

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

export function handleMouseMove(
  event: MouseEvent,
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) {
  const rect = ctx.canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const lines = getTextLines();
  const lineHeight = 20; // Line height used for cursor positioning
  const lineIndex = Math.floor((y - 5) / lineHeight); // Adjusted y offset calculation

  let isHoveringText = false;
  if (lineIndex >= 0 && lineIndex < lines.length) {
    const line = lines[lineIndex] || "";
    let width = 10;

    for (let i = 0; i < line.length; i++) {
      const charWidth = ctx.measureText(line[i]).width;
      if (x < width + charWidth) {
        isHoveringText = true;
        break;
      }
      width += charWidth;
    }
  }

  if (isHoveringText) {
    canvas.style.cursor = "text";
  } else {
    canvas.style.cursor = "default";
  }
}

export function getCursorState() {
  return cursorState;
}

export function setCursorState(lineIndex: number, charIndex: number) {
  cursorState.lineIndex = lineIndex;
  cursorState.charIndex = charIndex;
}
