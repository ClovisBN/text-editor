let lines: string[] = [""];

/**
 * Adds a new line to the text.
 */
export function addNewLine() {
  lines.push("");
}

/**
 * Merges the current line with the previous line.
 */
export function mergeLine(lineIndex: number) {
  if (lineIndex > 0) {
    lines[lineIndex - 1] += lines[lineIndex];
    lines.splice(lineIndex, 1);
  }
}

/**
 * Gets all the lines of text.
 */
export function getTextLines(): string[] {
  return lines;
}

/**
 * Adds text to the current line at the specified index.
 */
export function addTextAtPosition(
  lineIndex: number,
  charIndex: number,
  text: string
) {
  const line = lines[lineIndex];
  lines[lineIndex] = line.slice(0, charIndex) + text + line.slice(charIndex);
}

/**
 * Removes the last character from the current line at the specified index.
 */
export function removeLastCharacter(lineIndex: number, charIndex: number) {
  const line = lines[lineIndex];
  lines[lineIndex] = line.slice(0, charIndex) + line.slice(charIndex + 1);
}

/**
 * Splits the current line at the specified index, moving the text after the cursor to a new line.
 */
export function splitLineAtPosition(lineIndex: number, charIndex: number) {
  const line = lines[lineIndex];
  const beforeCursor = line.slice(0, charIndex);
  const afterCursor = line.slice(charIndex);
  lines[lineIndex] = beforeCursor;
  lines.splice(lineIndex + 1, 0, afterCursor);
}
