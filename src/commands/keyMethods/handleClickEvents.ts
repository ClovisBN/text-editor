import { Cursor } from "../../canvas/cursor";
import { Selection } from "../../canvas/selection";
import { Paragraph } from "../../text/paragraph";

// Cette fonction gère le double-clic de l'utilisateur pour sélectionner un mot.
export function handleDoubleClick(
  event: MouseEvent,
  cursor: Cursor,
  selection: Selection
) {
  // Obtient la position du curseur à partir de l'événement de clic.
  const { lineIndex, charIndex } = getCursorPositionFromEvent(event, cursor);

  // Détermine les limites du mot (début et fin) en fonction de la position du curseur.
  const wordBounds = getWordBounds(lineIndex, charIndex);

  // Définit la sélection du mot.
  selection.setSelection(
    wordBounds.startLine,
    wordBounds.startChar,
    wordBounds.endLine,
    wordBounds.endChar
  );

  // Met à jour la position du curseur à la fin du mot sélectionné.
  cursor.updateCursorPosition(wordBounds.endLine, wordBounds.endChar);

  // Efface et redessine le canvas pour refléter les changements visuels.
  cursor.clearAndRedraw();
}

// Cette fonction gère le triple-clic de l'utilisateur pour sélectionner tout le paragraphe.
export function handleTripleClick(
  event: MouseEvent,
  cursor: Cursor,
  selection: Selection
) {
  // Obtient la position du curseur à partir de l'événement de clic.
  const { lineIndex } = getCursorPositionFromEvent(event, cursor);

  // Définit la sélection pour englober toute la ligne (paragraphe).
  selection.setSelection(
    lineIndex,
    0,
    lineIndex,
    Paragraph.getTextLines()[lineIndex].length
  );

  // Met à jour la position du curseur à la fin de la ligne sélectionnée.
  cursor.updateCursorPosition(
    lineIndex,
    Paragraph.getTextLines()[lineIndex].length
  );

  // Efface et redessine le canvas pour refléter les changements visuels.
  cursor.clearAndRedraw();
}

// Fonction utilitaire pour obtenir la position du curseur à partir de l'événement de clic.
function getCursorPositionFromEvent(event: MouseEvent, cursor: Cursor) {
  // Obtient les dimensions et la position du canvas dans la fenêtre.
  const rect = cursor.getCanvas().getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Calcule l'index de la ligne en fonction de la position Y du clic.
  const lineIndex = Math.min(
    Math.floor((y - 5) / 20),
    Paragraph.getTextLines().length - 1
  );

  // Obtient la ligne de texte correspondant à l'index de la ligne.
  const line = Paragraph.getTextLines()[lineIndex] || "";
  let charIndex = line.length;
  let width = 10;

  // Parcourt les caractères de la ligne pour déterminer l'index du caractère cliqué.
  for (let i = 0; i < line.length; i++) {
    const charWidth = cursor.getCtx().measureText(line[i]).width;
    if (x < width + charWidth) {
      charIndex = i;
      break;
    }
    width += charWidth;
  }

  // Retourne l'index de la ligne et du caractère cliqué.
  return { lineIndex, charIndex };
}

// Fonction utilitaire pour déterminer les limites (début et fin) d'un mot à partir de l'index du caractère.
function getWordBounds(lineIndex: number, charIndex: number) {
  const line = Paragraph.getTextLines()[lineIndex];

  // Recherche le début du mot à gauche de la position du curseur.
  const startChar = line.substring(0, charIndex).search(/\S+$/);

  // Recherche la fin du mot à droite de la position du curseur.
  const endChar = line.substring(charIndex).search(/\s|$|(?=\W)/) + charIndex;

  // Retourne les limites du mot (début et fin) ainsi que l'index de la ligne.
  return {
    startLine: lineIndex,
    startChar: Math.max(startChar, 0),
    endLine: lineIndex,
    endChar: Math.min(endChar, line.length),
  };
}
