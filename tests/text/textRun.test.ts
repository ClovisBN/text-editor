import { expect } from "chai";
import {
  createTextRun,
  modifyTextRun,
  mergeTextRuns,
  getTextRuns,
} from "../../src/text/textRun";

describe("TextRun", () => {
  it("should create a text run", () => {
    const run = createTextRun("Hello, world!");
    expect(run.content).to.equal("Hello, world!");
  });

  it("should modify a text run", () => {
    const run = createTextRun("Hello");
    modifyTextRun(0, { bold: true });
    expect(run.bold).to.be.true;
  });

  it("should merge text runs with the same style", () => {
    createTextRun("Hello, ");
    createTextRun("world!", { bold: true });
    mergeTextRuns(0);
    const runs = getTextRuns();
    expect(runs.length).to.equal(2);
    expect(runs[0].content).to.equal("Hello, ");
  });
});
