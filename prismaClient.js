// Importation de PrismaClient depuis le package @prisma/client
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Obtenir le chemin absolu du répertoire courant
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin absolu vers le fichier de base de données
const dbPath = path.join(__dirname, 'prisma', 'tododev.db');

// Vérifier si le répertoire prisma existe, sinon le créer
const prismaDir = path.join(__dirname, 'prisma');
if (!fs.existsSync(prismaDir)) {
  fs.mkdirSync(prismaDir, { recursive: true });
  console.log(`Répertoire prisma créé: ${prismaDir}`);
}

// Vérifier les permissions du fichier de base de données
try {
  // Si le fichier n'existe pas, on crée un fichier vide
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, '');
    console.log(`Fichier de base de données créé: ${dbPath}`);
  }
  
  // Vérifier les permissions
  fs.accessSync(dbPath, fs.constants.R_OK | fs.constants.W_OK);
  console.log(`Le fichier de base de données a les bonnes permissions: ${dbPath}`);
} catch (err) {
  console.error(`Erreur d'accès au fichier de base de données: ${err.message}`);
}

// Création d'une instance de PrismaClient avec l'URL de la base de données
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:${dbPath}`
    }
  }
});

// Exportation de l'instance prisma pour l'utiliser dans d'autres fichiers
export default prisma;
