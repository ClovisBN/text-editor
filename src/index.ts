import { Cursor } from "./canvas/cursor";
import { KeyboardHandler } from "./commands/keyboard";
import { Renderer } from "./canvas/render";
import { Selection } from "./canvas/selection";
import {
  handleDoubleClick,
  handleTripleClick,
} from "./commands/keyMethods/handleClickEvents";

window.onload = () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  const selection = new Selection(ctx);
  const cursor = new Cursor(ctx, selection);
  selection.setCursor(cursor);

  const renderer = new Renderer(ctx);
  new KeyboardHandler(cursor, renderer, selection);

  canvas.addEventListener("mousedown", (e) => selection.handleMouseDown(e));
  canvas.addEventListener("mousemove", (e) => selection.handleMouseMove(e));
  canvas.addEventListener("mouseup", (e) => selection.handleMouseUp(e));

  canvas.addEventListener("dblclick", (e) =>
    handleDoubleClick(e, cursor, selection)
  );
  canvas.addEventListener("click", (e) => {
    if ((e as any).detail === 3) {
      handleTripleClick(e, cursor, selection);
    }
  });
};
