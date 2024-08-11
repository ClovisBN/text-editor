// src/commands/rulerHandler.ts
export class RulerHandler {
  private leftCursor: HTMLElement;
  private rightCursor: HTMLElement;
  private leftMarginBar: HTMLElement;
  private rightMarginBar: HTMLElement;
  private rulerContainer: HTMLElement;
  private _leftMargin: number = 10;
  private _rightMargin: number = 10;

  constructor(
    private onMarginChange: (leftMargin: number, rightMargin: number) => void
  ) {
    this.leftCursor = document.getElementById("left-cursor")!;
    this.rightCursor = document.getElementById("right-cursor")!;
    this.leftMarginBar = document.getElementById("left-margin-bar")!;
    this.rightMarginBar = document.getElementById("right-margin-bar")!;
    this.rulerContainer = document.getElementById("ruler-container")!;

    this.initialize();
  }

  public get leftMargin(): number {
    return this._leftMargin;
  }

  public get rightMargin(): number {
    return this._rightMargin;
  }

  public initialize() {
    const rulerWidth = this.rulerContainer.clientWidth;
    this.leftCursor.style.left = `${this._leftMargin}px`;
    this.leftMarginBar.style.left = `${this._leftMargin}px`;

    this.rightCursor.style.left = `${rulerWidth - this._rightMargin}px`;
    this.rightMarginBar.style.left = `${rulerWidth - this._rightMargin}px`;

    this.leftCursor.addEventListener("mousedown", () => {
      document.addEventListener("mousemove", this.onMouseMoveLeft);
      document.addEventListener("mouseup", this.onMouseUpLeft);
    });

    this.rightCursor.addEventListener("mousedown", () => {
      document.addEventListener("mousemove", this.onMouseMoveRight);
      document.addEventListener("mouseup", this.onMouseUpRight);
    });
  }

  private onMouseMoveLeft = (e: MouseEvent) => {
    const newLeft = Math.min(
      Math.max(e.clientX - this.rulerContainer.offsetLeft, 0),
      this.rightCursor.offsetLeft - 20
    );
    this.leftCursor.style.left = newLeft + "px";
    this.leftMarginBar.style.left = newLeft + "px";
  };

  private onMouseMoveRight = (e: MouseEvent) => {
    const newRight = Math.min(
      Math.max(
        e.clientX - this.rulerContainer.offsetLeft,
        this.leftCursor.offsetLeft + 20
      ),
      this.rulerContainer.clientWidth - 10
    );
    this.rightCursor.style.left = newRight + "px";
    this.rightMarginBar.style.left = newRight + "px";
  };

  private onMouseUpLeft = () => {
    this._leftMargin = parseInt(this.leftCursor.style.left, 10);
    document.removeEventListener("mousemove", this.onMouseMoveLeft);
    document.removeEventListener("mouseup", this.onMouseUpLeft);
    this.onMarginChange(this._leftMargin, this.rightMargin);
  };

  private onMouseUpRight = () => {
    this._rightMargin =
      this.rulerContainer.clientWidth -
      parseInt(this.rightCursor.style.left, 10);
    document.removeEventListener("mousemove", this.onMouseMoveRight);
    document.removeEventListener("mouseup", this.onMouseUpRight);
    this.onMarginChange(this.leftMargin, this._rightMargin);
  };
}
