/**
 * Measure the width of the specified text.
 */
export function measureText(
  ctx: CanvasRenderingContext2D,
  text: string
): number {
  return ctx.measureText(text).width;
}
