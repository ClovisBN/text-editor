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
    this.cursor = {} as Cursor;
    this.initializeMouseMoveEvent();
  }

  public setCursor(cursor: Cursor) {
    this.cursor = cursor;
  }

  private initializeMouseMoveEvent() {
    this.ctx.canvas.addEventListener("mousemove", (event) =>
      this.handleMouseMove(event)
    );
    this.ctx.canvas.addEventListener(
      "mouseleave",
      () => (this.ctx.canvas.style.cursor = "default")
    );
  }

  public clearSelection() {
    this.selectionStart = { lineIndex: 0, charIndex: 0 };
    this.selectionEnd = { lineIndex: 0, charIndex: 0 };
    this.isSelecting = false;
    this.cursor.setSelecting(false);
    this.cursor.clearAndRedraw();
  }

  public drawSelection() {
    const lines = getTextLines();
    const start = this.selectionStart;
    const end = this.selectionEnd;

    if (
      this.isSelecting ||
      start.lineIndex !== end.lineIndex ||
      start.charIndex !== end.charIndex
    ) {
      console.log("drawSelection called");
      this.ctx.fillStyle = "rgba(0, 0, 255, 0.3)";

      const [top, bottom] = [start, end].sort((a, b) => {
        if (a.lineIndex === b.lineIndex) {
          return a.charIndex - b.charIndex;
        }
        return a.lineIndex - b.lineIndex;
      });

      if (top.lineIndex === bottom.lineIndex) {
        const line = lines[top.lineIndex];
        const textBeforeStart = line.substring(0, top.charIndex);
        const textBeforeEnd = line.substring(0, bottom.charIndex);
        const startX = 10 + this.ctx.measureText(textBeforeStart).width;
        const endX = 10 + this.ctx.measureText(textBeforeEnd).width;
        const y = 20 + top.lineIndex * 20;
        this.ctx.fillRect(startX, y - 15, endX - startX, 20);
      } else {
        for (let i = top.lineIndex; i <= bottom.lineIndex; i++) {
          const line = lines[i];
          if (line === undefined) continue;
          if (i === top.lineIndex) {
            const textBeforeStart = line.substring(0, top.charIndex);
            const startX = 10 + this.ctx.measureText(textBeforeStart).width;
            const y = 20 + i * 20;
            this.ctx.fillRect(
              startX,
              y - 15,
              this.ctx.canvas.width - startX,
              20
            );
          } else if (i === bottom.lineIndex) {
            const textBeforeEnd = line.substring(0, bottom.charIndex);
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

  private updateCursorStyle(event: MouseEvent) {
    const rect = this.ctx.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const lines = getTextLines();
    const lineIndex = Math.floor((y - 5) / 20);

    if (lineIndex >= 0 && lineIndex < lines.length) {
      const line = lines[lineIndex] || "";
      let width = 10;

      for (let i = 0; i < line.length; i++) {
        const charWidth = this.ctx.measureText(line[i]).width;
        if (x < width + charWidth) {
          this.ctx.canvas.style.cursor = "text";
          return;
        }
        width += charWidth;
      }
    }

    this.ctx.canvas.style.cursor = "default";
  }

  public handleMouseDown(event: MouseEvent) {
    console.log("handleMouseDown called");
    const rect = this.ctx.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const lines = getTextLines();
    const lineIndex = Math.min(Math.floor((y - 5) / 20), lines.length - 1);
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
    this.cursor.clearAndRedraw();
  }

  public handleMouseMove(event: MouseEvent) {
    if (this.isSelecting) {
      console.log("handleMouseMove called");
      const rect = this.ctx.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const lines = getTextLines();
      const lineIndex = Math.min(Math.floor((y - 5) / 20), lines.length - 1);
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
      this.cursor.setSelecting(true);
      this.cursor.clearAndRedraw();
    }

    this.updateCursorStyle(event);
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
      this.cursor.clearAndRedraw();
    }
  }

  public getSelectionEnd() {
    return this.selectionEnd;
  }
}
