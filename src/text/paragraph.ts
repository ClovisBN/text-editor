export class Paragraph {
  private static lines: string[] = [""];

  public static addNewLine() {
    this.lines.push("");
  }

  public static mergeLine(lineIndex: number) {
    if (lineIndex > 0) {
      this.lines[lineIndex - 1] += this.lines[lineIndex];
      this.lines.splice(lineIndex, 1);
    }
  }

  public static getTextLines(): string[] {
    return this.lines;
  }

  public static addTextAtPosition(
    lineIndex: number,
    charIndex: number,
    text: string
  ) {
    const line = this.lines[lineIndex];
    this.lines[lineIndex] =
      line.slice(0, charIndex) + text + line.slice(charIndex);
  }

  public static removeLastCharacter(lineIndex: number, charIndex: number) {
    const line = this.lines[lineIndex];
    this.lines[lineIndex] =
      line.slice(0, charIndex) + line.slice(charIndex + 1);
  }

  public static splitLineAtPosition(lineIndex: number, charIndex: number) {
    const line = this.lines[lineIndex];
    const beforeCursor = line.slice(0, charIndex);
    const afterCursor = line.slice(charIndex);
    this.lines[lineIndex] = beforeCursor;
    this.lines.splice(lineIndex + 1, 0, afterCursor);
  }
}

export const getTextLines = () => Paragraph.getTextLines();
