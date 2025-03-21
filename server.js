import "dotenv/config";

// Importer les routes
import statusRoutes from "./routes/statusRoutes.js";
import priorityRoutes from "./routes/priorityRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js"; // Ajout des routes task

// Importation des fichiers et librairies
import { engine } from "express-handlebars";
import express, { json } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import cspOption from "./csp-options.js";



// Création du serveur express
const app = express();
app.engine("handlebars", engine()); //Pour informer express que l'on utilise handlebars
app.set("view engine", "handlebars"); //Pour dire a express que le moteur de rendu est handlebars
app.set("views", "./views"); //Pour dire a express ou se trouvent les vues

// Ajout de middlewares
app.use(helmet(cspOption));
app.use(compression());
app.use(cors());
app.use(json());

// Middleware intégré à Express pour gérer la partie statique du serveur
app.use(express.static("public"));

// Ajout des routes
app.use("/api/status", statusRoutes);
app.use("/api/priority", priorityRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/task", taskRoutes); // Ajout des routes de réservation

//route default
app.get("/", (req, res) => {
 res.render("index", {
  titre: "TODO App",
  styles: ["css/style.css"],
  scripts: ["./js/main.js", "./js/validation.js"],
 });
});

app.get("/accueil", (req, res) => {
 res.render("index", {
  titre: "TODO App",
  styles: ["css/style.css"],
  scripts: ["./js/main.js", "./js/validation.js"],
 });
});

app.get("/history", (req, res) => {
 res.render("history", {
  titre: "TODO App",
  styles: ["css/style.css"],
  scripts: ["./js/main.js"],
 });
});

app.get("/status", (req, res) => {
 res.render("status", {
  titre: "TODO App",
  styles: ["css/style.css"],
  scripts: ["./js/main.js"],
 });
});

app.get("/priority", (req, res) => {
 res.render("priority", {
  titre: "TODO App",
  styles: ["css/style.css"],
  scripts: ["./js/main.js"],
 });
});

// Gestion des erreurs 404
app.use((request, response) => {
 console.log(`Route non trouvée : ${request.originalUrl}`);
 response
  .status(404)
  .json({ error: `${request.originalUrl} Route introuvable.` });
});

// Middleware global pour gérer les erreurs serveur
app.use((err, req, res, next) => {
 console.error("Erreur serveur :", err);
 res.status(500).json({ error: "Erreur interne du serveur." });
});


// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
 console.info(` Serveur démarré sur http://localhost:${PORT}`);
});


