import { Cursor } from "./canvas/cursor";
import { Selection } from "./canvas/selection";
import { KeyboardHandler } from "./commands/keyboard";
import { Renderer } from "./canvas/render"; // Ajouter ceci

const canvas = document.getElementById("textEditorCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

if (ctx) {
  const selection = new Selection(ctx);
  const cursor = new Cursor(ctx, selection);
  selection.setCursor(cursor);

  new KeyboardHandler(cursor, new Renderer(ctx));

  canvas.addEventListener("mousedown", (e) => selection.handleMouseDown(e));
  canvas.addEventListener("mousemove", (e) => selection.handleMouseMove(e));
  canvas.addEventListener("mouseup", (e) => selection.handleMouseUp(e));

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
    cursor.clearAndRedraw();
  });

  cursor.clearAndRedraw();
} else {
  console.error("Failed to get 2D context");
}
