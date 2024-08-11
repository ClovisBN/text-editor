import { Paragraph } from "../text/paragraph";
import { Cursor } from "./cursor";

export class Selection {
  // Propriétés de la classe
  private ctx: CanvasRenderingContext2D; // Contexte de dessin pour le canevas
  private isSelecting = false; // Indique si une sélection est en cours
  private selectionStart = { lineIndex: 0, charIndex: 0 }; // Position de début de la sélection (ligne et caractère)
  private selectionEnd = { lineIndex: 0, charIndex: 0 }; // Position de fin de la sélection (ligne et caractère)
  private cursor: Cursor; // Référence au curseur pour gérer sa position et son affichage

  // Constructeur qui initialise le contexte de dessin et la gestion des événements de la souris
  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx; // Stocke le contexte de dessin
    this.cursor = {} as Cursor; // Initialise un curseur vide qui sera défini ultérieurement
    this.initializeMouseMoveEvent(); // Appelle la méthode pour initialiser les événements liés au mouvement de la souris
  }

  // Méthode pour associer un curseur à cette instance de sélection
  public setCursor(cursor: Cursor) {
    this.cursor = cursor; // Associe l'objet curseur passé en paramètre à la sélection
  }

  // Initialisation des événements de mouvement de la souris pour suivre la sélection en cours
  private initializeMouseMoveEvent() {
    // Ajoute un écouteur d'événement pour le mouvement de la souris
    this.ctx.canvas.addEventListener("mousemove", (event) =>
      this.handleMouseMove(event)
    );
    // Lorsque la souris quitte le canevas, le curseur revient à son style par défaut
    this.ctx.canvas.addEventListener(
      "mouseleave",
      () => (this.ctx.canvas.style.cursor = "default")
    );
  }

  // Méthode pour effacer la sélection actuelle et mettre à jour l'affichage du curseur
  public clearSelection() {
    // Réinitialise les positions de début et de fin de la sélection
    this.selectionStart = { lineIndex: 0, charIndex: 0 };
    this.selectionEnd = { lineIndex: 0, charIndex: 0 };
    this.isSelecting = false; // Indique qu'aucune sélection n'est en cours
    this.cursor.setSelecting(false); // Met à jour le curseur pour qu'il redevienne visible
    this.cursor.clearAndRedraw(); // Efface et redessine le canevas
  }

  // Méthode pour dessiner la sélection actuelle sur le canevas
  public drawSelection() {
    const lines = Paragraph.getTextLines(); // Récupère toutes les lignes de texte
    const start = this.selectionStart; // Position de début de la sélection
    const end = this.selectionEnd; // Position de fin de la sélection

    // Si une sélection est active ou si la sélection couvre plusieurs caractères, elle est dessinée
    if (
      this.isSelecting ||
      start.lineIndex !== end.lineIndex ||
      start.charIndex !== end.charIndex
    ) {
      console.log("drawSelection called");
      this.ctx.fillStyle = "rgba(0, 0, 255, 0.3)"; // Définition de la couleur de surlignage de la sélection

      // Trie la sélection pour toujours commencer par le point le plus en haut à gauche
      const [top, bottom] = [start, end].sort((a, b) => {
        if (a.lineIndex === b.lineIndex) {
          return a.charIndex - b.charIndex;
        }
        return a.lineIndex - b.lineIndex;
      });

      // Si la sélection est sur une seule ligne
      if (top.lineIndex === bottom.lineIndex) {
        const line = lines[top.lineIndex]; // Récupère la ligne de texte correspondante
        const textBeforeStart = line.substring(0, top.charIndex); // Texte avant le début de la sélection
        const textBeforeEnd = line.substring(0, bottom.charIndex); // Texte avant la fin de la sélection
        const startX = 10 + this.ctx.measureText(textBeforeStart).width; // Position en x du début de la sélection
        const endX = 10 + this.ctx.measureText(textBeforeEnd).width; // Position en x de la fin de la sélection
        const y = 20 + top.lineIndex * 20; // Position en y de la sélection
        this.ctx.fillRect(startX, y - 15, endX - startX, 20); // Dessine un rectangle pour surligner la sélection
      } else {
        // Si la sélection couvre plusieurs lignes
        for (let i = top.lineIndex; i <= bottom.lineIndex; i++) {
          const line = lines[i];
          if (line === undefined) continue; // Si la ligne est indéfinie, passe à la suivante

          if (i === top.lineIndex) {
            // Dessine la partie sélectionnée de la première ligne
            const textBeforeStart = line.substring(0, top.charIndex);
            const startX = 10 + this.ctx.measureText(textBeforeStart).width;
            const y = 20 + i * 20;
            this.ctx.fillRect(
              startX,
              y - 15,
              this.ctx.canvas.width - startX,
              20
            );
          } else if (i === bottom.lineIndex) {
            // Dessine la partie sélectionnée de la dernière ligne
            const textBeforeEnd = line.substring(0, bottom.charIndex);
            const endX = 10 + this.ctx.measureText(textBeforeEnd).width;
            const y = 20 + i * 20;
            this.ctx.fillRect(10, y - 15, endX - 10, 20);
          } else {
            // Dessine une ligne entière si elle est entièrement sélectionnée
            const y = 20 + i * 20;
            this.ctx.fillRect(10, y - 15, this.ctx.canvas.width - 10, 20);
          }
        }
      }
    }
  }

  // Met à jour le style du curseur en fonction de la position de la souris sur le canevas
  private updateCursorStyle(event: MouseEvent) {
    const rect = this.ctx.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left; // Coordonnée x relative à la position du canevas
    const y = event.clientY - rect.top; // Coordonnée y relative à la position du canevas

    const lines = Paragraph.getTextLines(); // Récupère toutes les lignes de texte
    const lineIndex = Math.floor((y - 5) / 20); // Calcule la ligne sur laquelle se trouve la souris

    if (lineIndex >= 0 && lineIndex < lines.length) {
      const line = lines[lineIndex] || "";
      let width = 10;

      // Parcourt chaque caractère de la ligne pour trouver la position exacte de la souris
      for (let i = 0; i < line.length; i++) {
        const charWidth = this.ctx.measureText(line[i]).width;
        if (x < width + charWidth) {
          this.ctx.canvas.style.cursor = "text"; // Si la souris est au-dessus d'un caractère, le curseur devient "texte"
          return;
        }
        width += charWidth;
      }
    }

    // Si la souris n'est pas au-dessus du texte, le curseur revient à son style par défaut
    this.ctx.canvas.style.cursor = "default";
  }

  // Gère l'événement de clic de la souris pour démarrer une sélection
  public handleMouseDown(event: MouseEvent) {
    console.log("handleMouseDown called");
    if (this.isTextSelected()) {
      this.clearSelection(); // Si du texte est déjà sélectionné, efface la sélection avant de commencer une nouvelle
    }

    const rect = this.ctx.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left; // Coordonnée x du clic de la souris
    const y = event.clientY - rect.top; // Coordonnée y du clic de la souris

    const lines = Paragraph.getTextLines(); // Récupère toutes les lignes de texte
    const lineIndex = Math.min(Math.floor((y - 5) / 20), lines.length - 1); // Calcule la ligne cliquée
    const line = lines[lineIndex] || ""; // Récupère le texte de la ligne cliquée
    let charIndex = line.length; // Initialise l'index de caractère à la fin de la ligne
    let width = 10;

    // Parcourt la ligne pour trouver le caractère cliqué
    for (let i = 0; i < line.length; i++) {
      const charWidth = this.ctx.measureText(line[i]).width;
      if (x < width + charWidth) {
        charIndex = i;
        break;
      }
      width += charWidth;
    }

    // Initialise la sélection au caractère cliqué
    this.selectionStart = { lineIndex, charIndex };
    this.selectionEnd = { lineIndex, charIndex };
    this.isSelecting = true; // Marque le début de la sélection
    this.cursor.setSelecting(true); // Cache le curseur pendant la sélection
    this.cursor.clearAndRedraw(); // Efface et redessine le canevas
  }

  // Gère l'événement de déplacement de la souris pour ajuster la sélection
  public handleMouseMove(event: MouseEvent) {
    if (this.isSelecting) {
      console.log("handleMouseMove called");
      const rect = this.ctx.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left; // Coordonnée x du mouvement de la souris
      const y = event.clientY - rect.top; // Coordonnée y du mouvement de la souris

      const lines = Paragraph.getTextLines(); // Récupère toutes les lignes de texte
      const lineIndex = Math.min(Math.floor((y - 5) / 20), lines.length - 1); // Calcule la ligne où la souris a été déplacée
      const line = lines[lineIndex] || ""; // Récupère le texte de la ligne actuelle
      let charIndex = line.length; // Initialise l'index de caractère à la fin de la ligne
      let width = 10;

      // Parcourt la ligne pour trouver le caractère sous la souris
      for (let i = 0; i < line.length; i++) {
        const charWidth = this.ctx.measureText(line[i]).width;
        if (x < width + charWidth) {
          charIndex = i;
          break;
        }
        width += charWidth;
      }

      // Met à jour la fin de la sélection en fonction du mouvement de la souris
      this.selectionEnd = { lineIndex, charIndex };
      this.cursor.setSelecting(true); // Maintient le curseur caché pendant la sélection
      this.cursor.clearAndRedraw(); // Efface et redessine le canevas
    }

    this.updateCursorStyle(event); // Met à jour le style du curseur en fonction de la position actuelle de la souris
  }

  // Gère l'événement de relâchement de la souris pour terminer la sélection
  public handleMouseUp(event: MouseEvent) {
    if (this.isSelecting) {
      console.log("handleMouseUp called");
      this.isSelecting = false; // La sélection est terminée
      if (this.isTextSelected()) {
        this.cursor.setSelecting(true); // Le curseur reste caché si du texte est sélectionné
      } else {
        this.cursor.setSelecting(false); // Sinon, le curseur redevient visible
      }
      this.cursor.updateCursorPosition(
        this.selectionEnd.lineIndex,
        this.selectionEnd.charIndex
      ); // Met à jour la position du curseur à la fin de la sélection
      this.cursor.clearAndRedraw(); // Efface et redessine le canevas
    }
  }

  // Renvoie la position de fin de la sélection
  public getSelectionEnd() {
    return this.selectionEnd;
  }

  // Renvoie la position de début de la sélection
  public getSelectionStart() {
    return this.selectionStart;
  }

  // Définir manuellement une sélection de texte
  public setSelection(
    startLine: number,
    startChar: number,
    endLine: number,
    endChar: number
  ) {
    this.selectionStart = { lineIndex: startLine, charIndex: startChar }; // Définit la position de début de la sélection
    this.selectionEnd = { lineIndex: endLine, charIndex: endChar }; // Définit la position de fin de la sélection
    this.isSelecting = false; // La sélection est terminée
    this.cursor.setSelecting(false); // Le curseur redevient visible
    this.cursor.clearAndRedraw(); // Efface et redessine le canevas
  }

  // Supprimer le texte sélectionné et
  public deleteSelectedText() {
    const lines = Paragraph.getTextLines(); // Récupère toutes les lignes de texte
    let { lineIndex: startLine, charIndex: startChar } = this.selectionStart; // Position de début de la sélection
    let { lineIndex: endLine, charIndex: endChar } = this.selectionEnd; // Position de fin de la sélection

    // S'assure que startLine/startChar est avant endLine/endChar
    if (startLine > endLine || (startLine === endLine && startChar > endChar)) {
      [startLine, endLine] = [endLine, startLine];
      [startChar, endChar] = [endChar, startChar];
    }

    // Supprime le texte sélectionné
    if (startLine === endLine) {
      lines[startLine] =
        lines[startLine].substring(0, startChar) +
        lines[endLine].substring(endChar);
    } else {
      const firstPart = lines[startLine].substring(0, startChar);
      const lastPart = lines[endLine].substring(endChar);
      lines[startLine] = firstPart + lastPart;
      lines.splice(startLine + 1, endLine - startLine);
    }

    this.clearSelection(); // Efface la sélection actuelle
    this.cursor.updateCursorPosition(startLine, startChar); // Met à jour la position du curseur
    this.cursor.clearAndRedraw(); // Efface et redessine le canevas
  }

  // Vérifie si du texte est actuellement sélectionné
  public isTextSelected(): boolean {
    return (
      this.selectionStart.lineIndex !== this.selectionEnd.lineIndex ||
      this.selectionStart.charIndex !== this.selectionEnd.charIndex
    );
  }
}
