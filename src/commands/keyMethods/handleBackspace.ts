import { Paragraph } from "../../text/paragraph";
import { Selection } from "../../canvas/selection";
import { Cursor } from "../../canvas/cursor";

// Cette fonction gère l'événement de la touche Backspace.
export function handleBackspace(cursor: Cursor, selection: Selection) {
  // Si du texte est sélectionné, supprimez-le.
  if (selection.isTextSelected()) {
    selection.deleteSelectedText();
  } else {
    // Récupère l'état actuel du curseur, c'est-à-dire la position ligne/charactère.
    const { lineIndex, charIndex } = cursor.getCursorState();

    // Si le curseur n'est pas au tout début de la ligne, supprime le caractère précédent.
    if (charIndex > 0) {
      // Supprime le dernier caractère avant la position actuelle du curseur.
      Paragraph.removeLastCharacter(lineIndex, charIndex - 1);
      // Déplace le curseur d'un caractère vers la gauche.
      cursor.setCursorState(lineIndex, charIndex - 1);
      cursor.updateCursorPosition(lineIndex, charIndex - 1);
    } else if (lineIndex > 0) {
      // Si le curseur est au début d'une ligne, fusionne cette ligne avec la précédente.
      const prevLineLength = Paragraph.getTextLines()[lineIndex - 1].length;
      Paragraph.mergeLine(lineIndex);
      // Déplace le curseur à la fin de la ligne précédente après la fusion.
      cursor.setCursorState(lineIndex - 1, prevLineLength);
      cursor.updateCursorPosition(lineIndex - 1, prevLineLength);
    }
  }
}
