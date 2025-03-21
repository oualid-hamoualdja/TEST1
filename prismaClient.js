// Importation de PrismaClient depuis le package @prisma/client
import { PrismaClient } from "@prisma/client";

// Création d'une instance de PrismaClient pour interagir avec la base de données
const prisma = new PrismaClient();

// Exportation de l'instance `prisma` pour l'utiliser dans d'autres fichiers
export { prisma };
