import { Renderer } from "./render";
import { Cursor } from "./cursor";
import { Selection } from "./selection";
import { RulerHandler } from "../commands/rulerHandler"; // Assurez-vous que RulerHandler est importé

// Cette fonction initialise le canevas et configure ses comportements
export function initializeCanvas(
  canvas: HTMLCanvasElement, // Référence au canevas HTML
  ctx: CanvasRenderingContext2D, // Contexte de dessin 2D du canevas
  cursor: Cursor, // Instance de la classe Cursor
  selection: Selection // Instance de la classe Selection
) {
  // Définit la police de caractères utilisée pour le texte dessiné sur le canevas
  ctx.font = "16px Arial";

  // Crée une instance de RulerHandler pour gérer les marges
  const rulerHandler = new RulerHandler((leftMargin, rightMargin) => {
    cursor.clearAndRedraw(); // Redessinez le texte et le curseur après la mise à jour de la marge
  });

  // Crée une instance de Renderer pour gérer le rendu du texte, en passant rulerHandler
  const renderer = new Renderer(ctx, rulerHandler);

  // Rend le texte initial sur le canevas
  renderer.renderText();

  // Dessine le curseur à sa position actuelle
  cursor.drawCursor();

  // Ajoute un événement pour redimensionner le canevas lorsque la fenêtre est redimensionnée
  window.addEventListener("resize", () => {
    // Redimensionne le canevas pour occuper 80% de la largeur et de la hauteur de la fenêtre
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;

    // Re-rend le texte et le curseur après le redimensionnement
    renderer.renderText();
    cursor.drawCursor();
  });
}
