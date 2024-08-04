import { getTextLines } from "../text/paragraph";

/**
 * Display the current state of the text in the console.
 */
export function displayTextState() {
  const lines = getTextLines();
  const textState = {
    paragraphs: lines.map((line) => ({
      elements: [
        {
          textRun: {
            content: line,
            textStyle: {},
          },
        },
      ],
      paragraphStyle: {},
    })),
  };
  console.log(JSON.stringify(textState, null, 2));
}
