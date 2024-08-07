import { Cursor } from "../canvas/cursor";
import { Renderer } from "../canvas/render";
import { Selection } from "../canvas/selection";
import { handlePrintableKey } from "./keyMethods/handlePrintableKey";
import { handleBackspace } from "./keyMethods/handleBackspace";
import { handleEnter } from "./keyMethods/handleEnter";
import { handleArrowKeys } from "./keyMethods/handleArrowKeys";
import { handleSpace } from "./keyMethods/handleSpace";
import { Paragraph } from "../text/paragraph";

export class KeyboardHandler {
  private cursor: Cursor;
  private renderer: Renderer;
  private selection: Selection;

  constructor(cursor: Cursor, renderer: Renderer, selection: Selection) {
    this.cursor = cursor;
    this.renderer = renderer;
    this.selection = selection;
    this.initializeKeyboardEvents();
  }

  private initializeKeyboardEvents() {
    document.addEventListener("keydown", (e) => this.handleKeyDown(e));
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (this.selection.isTextSelected()) {
      if (e.key === "Backspace" || e.key === "Delete" || e.key === " ") {
        if (e.key === "Backspace" || e.key === "Delete") {
          this.selection.deleteSelectedText();
        } else if (e.key === " ") {
          handleSpace(this.cursor, this.selection);
        }
        return;
      }
    }

    if (this.isPrintableKey(e)) {
      handlePrintableKey(e, this.cursor, this.selection);
    } else {
      switch (e.key) {
        case "Enter":
          handleEnter(this.cursor, this.selection);
          break;
        case "Backspace":
          handleBackspace(this.cursor, this.selection);
          break;
        case "ArrowLeft":
        case "ArrowRight":
        case "ArrowUp":
        case "ArrowDown":
          handleArrowKeys(e, this.cursor, this.selection);
          break;
        case " ":
          handleSpace(this.cursor, this.selection);
          break;
        case "Home":
          this.cursor.updateCursorPosition(
            this.cursor.getCursorState().lineIndex,
            0
          );
          break;
        case "End":
          this.cursor.updateCursorPosition(
            this.cursor.getCursorState().lineIndex,
            Paragraph.getTextLines()[this.cursor.getCursorState().lineIndex]
              .length
          );
          break;
        case "Control":
        case "Alt":
        case "Meta":
        case "Shift":
          return;
        default:
          return;
      }
    }

    this.cursor.clearAndRedraw();
    console.log(this.getTextState());
  }

  private isPrintableKey(event: KeyboardEvent): boolean {
    const key = event.key;
    return key.length === 1 && !event.ctrlKey && !event.metaKey;
  }

  private getTextState() {
    const lines = Paragraph.getTextLines();
    return JSON.stringify(
      {
        paragraphs: lines.map((line) => ({
          elements: [
            {
              textRun: {
                content: line,
                textStyle: {},
              },
            },
          ],
          paragraphStyle: {},
        })),
      },
      null,
      2
    );
  }
}
