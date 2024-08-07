import { Paragraph } from "../../text/paragraph";
import { Cursor } from "../../canvas/cursor";

export function handleEnter(cursor: Cursor) {
  const { lineIndex, charIndex } = cursor.getCursorState();
  Paragraph.splitLineAtPosition(lineIndex, charIndex);
  cursor.setCursorState(lineIndex + 1, 0);
  cursor.updateCursorPosition(lineIndex + 1, 0);
}
