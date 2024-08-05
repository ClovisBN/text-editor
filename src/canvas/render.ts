import { getTextLines } from "../text/paragraph";

export function renderText(ctx: CanvasRenderingContext2D) {
  const lines = getTextLines();
  ctx.font = "16px Arial";
  ctx.fillStyle = "black"; // Set the text color to black

  lines.forEach((line, index) => {
    ctx.fillText(line, 10, 20 + index * 20);
  });
}
