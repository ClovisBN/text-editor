interface TextRun {
  content: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  // Add more text style properties as needed
}

let textRuns: TextRun[] = [];

/**
 * Create a new TextRun with specified content and styles.
 */
export function createTextRun(
  content: string,
  styles: Partial<TextRun> = {}
): TextRun {
  const textRun: TextRun = { content, ...styles };
  textRuns.push(textRun);
  return textRun;
}

/**
 * Modify an existing TextRun with new styles.
 */
export function modifyTextRun(index: number, styles: Partial<TextRun>) {
  Object.assign(textRuns[index], styles);
}

/**
 * Merge two adjacent TextRuns if they have the same styles.
 */
export function mergeTextRuns(index: number) {
  if (
    index < textRuns.length - 1 &&
    haveSameStyle(textRuns[index], textRuns[index + 1])
  ) {
    textRuns[index].content += textRuns[index + 1].content;
    textRuns.splice(index + 1, 1);
  }
}

/**
 * Check if two TextRuns have the same styles.
 */
function haveSameStyle(run1: TextRun, run2: TextRun): boolean {
  return (
    run1.bold === run2.bold &&
    run1.italic === run2.italic &&
    run1.underline === run2.underline
  );
}

/**
 * Get all TextRuns.
 */
export function getTextRuns(): TextRun[] {
  return textRuns;
}
