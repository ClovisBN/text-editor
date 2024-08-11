import { Paragraph } from "../../text/paragraph";
import { Cursor } from "../../canvas/cursor";
import { Selection } from "../../canvas/selection";

// Cette fonction gère les événements des touches de direction (flèches) du clavier.
export function handleArrowKeys(
  e: KeyboardEvent,
  cursor: Cursor,
  selection: Selection
) {
  // Récupère toutes les lignes de texte actuelles.
  const lines = Paragraph.getTextLines();
  // Obtient l'état actuel du curseur, c'est-à-dire la ligne et l'index du caractère.
  const { lineIndex, charIndex } = cursor.getCursorState();

  // Variables pour suivre la nouvelle position du curseur.
  let cursorLineIndex = lineIndex;
  let cursorCharIndex = charIndex;

  // Si du texte est sélectionné...
  if (selection.isTextSelected()) {
    // Récupère le début et la fin de la sélection.
    const selectionStart = selection.getSelectionStart();
    const selectionEnd = selection.getSelectionEnd();

    // Détermine si la sélection a été faite de gauche à droite ou de droite à gauche.
    const isLeftToRightSelection =
      selectionStart.lineIndex < selectionEnd.lineIndex ||
      (selectionStart.lineIndex === selectionEnd.lineIndex &&
        selectionStart.charIndex < selectionEnd.charIndex);

    // Si l'utilisateur appuie sur la flèche gauche...
    if (e.key === "ArrowLeft") {
      // Place le curseur au début de la sélection si la sélection est de gauche à droite,
      // sinon place le curseur à la fin de la sélection.
      cursorLineIndex = isLeftToRightSelection
        ? selectionStart.lineIndex
        : selectionEnd.lineIndex;
      cursorCharIndex = isLeftToRightSelection
        ? selectionStart.charIndex
        : selectionEnd.charIndex;
    }
    // Si l'utilisateur appuie sur la flèche droite...
    else if (e.key === "ArrowRight") {
      // Place le curseur à la fin de la sélection si la sélection est de gauche à droite,
      // sinon place le curseur au début de la sélection.
      cursorLineIndex = isLeftToRightSelection
        ? selectionEnd.lineIndex
        : selectionStart.lineIndex;
      cursorCharIndex = isLeftToRightSelection
        ? selectionEnd.charIndex
        : selectionStart.charIndex;
    }
    // Si l'utilisateur appuie sur la flèche vers le haut...
    else if (e.key === "ArrowUp") {
      // Place le curseur au début de la sélection.
      cursorLineIndex = selectionStart.lineIndex;
      cursorCharIndex = selectionStart.charIndex;
    }
    // Si l'utilisateur appuie sur la flèche vers le bas...
    else if (e.key === "ArrowDown") {
      // Place le curseur à la fin de la sélection.
      cursorLineIndex = selectionEnd.lineIndex;
      cursorCharIndex = selectionEnd.charIndex;
    }

    // Efface la sélection après avoir appuyé sur une touche de direction.
    selection.clearSelection();
  }
  // Si aucun texte n'est sélectionné...
  else {
    // Gère le déplacement du curseur en fonction de la touche de direction pressée.
    switch (e.key) {
      case "ArrowLeft":
        if (e.metaKey) {
          // Si la touche "meta" (Cmd sur Mac, Windows sur Windows) est enfoncée, le curseur va au début de la ligne.
          cursorCharIndex = 0;
        } else {
          if (cursorCharIndex > 0) {
            // Déplace le curseur d'un caractère vers la gauche.
            cursorCharIndex--;
          } else if (cursorLineIndex > 0) {
            // Si le curseur est au début d'une ligne, il passe à la fin de la ligne précédente.
            cursorLineIndex--;
            cursorCharIndex = lines[cursorLineIndex].length;
          }
        }
        break;
      case "ArrowRight":
        if (e.metaKey) {
          // Si la touche "meta" est enfoncée, le curseur va à la fin de la ligne.
          cursorCharIndex = lines[cursorLineIndex].length;
        } else {
          if (cursorCharIndex < lines[cursorLineIndex].length) {
            // Déplace le curseur d'un caractère vers la droite.
            cursorCharIndex++;
          } else if (cursorLineIndex < lines.length - 1) {
            // Si le curseur est à la fin d'une ligne, il passe au début de la ligne suivante.
            cursorLineIndex++;
            cursorCharIndex = 0;
          }
        }
        break;
      case "ArrowUp":
        if (cursorLineIndex > 0) {
          // Déplace le curseur à la même position de caractère dans la ligne précédente.
          cursorLineIndex--;
          cursorCharIndex = Math.min(
            cursorCharIndex,
            lines[cursorLineIndex].length
          );
        }
        break;
      case "ArrowDown":
        if (cursorLineIndex < lines.length - 1) {
          // Déplace le curseur à la même position de caractère dans la ligne suivante.
          cursorLineIndex++;
          cursorCharIndex = Math.min(
            cursorCharIndex,
            lines[cursorLineIndex].length
          );
        }
        break;
    }
  }

  // Met à jour la position du curseur avec les nouvelles coordonnées calculées.
  cursor.setCursorState(cursorLineIndex, cursorCharIndex);
  cursor.updateCursorPosition(cursorLineIndex, cursorCharIndex);
}
