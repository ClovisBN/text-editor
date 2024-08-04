import {
  addNewLine,
  mergeLine,
  getTextLines,
  addTextAtPosition,
  removeLastCharacter,
  splitLineAtPosition,
} from "../text/paragraph";
import { renderText } from "../canvas/render";
import {
  updateCursorPosition,
  initializeCursorBlinking,
  handleMouseClick,
} from "../canvas/cursor";
import { displayTextState } from "../utils/debug";

let cursorLineIndex = 0;
let cursorCharIndex = 0;

/**
 * Initialize keyboard and mouse event listeners.
 */
export function initializeKeyboardEvents(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  document.addEventListener("keydown", (e) => {
    const lines = getTextLines();

    if (isPrintableKey(e)) {
      addTextAtPosition(cursorLineIndex, cursorCharIndex, e.key);
      cursorCharIndex++;
    } else {
      switch (e.key) {
        case "Enter":
          splitLineAtPosition(cursorLineIndex, cursorCharIndex);
          cursorLineIndex++;
          cursorCharIndex = 0;
          break;
        case "Backspace":
          if (cursorCharIndex > 0) {
            removeLastCharacter(cursorLineIndex, cursorCharIndex - 1);
            cursorCharIndex--;
          } else if (cursorLineIndex > 0) {
            mergeLine(cursorLineIndex);
            cursorLineIndex--;
            cursorCharIndex = lines[cursorLineIndex].length;
          }
          break;
        case "ArrowLeft":
          if (cursorCharIndex > 0) {
            cursorCharIndex--;
          } else if (cursorLineIndex > 0) {
            cursorLineIndex--;
            cursorCharIndex = lines[cursorLineIndex].length;
          }
          break;
        case "ArrowRight":
          if (cursorCharIndex < lines[cursorLineIndex].length) {
            cursorCharIndex++;
          } else if (cursorLineIndex < lines.length - 1) {
            cursorLineIndex++;
            cursorCharIndex = 0;
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
          addTextAtPosition(cursorLineIndex, cursorCharIndex, " ");
          cursorCharIndex++;
          break;
        case "Control":
        case "Alt":
        case "Meta":
        case "Shift":
          return;
        default:
          return; // Ignore other keys
      }
    }

    renderText(ctx);
    updateCursorPosition(cursorLineIndex, cursorCharIndex, ctx);
    displayTextState(); // Display the current text state in the console
  });

  canvas.addEventListener("click", (e) => handleMouseClick(e, ctx));
  initializeCursorBlinking(ctx);
}

/**
 * Determine if the key press event corresponds to a printable character.
 */
function isPrintableKey(event: KeyboardEvent): boolean {
  const key = event.key;
  return key.length === 1 && !event.ctrlKey && !event.metaKey; // Allow single character keys and ignore control/meta keys
}
