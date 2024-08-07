import { Paragraph } from "../../text/paragraph";
import { Cursor } from "../../canvas/cursor";
import { Selection } from "../../canvas/selection";

export function handleArrowKeys(
  e: KeyboardEvent,
  cursor: Cursor,
  selection: Selection
) {
  const lines = Paragraph.getTextLines();
  const { lineIndex, charIndex } = cursor.getCursorState();
  let cursorLineIndex = lineIndex;
  let cursorCharIndex = charIndex;

  if (selection.isTextSelected()) {
    const selectionStart = selection.getSelectionStart();
    const selectionEnd = selection.getSelectionEnd();

    // Check the direction of the selection
    const isLeftToRightSelection =
      selectionStart.lineIndex < selectionEnd.lineIndex ||
      (selectionStart.lineIndex === selectionEnd.lineIndex &&
        selectionStart.charIndex < selectionEnd.charIndex);

    if (e.key === "ArrowLeft") {
      // If selection is left-to-right, place cursor at start, otherwise at end
      cursorLineIndex = isLeftToRightSelection
        ? selectionStart.lineIndex
        : selectionEnd.lineIndex;
      cursorCharIndex = isLeftToRightSelection
        ? selectionStart.charIndex
        : selectionEnd.charIndex;
    } else if (e.key === "ArrowRight") {
      // If selection is left-to-right, place cursor at end, otherwise at start
      cursorLineIndex = isLeftToRightSelection
        ? selectionEnd.lineIndex
        : selectionStart.lineIndex;
      cursorCharIndex = isLeftToRightSelection
        ? selectionEnd.charIndex
        : selectionStart.charIndex;
    } else if (e.key === "ArrowUp") {
      // Place cursor at the start if going up
      cursorLineIndex = selectionStart.lineIndex;
      cursorCharIndex = selectionStart.charIndex;
    } else if (e.key === "ArrowDown") {
      // Place cursor at the end if going down
      cursorLineIndex = selectionEnd.lineIndex;
      cursorCharIndex = selectionEnd.charIndex;
    }

    // Clear selection after arrow key press
    selection.clearSelection();
  } else {
    // Existing behavior for arrow keys without selection
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
  }

  cursor.setCursorState(cursorLineIndex, cursorCharIndex);
  cursor.updateCursorPosition(cursorLineIndex, cursorCharIndex);
}
