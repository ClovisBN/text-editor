import { RulerHandler } from "../commands/rulerHandler";
import { Paragraph } from "../text/paragraph";

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private rulerHandler: RulerHandler;

  constructor(ctx: CanvasRenderingContext2D, rulerHandler: RulerHandler) {
    this.ctx = ctx;
    this.rulerHandler = rulerHandler;
  }

  public renderText() {
    const lines = Paragraph.getTextLines();
    const leftMargin = this.rulerHandler.leftMargin; // Utilisation du getter pour obtenir la marge gauche actuelle
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.fillStyle = "black";
    this.ctx.font = "16px Arial";

    lines.forEach((line, index) => {
      this.ctx.fillText(line, leftMargin, 20 + index * 20); // Utiliser la marge dynamique
    });
  }
}
