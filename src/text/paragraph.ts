export class Paragraph {
  // Déclare une propriété statique qui contient les lignes de texte. Initialement, elle contient une ligne vide.
  private static lines: string[] = [""];

  // Ajoute une nouvelle ligne vide à la fin du tableau de lignes.
  public static addNewLine() {
    this.lines.push(""); // Ajoute une chaîne vide à la fin du tableau 'lines'.
  }

  // Fusionne la ligne à l'index donné avec la ligne précédente, puis supprime la ligne fusionnée.
  public static mergeLine(lineIndex: number) {
    // Vérifie que l'index de la ligne est supérieur à 0 (c'est-à-dire qu'il y a une ligne précédente à fusionner).
    if (lineIndex > 0) {
      // Ajoute le contenu de la ligne actuelle à la fin de la ligne précédente.
      this.lines[lineIndex - 1] += this.lines[lineIndex];
      // Supprime la ligne actuelle du tableau après la fusion.
      this.lines.splice(lineIndex, 1);
    }
  }

  // Retourne toutes les lignes de texte sous forme de tableau de chaînes.
  public static getTextLines(): string[] {
    return this.lines; // Retourne la propriété statique 'lines'.
  }

  // Remplace toutes les lignes de texte par un nouveau tableau de lignes fourni en argument.
  public static setTextLines(newLines: string[]) {
    this.lines = newLines; // Remplace l'ensemble du tableau 'lines' par 'newLines'.
  }

  // Ajoute un texte à une position spécifique dans une ligne donnée.
  public static addTextAtPosition(
    lineIndex: number, // L'index de la ligne où le texte doit être ajouté.
    charIndex: number, // L'index du caractère dans la ligne où le texte doit être inséré.
    text: string // Le texte à ajouter.
  ) {
    const line = this.lines[lineIndex]; // Récupère la ligne à l'index spécifié.
    // Insère le texte dans la ligne à la position spécifiée.
    this.lines[lineIndex] =
      line.slice(0, charIndex) + text + line.slice(charIndex);
  }

  // Supprime le caractère à une position spécifique dans une ligne donnée.
  public static removeLastCharacter(lineIndex: number, charIndex: number) {
    const line = this.lines[lineIndex]; // Récupère la ligne à l'index spécifié.
    // Supprime le caractère à la position 'charIndex' en combinant les parties avant et après ce caractère.
    this.lines[lineIndex] =
      line.slice(0, charIndex) + line.slice(charIndex + 1);
  }

  // Divise une ligne en deux à une position spécifique.
  public static splitLineAtPosition(lineIndex: number, charIndex: number) {
    const line = this.lines[lineIndex]; // Récupère la ligne à l'index spécifié.
    const beforeCursor = line.slice(0, charIndex); // Partie de la ligne avant l'index du curseur.
    const afterCursor = line.slice(charIndex); // Partie de la ligne après l'index du curseur.
    // Remplace la ligne originale par la partie avant le curseur.
    this.lines[lineIndex] = beforeCursor;
    // Insère une nouvelle ligne après l'actuelle contenant la partie après le curseur.
    this.lines.splice(lineIndex + 1, 0, afterCursor);
  }
}
