import { getDatabase } from '../database';
import { Book, CreateBookInput } from '../../types/book';

export const BookRepository = {
    create: async (book: CreateBookInput) => {
        const db = await getDatabase();
        return await db.runAsync(
            'INSERT INTO books (title, type_id, chapter, url, created_at) VALUES (?, ?, ?, ?, datetime("now", "localtime"));',
            [book.title, book.type_id, book.chapter, book.url]
        );
    },
    getAll: async () => {
        const db = await getDatabase();
        return await db.getAllAsync<Book>('SELECT * FROM books ORDER BY created_at DESC;');
    },
    getById: async (id: number) => {
        const db = await getDatabase();
        return await db.getFirstAsync<Book>('SELECT * FROM books WHERE id = ?;', [id]);
    },
    update: async (id: number, book: Partial<Book>) => {
        const db = await getDatabase();
        return await db.runAsync(
            'UPDATE books SET title = ?, type_id = ?, chapter = ?, url = ? WHERE id = ?;',
            [
                book.title ?? '',          // Se for undefined, manda string vazia
                book.type_id ?? 1,         // Se for undefined, manda um id padrão
                book.chapter ?? 0,         // Se for undefined, manda 0
                book.url ?? null,          // URL pode ser NULL no banco
                id
            ]
        );
    },
    delete: async (id: number) => {
        const db = await getDatabase();
        await db.runAsync('DELETE FROM books WHERE id = ?;', [id]);
    }
};