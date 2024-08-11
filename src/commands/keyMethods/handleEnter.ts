// Importation des modules nécessaires pour le fonctionnement de la fonction handleEnter.
import { Paragraph } from "../../text/paragraph";
import { Cursor } from "../../canvas/cursor";
import { Selection } from "../../canvas/selection";

// Fonction handleEnter qui gère l'action de la touche "Entrée" lorsque l'utilisateur l'appuie.
export function handleEnter(cursor: Cursor, selection: Selection) {
  // Vérifie s'il y a du texte sélectionné.
  if (selection.isTextSelected()) {
    selection.deleteSelectedText(); // Supprime le texte sélectionné avant de procéder à l'action de la touche "Entrée".
  }

  // Récupère la position actuelle du curseur.
  const { lineIndex, charIndex } = cursor.getCursorState();

  // Divise la ligne de texte à la position actuelle du curseur.
  // Le texte avant le curseur reste sur la ligne actuelle, et le texte après le curseur passe sur une nouvelle ligne.
  Paragraph.splitLineAtPosition(lineIndex, charIndex);

  // Met à jour l'état du curseur pour le déplacer au début de la nouvelle ligne.
  cursor.setCursorState(lineIndex + 1, 0);

  // Met à jour visuellement la position du curseur pour refléter ce changement.
  cursor.updateCursorPosition(lineIndex + 1, 0);
}
