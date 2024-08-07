import { Paragraph } from "../../text/paragraph";
import { Cursor } from "../../canvas/cursor";
import { Selection } from "../../canvas/selection";

export function handleEnter(cursor: Cursor, selection: Selection) {
  if (selection.isTextSelected()) {
    selection.deleteSelectedText();
  }

  const { lineIndex, charIndex } = cursor.getCursorState();
  Paragraph.splitLineAtPosition(lineIndex, charIndex);
  cursor.setCursorState(lineIndex + 1, 0);
  cursor.updateCursorPosition(lineIndex + 1, 0);
}
