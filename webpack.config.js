const path = require("path");

module.exports = {
  entry: "./src/index.ts", // Point d'entrée de l'application
  output: {
    filename: "bundle.js", // Nom du fichier de sortie
    path: path.resolve(__dirname, "public"), // Répertoire de sortie
  },
  devServer: {
    static: "./public", // Serveur de développement servira les fichiers du répertoire 'public'
    hot: true, // Activer le rechargement à chaud
  },
  resolve: {
    extensions: [".ts", ".js"], // Extensions de fichiers à traiter
  },
  module: {
    rules: [
      {
        test: /\.ts$/, // Fichiers à traiter par ts-loader
        exclude: /node_modules/,
        use: "ts-loader",
      },
      {
        test: /\.css$/, // Fichiers à traiter par les loaders CSS
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
