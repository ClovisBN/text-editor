import { getTextLines } from "../text/paragraph";
import { drawCursor } from "./cursor";

/**
 * Render the text onto the canvas
 */
export function renderText(ctx: CanvasRenderingContext2D) {
  const lines = getTextLines();
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear the canvas before rendering

  lines.forEach((line, index) => {
    ctx.fillText(line, 10, 20 + index * 20);
  });

  // Draw the cursor after rendering the text
  const lastLine = lines[lines.length - 1];
  const lastLineWidth = ctx.measureText(lastLine).width;
  drawCursor(ctx, { x: 10 + lastLineWidth, y: 20 + (lines.length - 1) * 20 });
}
