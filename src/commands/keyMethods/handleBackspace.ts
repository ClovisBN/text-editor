import { Paragraph } from "../../text/paragraph";
import { Selection } from "../../canvas/selection";
import { Cursor } from "../../canvas/cursor";

export function handleBackspace(cursor: Cursor, selection: Selection) {
  if (selection.isTextSelected()) {
    selection.deleteSelectedText();
  } else {
    const { lineIndex, charIndex } = cursor.getCursorState();
    if (charIndex > 0) {
      Paragraph.removeLastCharacter(lineIndex, charIndex - 1);
      cursor.setCursorState(lineIndex, charIndex - 1);
      cursor.updateCursorPosition(lineIndex, charIndex - 1);
    } else if (lineIndex > 0) {
      const prevLineLength = Paragraph.getTextLines()[lineIndex - 1].length;
      Paragraph.mergeLine(lineIndex);
      cursor.setCursorState(lineIndex - 1, prevLineLength);
      cursor.updateCursorPosition(lineIndex - 1, prevLineLength);
    }
  }
}
