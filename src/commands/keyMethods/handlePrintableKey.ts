import { Paragraph } from "../../text/paragraph";
import { Cursor } from "../../canvas/cursor";
import { Selection } from "../../canvas/selection";

export function handlePrintableKey(
  e: KeyboardEvent,
  cursor: Cursor,
  selection: Selection
) {
  if (selection.isTextSelected()) {
    selection.deleteSelectedText();
  }

  const { lineIndex, charIndex } = cursor.getCursorState();
  Paragraph.addTextAtPosition(lineIndex, charIndex, e.key);
  cursor.setCursorState(lineIndex, charIndex + 1);
  cursor.updateCursorPosition(lineIndex, charIndex + 1);
}
