// src/services/tmdbService.ts

import { MediaItem, TMDBMovie, TMDBSerie } from "../../types/tmdb";

// AJUSTE AQUI: Removido o ".local"
const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY; 
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

const fetchTMDB = async (endpoint: string) => {
    if (!API_KEY) {
        console.error("ERRO: EXPO_PUBLIC_TMDB_API_KEY não encontrada no process.env");
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
    getMovieDetails: async (movieId: number): Promise<TMDBMovie> => {
        return await fetchTMDB(`/movie/${movieId}`);
    },

    getSerieDetails: async (tvId: number): Promise<TMDBSerie> => {
        return await fetchTMDB(`/tv/${tvId}`);
    },

    getImageUrl: (path: string | null) =>
        path ? `${IMAGE_URL}${path}` : 'https://via.placeholder.com/500x750?text=Sem+Imagem',

    searchMulti: async (query: string): Promise<MediaItem[]> => {
        const data = await fetchTMDB(`/search/multi?query=${encodeURIComponent(query)}`);

        return data.results
            .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
            .map((item: any) => ({
                tmdbId: item.id,
                title: item.title || item.name,
                image: item.poster_path,
                releaseDate: item.release_date || item.first_air_date,
                overview: item.overview,
                type: item.media_type,
            }));
    },
};