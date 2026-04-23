import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

const DATABASE_NAME = 'beyond_memory.db';
let database: SQLite.SQLiteDatabase | null = null;
// Criamos uma variável para guardar o status da inicialização
let dbInitPromise: Promise<SQLite.SQLiteDatabase | null> | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase | null> {
    if (Platform.OS === 'web') {
        console.warn('SQLite não é suportado no navegador. Use um emulador ou dispositivo físico.');
        return null;
    }

    // 1. Se o banco já foi aberto e está pronto, retorna ele
    if (database !== null) {
        return database;
    }

    // 2. Se o banco ESTÁ SENDO aberto por outra chamada, aguarda ela terminar (Evita a falha de concorrência)
    if (dbInitPromise !== null) {
        return dbInitPromise;
    }

    // 3. Inicia o processo de abertura do banco de forma segura
    dbInitPromise = (async () => {
        try {
            const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
            await runMigrations(db);
            database = db; // Salva a instância pronta
            return db;
        } catch (error) {
            console.error("Erro critico ao inicializar banco de dados:", error);
            dbInitPromise = null; // Reseta caso dê erro para permitir nova tentativa
            return null;
        }
    })();

    return dbInitPromise;
}

async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
    await db.execAsync('PRAGMA foreign_keys = ON;');
    await db.execAsync('PRAGMA journal_mode = WAL;');

    await db.execAsync(`
        -- Tabela de filmes
        CREATE TABLE IF NOT EXISTS movies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            api_id INTEGER NOT NULL UNIQUE,
            title TEXT NOT NULL,
            release_date TEXT,
            image TEXT,
            media_type TEXT NOT NULL
        );

        -- Tabela de séries
        CREATE TABLE IF NOT EXISTS series (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            api_id INTEGER UNIQUE,
            name TEXT,
            air_date TEXT,
            image TEXT,
            media_type TEXT,
            seasons TEXT,
            current_progress TEXT
        );
    `);
}