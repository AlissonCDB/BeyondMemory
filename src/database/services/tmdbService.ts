import { Movie } from "../../types/movie";
import { Serie, Season } from "../../types/serie";

const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY; 
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

const fetchTMDB = async (endpoint: string) => {
    if (!API_KEY) {
        console.error("ERRO: EXPO_PUBLIC_TMDB_API_KEY não encontrada");
        throw new Error("Configuração de API ausente.");
    }

    const url = `${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${API_KEY}&language=pt-BR`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
    }

    return response.json();
};

export const tmdbService = {
    // Busca detalhes de um filme
    getMovieDetails: async (movieId: number): Promise<Movie> => {
        const data = await fetchTMDB(`/movie/${movieId}`);
        return {
            api_id: data.id,
            title: data.title,
            image: data.poster_path,
            release_date: data.release_date,
            media_type: 'movie',
        };
    },

    // Busca detalhes de uma série e mapeia para a interface Serie
    getSerieDetails: async (tvId: number): Promise<Serie> => {
        const data = await fetchTMDB(`/tv/${tvId}`);
        
        // Mapeia o array de temporadas da API para o seu tipo Season (number[])
        // Filtramos a 'Temporada 0' (especiais) que o TMDB costuma enviar
        const mappedSeasons: Season = data.seasons
            .filter((s: any) => s.season_number > 0)
            .map((s: any) => s.episode_count);

        return {
            api_id: data.id,
            name: data.name,
            image: data.poster_path,
            air_date: data.first_air_date,
            media_type: 'tv',
            seasons: mappedSeasons,
            // ALINHAMENTO UX: Iniciar a série no episódio 0 para ativar o botão "Iniciar"
            current_progress: { season: 1, episode: 0 } 
        };
    },

    getImageUrl: (path: string | null) =>
        path ? `${IMAGE_URL}${path}` : 'https://via.placeholder.com/500x750?text=Sem+Imagem',

    // Busca geral (usada na listagem de pesquisa)
    searchMulti: async (query: string): Promise<any[]> => {
        const data = await fetchTMDB(`/search/multi?query=${encodeURIComponent(query)}`);

        return data.results
            .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
            .map((item: any) => ({
                api_id: item.id,
                title: item.title || item.name,
                image: item.poster_path,
                release_date: item.release_date || item.first_air_date,
                media_type: item.media_type,
            }));
    },
};