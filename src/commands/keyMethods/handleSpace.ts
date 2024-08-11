// Importation des modules nécessaires pour le fonctionnement de la fonction handleSpace.
import { Paragraph } from "../../text/paragraph";
import { Cursor } from "../../canvas/cursor";
import { Selection } from "../../canvas/selection";

// Fonction handleSpace qui gère l'action lorsque la barre d'espace est pressée.
export function handleSpace(cursor: Cursor, selection: Selection) {
  // Vérifie s'il y a du texte sélectionné.
  if (selection.isTextSelected()) {
    selection.deleteSelectedText(); // Supprime le texte sélectionné avant d'insérer un espace.
  }

  // Récupère la position actuelle du curseur.
  const { lineIndex, charIndex } = cursor.getCursorState();

  // Ajoute un espace à la position actuelle du curseur dans le texte.
  Paragraph.addTextAtPosition(lineIndex, charIndex, " ");

  // Met à jour l'état du curseur pour le déplacer à la position après l'espace inséré.
  cursor.setCursorState(lineIndex, charIndex + 1);

  // Met à jour visuellement la position du curseur.
  cursor.updateCursorPosition(lineIndex, charIndex + 1);
}
