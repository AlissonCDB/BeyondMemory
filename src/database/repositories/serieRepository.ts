import { getDatabase } from '../db';
import { Serie, UserProgress } from '../../types/serie';

export const SerieRepository = {
    saveSerieFromApi: async (item: Serie) => {
        const db = await getDatabase();
        if (!db) return;

        // Validacao de integridade
        if (!item.api_id) {
            console.error("Falha ao salvar: api_id e obrigatorio.");
            return;
        }

        const query = `
            INSERT INTO series (
                api_id, name, air_date, image, media_type, seasons, current_progress
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(api_id) DO UPDATE SET
                name = excluded.name,
                air_date = excluded.air_date,
                image = excluded.image,
                media_type = excluded.media_type,
                seasons = excluded.seasons,
                current_progress = excluded.current_progress;
        `;

        try {
            // Serializacao de campos complexos para JSON string
            const seasonsJson = item.seasons ? JSON.stringify(item.seasons) : JSON.stringify([]);
            const progressJson = item.current_progress
                ? JSON.stringify(item.current_progress)
                : JSON.stringify({ season: 1, episode: 1 });

            await db.runAsync(query, [
                item.api_id,
                item.name || 'Sem Titulo',
                item.air_date || null,
                item.image || null,
                item.media_type || 'tv',
                seasonsJson,
                progressJson
            ]);

            console.log(`Sucesso ao persistir serie: ${item.name}`);
        } catch (error) {
            console.error("Erro interno no SQLite ao salvar serie:", error);
        }
    },

    getAll: async (): Promise<Serie[]> => {
        try {
            const db = await getDatabase();
            if (!db) {
                console.error("getAll: Banco nao encontrado");
                return [];
            }

            // Tente rodar a query pura primeiro para testar
            const result = await db.getAllAsync<any>('SELECT * FROM series ORDER BY id DESC;');

            return result.map(row => ({
                ...row,
                // Proteção contra JSON corrompido ou nulo
                seasons: row.seasons ? JSON.parse(row.seasons) : [],
                current_progress: row.current_progress
                    ? JSON.parse(row.current_progress)
                    : { season: 1, episode: 1 }
            }));
        } catch (error) {
            console.error("Falha critica no SerieRepository.getAll:", error);
            return []; // Retorna lista vazia para nao travar o app
        }
    },

    deleteByApiId: async (api_id: number) => {
        const db = await getDatabase();
        if (!db) return;

        try {
            // Importante: Verifique se a coluna no banco e realmente api_id
            const result = await db.runAsync('DELETE FROM series WHERE api_id = ?;', [api_id]);

            // Se changes for 0, o ID passado nao existe na coluna api_id desta tabela
            console.log(`Delecao executada. Linhas afetadas: ${result.changes}`);
        } catch (error) {
            console.error("Erro ao deletar no SQLite:", error);
        }
    },

    updateProgress: async (api_id: number, newProgress: UserProgress) => {
        const db = await getDatabase();
        if (!db) return;

        try {
            const progressJson = JSON.stringify(newProgress);
            await db.runAsync(
                'UPDATE series SET current_progress = ? WHERE api_id = ?;',
                [progressJson, api_id]
            );
        } catch (error) {
            console.error("Erro ao atualizar progresso da série:", error);
        }
    }
};