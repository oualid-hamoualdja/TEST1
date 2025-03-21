import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir le chemin absolu du répertoire courant
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin vers le fichier de base de données
const dbPath = path.join(__dirname, 'database.sqlite');

// Fonction pour initialiser la connexion à la base de données
export async function getDb() {
  try {
    // Ouvrir une connexion à la base de données
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    console.log('Connexion à la base de données établie avec succès.');
    
    // Créer les tables si elles n'existent pas
    await initDb(db);
    
    return db;
  } catch (error) {
    console.error('Erreur lors de la connexion à la base de données:', error);
    throw error;
  }
}

// Fonction pour initialiser les tables de la base de données
async function initDb(db) {
  try {
    // Création de la table User
    await db.exec(`
      CREATE TABLE IF NOT EXISTS User (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Création de la table Priority
    await db.exec(`
      CREATE TABLE IF NOT EXISTS Priority (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
      )
    `);

    // Création de la table Status
    await db.exec(`
      CREATE TABLE IF NOT EXISTS Status (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
      )
    `);

    // Création de la table Task
    await db.exec(`
      CREATE TABLE IF NOT EXISTS Task (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        priorityId INTEGER NOT NULL,
        statusId INTEGER NOT NULL,
        userId INTEGER NOT NULL,
        deadline DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (priorityId) REFERENCES Priority(id) ON DELETE CASCADE,
        FOREIGN KEY (statusId) REFERENCES Status(id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
      )
    `);

    // Création de la table History
    await db.exec(`
      CREATE TABLE IF NOT EXISTS History (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        taskId INTEGER NOT NULL,
        modifiedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        modifiedBy INTEGER NOT NULL,
        action TEXT,
        FOREIGN KEY (taskId) REFERENCES Task(id) ON DELETE CASCADE
      )
    `);

    // Vérifier si les données initiales existent déjà
    const statusCount = await db.get('SELECT COUNT(*) as count FROM Status');
    const priorityCount = await db.get('SELECT COUNT(*) as count FROM Priority');
    const userCount = await db.get('SELECT COUNT(*) as count FROM User');

    // Insérer les données initiales si nécessaire
    if (statusCount.count === 0) {
      await db.exec(`
        INSERT INTO Status (name) VALUES 
        ('TODO'),
        ('IN_PROGRESS'),
        ('IN_REVIEW'),
        ('DONE')
      `);
      console.log('Statuts initiaux créés');
    }

    if (priorityCount.count === 0) {
      await db.exec(`
        INSERT INTO Priority (name) VALUES 
        ('Low'),
        ('Medium'),
        ('High')
      `);
      console.log('Priorités initiales créées');
    }

    if (userCount.count === 0) {
      await db.exec(`
        INSERT INTO User (username, password) VALUES 
        ('admin', 'admin123')
      `);
      console.log('Utilisateur admin créé');
    }

    console.log('Base de données initialisée avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    throw error;
  }
}

// Singleton pour la connexion à la base de données
let dbInstance = null;

export async function getDbInstance() {
  if (!dbInstance) {
    dbInstance = await getDb();
  }
  return dbInstance;
}
