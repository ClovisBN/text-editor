import { getTextLines } from "../text/paragraph";
import { renderText } from "./render";

let isSelecting = false;
let selectionStart = { lineIndex: 0, charIndex: 0 };
let selectionEnd = { lineIndex: 0, charIndex: 0 };

export function drawSelection(ctx: CanvasRenderingContext2D) {
  const lines = getTextLines();
  if (!lines.length) return;

  const start = selectionStart;
  const end = selectionEnd;

  ctx.fillStyle = "rgba(0, 0, 255, 0.3)";

  if (start.lineIndex === end.lineIndex) {
    // Single line selection
    const line = lines[start.lineIndex];
    const textBeforeStart = line.substring(0, start.charIndex);
    const textBeforeEnd = line.substring(0, end.charIndex);
    const startX = 10 + ctx.measureText(textBeforeStart).width;
    const endX = 10 + ctx.measureText(textBeforeEnd).width;
    const y = 20 + start.lineIndex * 20;
    ctx.fillRect(startX, y - 15, endX - startX, 20);
  } else {
    // Multi-line selection
    for (let i = start.lineIndex; i <= end.lineIndex; i++) {
      const line = lines[i];
      if (line === undefined) continue; // Skip if line is undefined
      if (i === start.lineIndex) {
        const textBeforeStart = line.substring(0, start.charIndex);
        const startX = 10 + ctx.measureText(textBeforeStart).width;
        const y = 20 + i * 20;
        ctx.fillRect(startX, y - 15, ctx.canvas.width - startX, 20);
      } else if (i === end.lineIndex) {
        const textBeforeEnd = line.substring(0, end.charIndex);
        const endX = 10 + ctx.measureText(textBeforeEnd).width;
        const y = 20 + i * 20;
        ctx.fillRect(10, y - 15, endX - 10, 20);
      } else {
        const y = 20 + i * 20;
        ctx.fillRect(10, y - 15, ctx.canvas.width - 10, 20);
      }
    }
  }
}

export function handleMouseDown(
  event: MouseEvent,
  ctx: CanvasRenderingContext2D
) {
  const rect = ctx.canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const lines = getTextLines();
  const lineIndex = Math.min(Math.floor((y - 10) / 20), lines.length - 1);
  const line = lines[lineIndex] || "";
  let charIndex = line.length;
  let width = 10;

  for (let i = 0; i < line.length; i++) {
    const charWidth = ctx.measureText(line[i]).width;
    if (x < width + charWidth) {
      charIndex = i;
      break;
    }
    width += charWidth;
  }

  selectionStart = { lineIndex, charIndex };
  selectionEnd = { lineIndex, charIndex };
  isSelecting = true;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  renderText(ctx);
  drawSelection(ctx);
}

export function handleMouseMove(
  event: MouseEvent,
  ctx: CanvasRenderingContext2D
) {
  if (!isSelecting) return;

  const rect = ctx.canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const lines = getTextLines();
  const lineIndex = Math.min(Math.floor((y - 10) / 20), lines.length - 1);
  const line = lines[lineIndex] || "";
  let charIndex = line.length;
  let width = 10;

  for (let i = 0; i < line.length; i++) {
    const charWidth = ctx.measureText(line[i]).width;
    if (x < width + charWidth) {
      charIndex = i;
      break;
    }
    width += charWidth;
  }

  selectionEnd = { lineIndex, charIndex };

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  renderText(ctx);
  drawSelection(ctx);
}

export function handleMouseUp(
  event: MouseEvent,
  ctx: CanvasRenderingContext2D
) {
  if (isSelecting) {
    isSelecting = false;
    handleMouseMove(event, ctx);
  }
}
