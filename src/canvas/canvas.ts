// src/canvas/canvas.ts

import { Renderer } from "./render";
import { Cursor } from "./cursor";
import { Selection } from "./selection";

export function initializeCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  cursor: Cursor,
  selection: Selection
) {
  ctx.font = "16px Arial";
  const renderer = new Renderer(ctx);
  renderer.renderText();
  cursor.drawCursor();

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
    renderer.renderText();
    cursor.drawCursor();
  });
}
