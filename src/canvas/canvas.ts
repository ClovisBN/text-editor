import { renderText } from "./render";
import { drawCursor, updateCursorPosition } from "./cursor";

export function initializeCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  ctx.font = "16px Arial";
  renderText(ctx);
  drawCursor(ctx, { x: 10, y: 20 });

  // Handle canvas resizing
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
    renderText(ctx);
    drawCursor(ctx, { x: 10, y: 20 });
  });
}
