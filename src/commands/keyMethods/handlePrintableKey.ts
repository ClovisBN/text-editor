import { Paragraph } from "../../text/paragraph";
import { Cursor } from "../../canvas/cursor";

export function handlePrintableKey(e: KeyboardEvent, cursor: Cursor) {
  const { lineIndex, charIndex } = cursor.getCursorState();
  Paragraph.addTextAtPosition(lineIndex, charIndex, e.key);
  cursor.setCursorState(lineIndex, charIndex + 1);
  cursor.updateCursorPosition(lineIndex, charIndex + 1);
}
