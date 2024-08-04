import { initializeCanvas } from "./canvas/canvas";
import { initializeKeyboardEvents } from "./commands/keyboard";

// Initialize the canvas
const canvas = document.getElementById(
  "textEditorCanvas"
) as HTMLCanvasElement | null;

if (canvas) {
  const ctx = canvas.getContext("2d");
  if (ctx) {
    initializeCanvas(canvas, ctx);
    // Initialize keyboard and mouse events
    initializeKeyboardEvents(canvas, ctx);
  } else {
    console.error("Failed to get 2D context");
  }
} else {
  console.error("Canvas element not found");
}
