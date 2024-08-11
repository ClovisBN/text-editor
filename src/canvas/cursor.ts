import { Paragraph } from "../text/paragraph";
import { Renderer } from "./render";
import { Selection } from "./selection";
import { RulerHandler } from "../commands/rulerHandler";

// Interface pour la position du curseur
interface Position {
  x: number;
  y: number;
  lineIndex: number;
  charIndex: number;
}

export class Cursor {
  private ctx: CanvasRenderingContext2D;
  private cursorState = { lineIndex: 0, charIndex: 0 };
  private cursorPosition: Position = {
    x: 10,
    y: 20,
    lineIndex: 0,
    charIndex: 0,
  };
  private cursorVisible = true;
  private renderer: Renderer;
  private selection: Selection;
  private isSelecting = false;
  private blinkInterval: NodeJS.Timeout | null = null;
  private isRedrawing = false;
  private rulerHandler: RulerHandler; // Ajout de la référence à RulerHandler

  constructor(
    ctx: CanvasRenderingContext2D,
    selection: Selection,
    rulerHandler: RulerHandler
  ) {
    this.ctx = ctx;
    this.renderer = new Renderer(ctx, rulerHandler);
    this.selection = selection;
    this.rulerHandler = rulerHandler; // Stocker la référence à RulerHandler
    this.startBlinking();
  }

  public getCanvas(): HTMLCanvasElement {
    return this.ctx.canvas;
  }

  public getCtx(): CanvasRenderingContext2D {
    return this.ctx;
  }

  public drawCursor() {
    if (
      this.cursorVisible &&
      !this.isSelecting &&
      !this.selection.isTextSelected()
    ) {
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(
        this.cursorPosition.x,
        this.cursorPosition.y - 15,
        2,
        20
      );
    }
  }

  public updateCursorPosition(lineIndex: number, charIndex: number) {
    this.cursorState.lineIndex = lineIndex;
    this.cursorState.charIndex = charIndex;

    const lines = Paragraph.getTextLines();
    if (lineIndex < 0 || lineIndex >= lines.length) return;
    const line = lines[lineIndex];
    const textBeforeCursor = line.substring(0, charIndex);

    const leftMargin = this.rulerHandler.leftMargin; // Obtenez la marge gauche dynamique
    this.cursorPosition.x =
      leftMargin + this.ctx.measureText(textBeforeCursor).width; // Utilisez la marge gauche ici
    this.cursorPosition.y = 20 + lineIndex * 20;
    this.clearAndRedraw();
  }

  private startBlinking() {
    if (this.blinkInterval) clearInterval(this.blinkInterval);
    this.blinkInterval = setInterval(() => {
      this.cursorVisible = !this.cursorVisible;
      this.clearCursor();
      this.drawCursor();
    }, 500);
  }

  private clearCursor() {
    this.ctx.clearRect(
      this.cursorPosition.x,
      this.cursorPosition.y - 15,
      2,
      20
    );
    this.renderer.renderText();
    this.selection.drawSelection(); // Redessinez la sélection ici
  }

  public clearAndRedraw() {
    if (this.isRedrawing) return;
    this.isRedrawing = true;
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.renderer.renderText();
    this.selection.drawSelection();
    this.drawCursor();
    this.isRedrawing = false;
  }

  public getCursorState() {
    return this.cursorState;
  }

  public setCursorState(lineIndex: number, charIndex: number) {
    this.cursorState.lineIndex = lineIndex;
    this.cursorState.charIndex = charIndex;
  }

  public setSelecting(isSelecting: boolean) {
    this.isSelecting = isSelecting;
    this.cursorVisible = !isSelecting && !this.selection.isTextSelected();
    if (!isSelecting) {
      const { lineIndex, charIndex } = this.selection.getSelectionEnd();
      this.updateCursorPosition(lineIndex, charIndex);
      this.startBlinking();
    } else {
      if (this.blinkInterval) {
        clearInterval(this.blinkInterval);
        this.blinkInterval = null;
      }
      this.clearAndRedraw();
    }
  }

  public stopBlinking() {
    if (this.blinkInterval) {
      clearInterval(this.blinkInterval);
      this.blinkInterval = null;
    }
  }
}
