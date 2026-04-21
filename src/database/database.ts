import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'books.db';
let database: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
    if (database !== null) {
        return database;
    }
    database = await SQLite.openDatabaseAsync(DATABASE_NAME);
    await runMigrations(database);
    return database;
}

async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
    // Habilita chaves estrangeiras
    await db.execAsync('PRAGMA foreign_keys = ON;');
    await db.execAsync('PRAGMA journal_mode = WAL;');

    await db.execAsync(`
        -- Tabela de tipos de livros
        CREATE TABLE IF NOT EXISTS book_types (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        );

        -- Tabela de livros (corrigida)
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            type_id INTEGER NOT NULL,
            chapter INTEGER,
            url TEXT,
            created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
            FOREIGN KEY (type_id) REFERENCES book_types (id) ON DELETE CASCADE
        );
    `);
}