import { Cursor } from "../../canvas/cursor";
import { Selection } from "../../canvas/selection";
import { Paragraph } from "../../text/paragraph";

export function handleDoubleClick(
  event: MouseEvent,
  cursor: Cursor,
  selection: Selection
) {
  const { lineIndex, charIndex } = getCursorPositionFromEvent(event, cursor);
  const wordBounds = getWordBounds(lineIndex, charIndex);

  selection.setSelection(
    wordBounds.startLine,
    wordBounds.startChar,
    wordBounds.endLine,
    wordBounds.endChar
  );
  cursor.updateCursorPosition(wordBounds.endLine, wordBounds.endChar);
  cursor.clearAndRedraw();
}

export function handleTripleClick(
  event: MouseEvent,
  cursor: Cursor,
  selection: Selection
) {
  const { lineIndex } = getCursorPositionFromEvent(event, cursor);

  selection.setSelection(
    lineIndex,
    0,
    lineIndex,
    Paragraph.getTextLines()[lineIndex].length
  );
  cursor.updateCursorPosition(
    lineIndex,
    Paragraph.getTextLines()[lineIndex].length
  );
  cursor.clearAndRedraw();
}

function getCursorPositionFromEvent(event: MouseEvent, cursor: Cursor) {
  const rect = cursor.getCanvas().getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const lineIndex = Math.min(
    Math.floor((y - 5) / 20),
    Paragraph.getTextLines().length - 1
  );
  const line = Paragraph.getTextLines()[lineIndex] || "";
  let charIndex = line.length;
  let width = 10;

  for (let i = 0; i < line.length; i++) {
    const charWidth = cursor.getCtx().measureText(line[i]).width;
    if (x < width + charWidth) {
      charIndex = i;
      break;
    }
    width += charWidth;
  }

  return { lineIndex, charIndex };
}

function getWordBounds(lineIndex: number, charIndex: number) {
  const line = Paragraph.getTextLines()[lineIndex];
  const startChar = line.substring(0, charIndex).search(/\S+$/);
  const endChar = line.substring(charIndex).search(/\s|$|(?=\W)/) + charIndex;

  return {
    startLine: lineIndex,
    startChar: Math.max(startChar, 0),
    endLine: lineIndex,
    endChar: Math.min(endChar, line.length),
  };
}
