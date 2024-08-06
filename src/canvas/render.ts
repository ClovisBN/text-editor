// src/canvas/render.ts

import { getTextLines } from "../text/paragraph";

export class Renderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public renderText() {
    const lines = getTextLines();
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height); // Clear canvas before rendering text
    this.ctx.fillStyle = "black";
    this.ctx.font = "16px Arial";

    lines.forEach((line, index) => {
      this.ctx.fillText(line, 10, 20 + index * 20);
    });
  }
}
