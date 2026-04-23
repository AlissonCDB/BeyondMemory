import { getDatabase } from '../db';
import { Movie } from '../../types/movie';

export const MovieRepository = {
    saveFromApi: async (movie: Movie) => {
        const db = await getDatabase();
        if (!db) return;

        // Validação preventiva
        if (!movie.api_id) {
            console.error("Falha ao salvar: api_id ausente.");
            return;
        }

        const query = `
            INSERT INTO movies (api_id, title, release_date, image, media_type)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(api_id) DO UPDATE SET
                title = excluded.title,
                release_date = excluded.release_date,
                image = excluded.image,
                media_type = excluded.media_type;
        `;

        try {
            await db.runAsync(query, [
                movie.api_id,
                movie.title || 'Sem Título',
                movie.release_date || null,
                movie.image || null,
                movie.media_type || 'movie'
            ]);
        } catch (error) {
            console.error("Erro na persistência SQLite:", error);
        }
    },

    getAll: async (): Promise<Movie[]> => {
        const db = await getDatabase();
        if (!db) return [];
        return await db.getAllAsync<Movie>('SELECT * FROM movies ORDER BY id DESC;');
    },

    deleteByApiId: async (api_id: number) => {
        const db = await getDatabase();
        if (!db) return;
        await db.runAsync('DELETE FROM movies WHERE api_id = ?;', [api_id]);
    }
};