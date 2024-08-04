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
}
