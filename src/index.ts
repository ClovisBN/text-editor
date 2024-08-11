import { Cursor } from "./canvas/cursor";
import { KeyboardHandler } from "./commands/keyboard";
import { Renderer } from "./canvas/render";
import { Selection } from "./canvas/selection";
import { RulerHandler } from "./commands/rulerHandler";
import {
  handleDoubleClick,
  handleTripleClick,
} from "./commands/keyMethods/handleClickEvents";

window.onload = () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  const selection = new Selection(ctx);
  const rulerHandler = new RulerHandler((leftMargin, rightMargin) => {
    // Ici, vous pouvez manipuler ce que vous voulez faire avec les marges
    console.log("Marges changées:", leftMargin, rightMargin);

    // Mettre à jour la position du curseur en fonction de la nouvelle marge gauche
    const { lineIndex, charIndex } = cursor.getCursorState();
    cursor.updateCursorPosition(lineIndex, charIndex);
    renderer.renderText();
  });

  const renderer = new Renderer(ctx, rulerHandler);
  const cursor = new Cursor(ctx, selection, rulerHandler);

  selection.setCursor(cursor);

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
