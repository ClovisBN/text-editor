import { Paragraph } from "../text/paragraph";
import { Cursor } from "../canvas/cursor";
import { Renderer } from "../canvas/render";

export class KeyboardHandler {
  private cursor: Cursor;
  private renderer: Renderer;

  constructor(cursor: Cursor, renderer: Renderer) {
    this.cursor = cursor;
    this.renderer = renderer;
    this.initializeKeyboardEvents();
  }

  private initializeKeyboardEvents() {
    document.addEventListener("keydown", (e) => this.handleKeyDown(e));
  }

  private handleKeyDown(e: KeyboardEvent) {
    const lines = Paragraph.getTextLines();
    const { lineIndex, charIndex } = this.cursor.getCursorState();

    let cursorLineIndex = lineIndex;
    let cursorCharIndex = charIndex;

    if (this.isPrintableKey(e)) {
      Paragraph.addTextAtPosition(cursorLineIndex, cursorCharIndex, e.key);
      cursorCharIndex++;
    } else {
      switch (e.key) {
        case "Enter":
          Paragraph.splitLineAtPosition(cursorLineIndex, cursorCharIndex);
          cursorLineIndex++;
          cursorCharIndex = 0;
          break;
        case "Backspace":
          if (cursorCharIndex > 0) {
            Paragraph.removeLastCharacter(cursorLineIndex, cursorCharIndex - 1);
            cursorCharIndex--;
          } else if (cursorLineIndex > 0) {
            const prevLineLength = lines[cursorLineIndex - 1].length;
            Paragraph.mergeLine(cursorLineIndex);
            cursorLineIndex--;
            cursorCharIndex = prevLineLength;
          }
          break;
        case "ArrowLeft":
          if (e.metaKey) {
            cursorCharIndex = 0;
          } else {
            if (cursorCharIndex > 0) {
              cursorCharIndex--;
            } else if (cursorLineIndex > 0) {
              cursorLineIndex--;
              cursorCharIndex = lines[cursorLineIndex].length;
            }
          }
          break;
        case "ArrowRight":
          if (e.metaKey) {
            cursorCharIndex = lines[cursorLineIndex].length;
          } else {
            if (cursorCharIndex < lines[cursorLineIndex].length) {
              cursorCharIndex++;
            } else if (cursorLineIndex < lines.length - 1) {
              cursorLineIndex++;
              cursorCharIndex = 0;
            }
          }
          break;
        case "ArrowUp":
          if (cursorLineIndex > 0) {
            cursorLineIndex--;
            cursorCharIndex = Math.min(
              cursorCharIndex,
              lines[cursorLineIndex].length
            );
          }
          break;
        case "ArrowDown":
          if (cursorLineIndex < lines.length - 1) {
            cursorLineIndex++;
            cursorCharIndex = Math.min(
              cursorCharIndex,
              lines[cursorLineIndex].length
            );
          }
          break;
        case "Home":
          cursorCharIndex = 0;
          break;
        case "End":
          cursorCharIndex = lines[cursorLineIndex].length;
          break;
        case " ":
          Paragraph.addTextAtPosition(cursorLineIndex, cursorCharIndex, " ");
          cursorCharIndex++;
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

    this.cursor.setCursorState(cursorLineIndex, cursorCharIndex);
    this.cursor.updateCursorPosition(cursorLineIndex, cursorCharIndex);
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
