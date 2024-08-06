import { getTextLines } from "../text/paragraph";
import { Cursor } from "./cursor";

export class Selection {
  private ctx: CanvasRenderingContext2D;
  private isSelecting = false;
  private selectionStart = { lineIndex: 0, charIndex: 0 };
  private selectionEnd = { lineIndex: 0, charIndex: 0 };
  private cursor: Cursor;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.cursor = {} as Cursor; // Ajoutez cette ligne pour initialiser la propriété cursor
  }

  public setCursor(cursor: Cursor) {
    this.cursor = cursor;
  }

  public drawSelection() {
    const lines = getTextLines();
    const start = this.selectionStart;
    const end = this.selectionEnd;

    if (
      !this.isSelecting &&
      (start.lineIndex !== end.lineIndex || start.charIndex !== end.charIndex)
    ) {
      console.log("drawSelection called");
      this.ctx.fillStyle = "rgba(0, 0, 255, 0.3)";

      if (start.lineIndex === end.lineIndex) {
        const line = lines[start.lineIndex];
        const textBeforeStart = line.substring(0, start.charIndex);
        const textBeforeEnd = line.substring(0, end.charIndex);
        const startX = 10 + this.ctx.measureText(textBeforeStart).width;
        const endX = 10 + this.ctx.measureText(textBeforeEnd).width;
        const y = 20 + start.lineIndex * 20;
        this.ctx.fillRect(startX, y - 15, endX - startX, 20);
      } else {
        for (let i = start.lineIndex; i <= end.lineIndex; i++) {
          const line = lines[i];
          if (line === undefined) continue;
          if (i === start.lineIndex) {
            const textBeforeStart = line.substring(0, start.charIndex);
            const startX = 10 + this.ctx.measureText(textBeforeStart).width;
            const y = 20 + i * 20;
            this.ctx.fillRect(
              startX,
              y - 15,
              this.ctx.canvas.width - startX,
              20
            );
          } else if (i === end.lineIndex) {
            const textBeforeEnd = line.substring(0, end.charIndex);
            const endX = 10 + this.ctx.measureText(textBeforeEnd).width;
            const y = 20 + i * 20;
            this.ctx.fillRect(10, y - 15, endX - 10, 20);
          } else {
            const y = 20 + i * 20;
            this.ctx.fillRect(10, y - 15, this.ctx.canvas.width - 10, 20);
          }
        }
      }
    }
  }

  public handleMouseDown(event: MouseEvent) {
    console.log("handleMouseDown called");
    const rect = this.ctx.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const lines = getTextLines();
    const lineIndex = Math.min(Math.floor((y - 10) / 20), lines.length - 1);
    const line = lines[lineIndex] || "";
    let charIndex = line.length;
    let width = 10;

    for (let i = 0; i < line.length; i++) {
      const charWidth = this.ctx.measureText(line[i]).width;
      if (x < width + charWidth) {
        charIndex = i;
        break;
      }
      width += charWidth;
    }

    this.selectionStart = { lineIndex, charIndex };
    this.selectionEnd = { lineIndex, charIndex };
    this.isSelecting = true;
    this.cursor.setSelecting(true);
  }

  public handleMouseMove(event: MouseEvent) {
    if (!this.isSelecting) return;

    console.log("handleMouseMove called");
    const rect = this.ctx.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const lines = getTextLines();
    const lineIndex = Math.min(Math.floor((y - 10) / 20), lines.length - 1);
    const line = lines[lineIndex] || "";
    let charIndex = line.length;
    let width = 10;

    for (let i = 0; i < line.length; i++) {
      const charWidth = this.ctx.measureText(line[i]).width;
      if (x < width + charWidth) {
        charIndex = i;
        break;
      }
      width += charWidth;
    }

    this.selectionEnd = { lineIndex, charIndex };
    this.cursor.setSelecting(true); // Ensure cursor is not blinking during selection
    this.cursor.clearAndRedraw(); // Update the selection visually
  }

  public handleMouseUp(event: MouseEvent) {
    if (this.isSelecting) {
      console.log("handleMouseUp called");
      this.isSelecting = false;
      this.cursor.setSelecting(false);
      this.cursor.updateCursorPosition(
        this.selectionEnd.lineIndex,
        this.selectionEnd.charIndex
      );
      this.cursor.clearAndRedraw(); // Final redraw to place the cursor at the end of selection
    }
  }

  public getSelectionEnd() {
    return this.selectionEnd;
  }
}
