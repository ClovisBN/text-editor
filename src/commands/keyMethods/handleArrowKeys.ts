import { Paragraph } from "../../text/paragraph";
import { Cursor } from "../../canvas/cursor";

export function handleArrowKeys(e: KeyboardEvent, cursor: Cursor) {
  const lines = Paragraph.getTextLines();
  const { lineIndex, charIndex } = cursor.getCursorState();
  let cursorLineIndex = lineIndex;
  let cursorCharIndex = charIndex;

  switch (e.key) {
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
  }

  cursor.setCursorState(cursorLineIndex, cursorCharIndex);
  cursor.updateCursorPosition(cursorLineIndex, cursorCharIndex);
}
