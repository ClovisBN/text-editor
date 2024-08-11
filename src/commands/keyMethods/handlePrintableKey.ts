// Importation des modules nécessaires pour le fonctionnement de la fonction handlePrintableKey.
import { Paragraph } from "../../text/paragraph";
import { Cursor } from "../../canvas/cursor";
import { Selection } from "../../canvas/selection";

// Fonction handlePrintableKey qui gère l'insertion des caractères imprimables lorsque l'utilisateur tape au clavier.
export function handlePrintableKey(
  e: KeyboardEvent, // L'événement clavier qui contient les informations sur la touche pressée.
  cursor: Cursor, // L'objet curseur qui représente l'état et la position du curseur dans le texte.
  selection: Selection // L'objet sélection qui représente l'état actuel de la sélection de texte.
) {
  // Vérifie s'il y a du texte sélectionné.
  if (selection.isTextSelected()) {
    selection.deleteSelectedText(); // Supprime le texte sélectionné avant d'insérer le nouveau caractère.
  }

  // Récupère la position actuelle du curseur.
  const { lineIndex, charIndex } = cursor.getCursorState();

  // Ajoute le caractère tapé à la position actuelle du curseur dans le texte.
  Paragraph.addTextAtPosition(lineIndex, charIndex, e.key);

  // Met à jour l'état du curseur pour le déplacer après le caractère inséré.
  cursor.setCursorState(lineIndex, charIndex + 1);

  // Met à jour visuellement la position du curseur.
  cursor.updateCursorPosition(lineIndex, charIndex + 1);
}
