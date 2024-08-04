import { expect } from "chai";
import { JSDOM } from "jsdom";
import { initializeKeyboardEvents } from "../../src/commands/keyboard";
import { getTextLines } from "../../src/text/paragraph";

describe("Keyboard Events", () => {
  let dom: JSDOM;
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  beforeEach(() => {
    dom = new JSDOM(
      `<!DOCTYPE html><canvas id="textEditorCanvas" width="800" height="600"></canvas>`
    );
    canvas = dom.window.document.getElementById(
      "textEditorCanvas"
    ) as HTMLCanvasElement;
    ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    initializeKeyboardEvents(canvas);
  });

  it("should add a new line on Enter key press", () => {
    const event = new dom.window.KeyboardEvent("keydown", { key: "Enter" });
    dom.window.document.dispatchEvent(event);
    const lines = getTextLines();
    expect(lines.length).to.equal(2);
  });

  it("should remove the last character on Backspace key press", () => {
    const event = new dom.window.KeyboardEvent("keydown", { key: "Backspace" });
    dom.window.document.dispatchEvent(event);
    const lines = getTextLines();
    expect(lines[0]).to.equal("");
  });
});
