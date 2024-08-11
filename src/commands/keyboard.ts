// Importation des modules nécessaires pour le fonctionnement du gestionnaire de clavier.
import { Cursor } from "../canvas/cursor";
import { Renderer } from "../canvas/render";
import { Selection } from "../canvas/selection";
import { handlePrintableKey } from "./keyMethods/handlePrintableKey";
import { handleBackspace } from "./keyMethods/handleBackspace";
import { handleEnter } from "./keyMethods/handleEnter";
import { handleArrowKeys } from "./keyMethods/handleArrowKeys";
import { handleSpace } from "./keyMethods/handleSpace";
import { Paragraph } from "../text/paragraph";

// Interface pour structurer le document JSON
interface DocumentStructure {
  documentTitle: string;
  documentId: string;
  body: {
    paragraphs: {
      elements: {
        textRun: {
          content: string;
          textStyle: any;
        };
      }[];
      paragraphStyle: any;
    }[];
  };
}

// Déclaration de la classe KeyboardHandler qui gère les événements liés au clavier.
export class KeyboardHandler {
  // Propriétés privées pour gérer le curseur, le rendu et la sélection de texte.
  private cursor: Cursor;
  private renderer: Renderer;
  private selection: Selection;

  // Constructeur de la classe KeyboardHandler qui initialise les propriétés.
  constructor(cursor: Cursor, renderer: Renderer, selection: Selection) {
    this.cursor = cursor; // Initialise le curseur.
    this.renderer = renderer; // Initialise le renderer pour gérer l'affichage.
    this.selection = selection; // Initialise la sélection de texte.
    this.initializeKeyboardEvents(); // Appelle la méthode pour initialiser les événements clavier.
  }

  // Méthode privée pour initialiser les événements clavier.
  private initializeKeyboardEvents() {
    // Ajoute un écouteur d'événement pour les pressions de touches.
    document.addEventListener("keydown", (e) => this.handleKeyDown(e));
  }

  // Méthode privée pour gérer les événements de pression de touches.
  private handleKeyDown(e: KeyboardEvent) {
    // Vérifie s'il y a du texte sélectionné.
    if (this.selection.isTextSelected()) {
      // Si la touche pressée est Backspace, Delete ou Espace, gère la suppression du texte sélectionné.
      if (e.key === "Backspace" || e.key === "Delete" || e.key === " ") {
        if (e.key === "Backspace" || e.key === "Delete") {
          this.selection.deleteSelectedText(); // Supprime le texte sélectionné.
        } else if (e.key === " ") {
          handleSpace(this.cursor, this.selection); // Gère l'ajout d'un espace après la suppression du texte sélectionné.
        }
        return; // Quitte la méthode après avoir géré la suppression.
      }
    }

    // Vérifie si la touche est imprimable (lettres, chiffres, etc.).
    if (this.isPrintableKey(e)) {
      handlePrintableKey(e, this.cursor, this.selection); // Gère les touches imprimables.
    } else {
      // Sinon, traite les autres touches en fonction de leur type.
      switch (e.key) {
        case "Enter":
          handleEnter(this.cursor, this.selection); // Gère la touche Entrée.
          break;
        case "Backspace":
          handleBackspace(this.cursor, this.selection); // Gère la touche Retour arrière.
          break;
        case "ArrowLeft":
        case "ArrowRight":
        case "ArrowUp":
        case "ArrowDown":
          handleArrowKeys(e, this.cursor, this.selection); // Gère les touches fléchées.
          break;
        case " ":
          handleSpace(this.cursor, this.selection); // Gère la barre d'espace.
          break;
        case "Home":
          // Déplace le curseur au début de la ligne.
          this.cursor.updateCursorPosition(
            this.cursor.getCursorState().lineIndex,
            0
          );
          break;
        case "End":
          // Déplace le curseur à la fin de la ligne.
          this.cursor.updateCursorPosition(
            this.cursor.getCursorState().lineIndex,
            Paragraph.getTextLines()[this.cursor.getCursorState().lineIndex]
              .length
          );
          break;
        // Ignore les touches de modification sans action supplémentaire.
        case "Control":
        case "Alt":
        case "Meta":
        case "Shift":
          return;
        default:
          return;
      }
    }

    // Rafraîchit l'affichage du curseur et du texte après chaque action.
    this.cursor.clearAndRedraw();
    // Affiche l'état du texte dans la console pour le débogage.
    console.log(this.getTextState());
  }

  // Méthode privée pour vérifier si une touche est imprimable.
  private isPrintableKey(event: KeyboardEvent): boolean {
    const key = event.key;
    // Une touche est considérée comme imprimable si sa longueur est de 1 (lettres, chiffres, etc.)
    // et si les touches Ctrl et Meta ne sont pas pressées.
    return key.length === 1 && !event.ctrlKey && !event.metaKey;
  }

  // Méthode privée pour obtenir l'état actuel du texte sous forme d'un objet DocumentStructure.
  private getTextState(): DocumentStructure {
    return {
      documentTitle: "My Document Title", // Titre du document
      documentId: "123456789", // ID du document
      body: {
        paragraphs: Paragraph.getTextLines().map((line) => ({
          elements: [
            {
              textRun: {
                content: line, // Contenu du texte pour chaque ligne.
                textStyle: {}, // Styles de texte (vide par défaut).
              },
            },
          ],
          paragraphStyle: {}, // Styles de paragraphe (vide par défaut).
        })),
      },
    };
  }
}
