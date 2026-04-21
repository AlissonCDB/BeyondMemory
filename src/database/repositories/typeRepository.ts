import { getDatabase } from '../database';
import { BookType } from '../../types/book';

export const TypeRepository = {
    getAll: async (): Promise<BookType[]> => {
        const db = await getDatabase();
        return await db.getAllAsync<BookType>('SELECT * FROM book_types;');
    },
    // Adiciona categorias iniciais se o banco estiver vazio
    seed: async () => {
        const db = await getDatabase();
        const types = await db.getAllAsync('SELECT * FROM book_types');
        if (types.length === 0) {
            await db.runAsync("INSERT INTO book_types (name) VALUES ('Manga'), ('Light Novel'), ('Livro');");
        }
    }
};