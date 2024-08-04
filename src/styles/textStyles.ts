import { modifyTextRun } from "../text/textRun";

/**
 * Apply bold style to the specified TextRun.
 */
export function applyBoldStyle(index: number) {
  modifyTextRun(index, { bold: true });
}

/**
 * Remove bold style from the specified TextRun.
 */
export function removeBoldStyle(index: number) {
  modifyTextRun(index, { bold: false });
}

// Implement more text styles as needed
